import studentData from "../data/students.js"
import { availabilityData } from "../data/availibility.js"
import {
    improveGroups,
    enforceSharedAvailability,
    resolveUnavailableTeams,
    hasSharedAvailability,
    isGenderBalanced,
    calculateGroupScore
} from "./grouperImprover.js"

const getID = (s) => s.id || s.student_id;

const { students, settings } = studentData

function buildAvailabilityMap(availabilityData) {
    const availibilityMap = {}
    for (const time of availabilityData) {
        if (!availibilityMap[time.student_id]) {
            availibilityMap[time.student_id] = [];
        }
        availibilityMap[time.student_id].push(`${time.day_of_week}-${time.time_slot}`)
    }
    return availibilityMap;
}

function grouper(studentsParam, availabilityData, teamLimitParam, limitType) {
    const studentsList = studentsParam || students;
    const normalizedLimit = limitType?.toLowerCase();
    const isMax = normalizedLimit?.startsWith('max');
    const isMin = normalizedLimit?.startsWith('min');
    // Fallback to settings if the DB limit isn't provided
    const targetSize = parseInt(teamLimitParam) || settings.teamSize || 4;

    if (studentsList.length === 0) return [];

    // Logic for Min vs Max number of groups
    let groupNum;
    if (isMin) {
        // e.g. 10 students, min 4 per team = 2 groups (5 each)
        groupNum = Math.floor(studentsList.length / targetSize);
    } else {
        // e.g. 10 students, max 4 per team = 3 groups (4, 3, 3)
        groupNum = Math.ceil(studentsList.length / targetSize);
    }

    // Ensure we have at least one group
    groupNum = Math.max(1, groupNum);

    let minSize, maxSize;

    if (isMax) {
        minSize = 2;
        maxSize = targetSize;
    } else {
        minSize = targetSize;
        maxSize = studentsList.length;
    }

    const availabilityMap = buildAvailabilityMap(availabilityData);

    let groups = findPartitionWithSharedAvailability(
        studentsList,
        availabilityMap,
        groupNum,
        minSize,
        maxSize
    );

    if (!groups) {
        const { males, others } = seperateGenders(studentsList);
        groups = makeAvailabilityAwareGroups(males, others, groupNum, availabilityMap, maxSize);
        enforceGroupSizes(groups, minSize, maxSize);
        enforceSharedAvailability(groups, availabilityMap, minSize, maxSize);
    }

    improveGroups(groups, availabilityMap, minSize, maxSize);
    enforceSharedAvailability(groups, availabilityMap, minSize, maxSize);

    return resolveUnavailableTeams(groups, availabilityMap, maxSize);
}

function enforceGroupSizes(groups, minSize, maxSize) {
    let changed = true;

    while (changed) {
        changed = false;

        for (let i = 0; i < groups.length; i++) {

            // If group too big -> move students out
            if (groups[i].length > maxSize) {
                const receiver = findGroup(groups, i, g => g.length < maxSize);
                if (receiver) {
                    receiver.push(groups[i].pop());
                    changed = true;
                }
            }

            //If group too small -> pull from larger groups
            if (groups[i].length < minSize) {
                const donor = findGroup(groups, i, g => g.length > minSize);
                if (donor) {
                    groups[i].push(donor.pop());
                    changed = true;
                }
            }
        }
    }

    return groups;
}

function findGroup(groups, exclude, condition) {
    return groups.find((group, i) => i !== exclude && condition(group));
}


function seperateGenders(studentsList) {
    const males = [];
    const others = [];

    for (const person of studentsList) {
        // Safe check for gender property
        const genderStr = person.gender ? person.gender.trim().toLowerCase() : "";
        if (genderStr === "male") males.push(person);
        else others.push(person);
    }

    return { males, others };
}

function sortByAvailabilityDifficulty(a, b, availabilityMap) {
    const slotsA = (availabilityMap[getID(a)] || []).length;
    const slotsB = (availabilityMap[getID(b)] || []).length;
    if (slotsA !== slotsB) return slotsA - slotsB;
    return a.gpa - b.gpa;
}

function computeGroupSizes(studentCount, groupNum, minSize, maxSize) {
    const base = Math.floor(studentCount / groupNum);
    let remainder = studentCount % groupNum;
    const sizes = Array(groupNum).fill(base);

    for (let i = 0; i < groupNum && remainder > 0; i++, remainder--) {
        sizes[i]++;
    }

    for (let i = 0; i < sizes.length; i++) {
        sizes[i] = Math.min(maxSize, Math.max(minSize, sizes[i]));
    }

    let total = sizes.reduce((sum, size) => sum + size, 0);
    let index = 0;

    while (total < studentCount && index < sizes.length) {
        if (sizes[index] < maxSize) {
            sizes[index]++;
            total++;
        }
        index++;
    }

    index = sizes.length - 1;
    while (total > studentCount && index >= 0) {
        if (sizes[index] > minSize) {
            sizes[index]--;
            total--;
        }
        index--;
    }

    return sizes;
}

function canAddStudentToGroup(student, group, availabilityMap) {
    const testGroup = [...group, student];
    return isGenderBalanced(testGroup) && hasSharedAvailability(testGroup, availabilityMap);
}

function findPartitionWithSharedAvailability(studentsList, availabilityMap, preferredGroupNum, minSize, maxSize) {
    const minSizesToTry = minSize > 2 ? [minSize, 2] : [minSize];

    for (const effectiveMin of minSizesToTry) {
        for (let groupNum = preferredGroupNum; groupNum <= studentsList.length; groupNum++) {
            const groupSizes = computeGroupSizes(
                studentsList.length,
                groupNum,
                effectiveMin,
                maxSize
            );

            if (groupSizes.reduce((sum, size) => sum + size, 0) !== studentsList.length) {
                continue;
            }

            const groups = partitionWithSharedAvailability(
                studentsList,
                availabilityMap,
                groupSizes,
                effectiveMin,
                maxSize
            );

            if (groups) return groups;
        }
    }

    return null;
}

function partitionWithSharedAvailability(studentsList, availabilityMap, groupSizes, minSize, maxSize) {
    const groupNum = groupSizes.length;
    const groups = Array.from({ length: groupNum }, () => []);
    const ordered = [...studentsList].sort((a, b) =>
        sortByAvailabilityDifficulty(a, b, availabilityMap)
    );

    function backtrack(studentIndex) {
        if (studentIndex === ordered.length) {
            return groups.every((group, i) => group.length === groupSizes[i]);
        }

        const student = ordered[studentIndex];
        const candidates = groupSizes
            .map((targetSize, index) => ({ index, remaining: targetSize - groups[index].length }))
            .filter(({ remaining }) => remaining > 0)
            .filter(({ index }) => canAddStudentToGroup(student, groups[index], availabilityMap))
            .map(({ index }) => ({
                index,
                score: calculateGroupScore([...groups[index], student], availabilityMap)
            }))
            .sort((a, b) => b.score - a.score);

        for (const { index } of candidates) {
            groups[index].push(student);
            if (backtrack(studentIndex + 1)) return true;
            groups[index].pop();
        }

        return false;
    }

    return backtrack(0) ? groups : null;
}

function makeAvailabilityAwareGroups(males, others, groupNum, availabilityMap, maxSize) {
    const groups = Array.from({ length: groupNum }, () => []);

    males.sort((a, b) => sortByAvailabilityDifficulty(a, b, availabilityMap));
    others.sort((a, b) => sortByAvailabilityDifficulty(a, b, availabilityMap));

    const unassigned = [];
    let maleIndex = 0;
    let otherIndex = 0;
    while (maleIndex < males.length || otherIndex < others.length) {
        if (otherIndex < others.length) unassigned.push(others[otherIndex++]);
        if (maleIndex < males.length) unassigned.push(males[maleIndex++]);
    }

    unassigned.sort((a, b) => sortByAvailabilityDifficulty(a, b, availabilityMap));

    for (const student of unassigned) {
        const candidates = groups
            .map((group, index) => ({ group, index }))
            .filter(({ group }) => group.length < maxSize)
            .filter(({ group }) => isGenderBalanced([...group, student]))
            .filter(({ group }) => hasSharedAvailability([...group, student], availabilityMap))
            .map(({ group, index }) => ({
                index,
                score: calculateGroupScore([...group, student], availabilityMap)
            }))
            .sort((a, b) => b.score - a.score);

        if (candidates.length > 0) {
            groups[candidates[0].index].push(student);
            continue;
        }

        const fallback = groups
            .filter(group => group.length < maxSize && isGenderBalanced([...group, student]))
            .sort((a, b) => a.length - b.length)[0];

        if (fallback) {
            fallback.push(student);
        }
    }

    return groups;
}

function makeBasicGroups(males, others, groupNum, targetSize) {
    const groups = Array.from({ length: groupNum }, () => []);

    males.sort((a, b) => a.gpa - b.gpa);
    others.sort((a, b) => a.gpa - b.gpa);

    let maleIndex = 0;
    let otherIndex = 0;

    // Phase 1: Initial balanced distribution (2 males, 2 others per group)
    for (let g = 0; g < groupNum; g++) {
        for (let m = 0; m < 2 && maleIndex < males.length; m++) {
            groups[g].push(males[maleIndex++]);
        }
        for (let o = 0; o < 2 && otherIndex < others.length; o++) {
            groups[g].push(others[otherIndex++]);
        }
    }

    // Phase 2: Distribute remaining males
    distributeRemainder(males, maleIndex, groups);

    // Phase 3: Distribute remaining others
    distributeRemainder(others, otherIndex, groups);

    return groups;
}

function distributeRemainder(arr, index, groups) {
    while (index < arr.length) {
        for (let g = 0; g < groups.length && index < arr.length; g++) {
            groups[g].push(arr[index++]);
        }
    }
}

export {
    grouper,
    buildAvailabilityMap,
    makeBasicGroups,
    distributeRemainder,
    seperateGenders,
    findGroup,
    enforceGroupSizes
};