import studentData from "../data/students.js"
import { availabilityData } from "../data/availibility.js"
import { improveGroups } from "./grouperImprover.js"

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
    const { males, others } = seperateGenders(studentsList);

    // Create the basic groups
    const groups = makeBasicGroups(males, others, groupNum, targetSize);

    // Enforce group size constraints
    enforceGroupSizes(groups, minSize, maxSize);

    improveGroups(groups, availabilityMap);

    return groups;
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
