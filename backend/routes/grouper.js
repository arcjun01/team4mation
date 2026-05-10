import studentData from "../data/students.js"
import { availabilityData } from "../data/availibility.js"

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
    // Fallback to settings if the DB limit isn't provided
    const targetSize = parseInt(teamLimitParam) || settings.teamSize || 4;

    if (studentsList.length === 0) return [];

    // Logic for Min vs Max number of groups
    let groupNum;
    if (limitType === 'Minimum' || limitType === 'min') {
        // e.g. 10 students, min 4 per team = 2 groups (5 each)
        groupNum = Math.floor(studentsList.length / targetSize);
    } else {
        // e.g. 10 students, max 4 per team = 3 groups (4, 3, 3)
        groupNum = Math.ceil(studentsList.length / targetSize);
    }

    // Ensure we have at least one group
    groupNum = Math.max(1, groupNum);

    let minSize, maxSize;

    if (limitType === "Maximum" || limitType === "max") {
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

            // If group too big → move students out
            while (groups[i].length > maxSize) {
                let moved = false;

                for (let j = 0; j < groups.length; j++) {
                    if (i !== j && groups[j].length < maxSize) {
                        groups[j].push(groups[i].pop());
                        moved = true;
                        changed = true;
                        break;
                    }
                }
                if (!moved) break;
            }

            //If group too small → pull from larger groups
            if (groups[i].length < minSize) {
                for (let j = 0; j < groups.length; j++) {
                    if (i !== j && groups[j].length > minSize) {
                        groups[i].push(groups[j].pop());
                        changed = true;
                        break;
                    }
                }
            }
        }
    }

    return groups;
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
    while (maleIndex < males.length) {
        for (let g = 0; g < groupNum && maleIndex < males.length; g++) {
            groups[g].push(males[maleIndex++]);
        }
    }

    // Phase 3: Distribute remaining others
    while (otherIndex < others.length) {
        for (let g = 0; g < groupNum && otherIndex < others.length; g++) {
            groups[g].push(others[otherIndex++]);
        }
    }

    return groups;
}

function improveGroups(groups, availabilityMap) {
    let improvementMade = true;
    let passCount = 0;
    const MAX_PASSES = 4;

    while (improvementMade && passCount < MAX_PASSES) {
        improvementMade = false;
        passCount++;

        for (let i = 0; i < groups.length - 1; i++) {
            for (let j = i + 1; j < groups.length; j++) {
                for (const studentA of groups[i]) {
                    for (const studentB of groups[j]) {
                        if (evalulateSwap(studentA, studentB, groups[i], groups[j], availabilityMap)) {
                            const indexA = groups[i].findIndex(s => s.id === studentA.id || s.student_id === studentA.student_id);
                            const indexB = groups[j].findIndex(s => s.id === studentB.id || s.student_id === studentB.student_id);

                            groups[i][indexA] = studentB;
                            groups[j][indexB] = studentA;
                            improvementMade = true;
                            break;
                        }
                    }
                    if (improvementMade) break;
                }
                if (improvementMade) break;
            }
            if (improvementMade) break;
        }
    }
    return groups;
}

function evalulateSwap(studentA, studentB, groupA, groupB, availabilityMap) {
    // Determine unique ID key (database uses id or student_id)
    const getID = (s) => s.id || s.student_id;

    const testA = groupA.map(student => getID(student) === getID(studentA) ? studentB : student);
    const testB = groupB.map(student => getID(student) === getID(studentB) ? studentA : student);

    if (!checkGenderRule(testA, testB)) return false;

    const currentScoreA = calculateGroupScore(groupA, availabilityMap);
    const currentScoreB = calculateGroupScore(groupB, availabilityMap);
    const testScoreA = calculateGroupScore(testA, availabilityMap);
    const testScoreB = calculateGroupScore(testB, availabilityMap);

    return (testScoreA + testScoreB) > (currentScoreA + currentScoreB);
}

function calculateScheduleOverlap(group, availabilityMap) {
    const availibilitySlots = {}
    for (const student of group) {
        const sid = student.id || student.student_id;
        const timeSlots = availabilityMap[sid] || []
        for (const slot of timeSlots) {
            availibilitySlots[slot] = (availibilitySlots[slot] || 0) + 1;
        }
    }

    let totalOverlap = 0;
    const minOverlap = Math.max(2, Math.ceil(group.length / 2));

    for (const slot of Object.keys(availibilitySlots)) {
        const count = availibilitySlots[slot];
        if (count >= minOverlap) {
            totalOverlap += count;
        }
    }

    return totalOverlap / (group.length || 1);
}

function calculateCommitmentSimilarity(group) {
    if (group.length === 0) return 0;
    let min = group[0].commitment, max = group[0].commitment;
    for (const student of group) {
        if (student.commitment > max) max = student.commitment;
        if (student.commitment < min) min = student.commitment;
    }
    let commitmentRange = max - min;
    return commitmentRange === 0 ? 0 : (-1 * commitmentRange);
}

function calculateGPASimilarity(group) {
    if (group.length === 0) return 0;
    let min = group[0].gpa, max = group[0].gpa;
    for (const student of group) {
        if (student.gpa > max) max = student.gpa;
        if (student.gpa < min) min = student.gpa;
    }
    let gpaSpread = max - min;
    return gpaSpread === 0 ? 0 : (-1 * gpaSpread);
}

function calculateGroupScore(group, availabilityMap) {
    const GPA_WEIGHT = 2, SCHEDULE_WEIGHT = 3, COMMITMENT_WEIGHT = 1;
    return (calculateGPASimilarity(group) * GPA_WEIGHT) +
        (calculateScheduleOverlap(group, availabilityMap) * SCHEDULE_WEIGHT) +
        (calculateCommitmentSimilarity(group) * COMMITMENT_WEIGHT);
}

function checkGenderRule(testA, testB) {
    return isGenderBalanced(testA) && isGenderBalanced(testB);
}

function isGenderBalanced(group) {
    // If group has 0 or 1 student, it's considered balanced
    if (group.length <= 1) return true;

    let maleCount = 0, otherCount = 0;
    for (const student of group) {
        const genderStr = student.gender ? student.gender.trim().toLowerCase() : "";
        if (genderStr === "male") maleCount++;
        else otherCount++;
    }

    if (otherCount === 0) return true; // All males is ok
    if (maleCount === 0) return true;  // All others is ok

    // Allow grouping if ratio isn't extreme (max 2:1)
    return maleCount <= (otherCount * 2) && otherCount <= (maleCount * 2);
}

export {
    grouper,
    buildAvailabilityMap,
    calculateScheduleOverlap,
    calculateGPASimilarity,
    calculateCommitmentSimilarity,
    calculateGroupScore,
    isGenderBalanced,
    makeBasicGroups
};
