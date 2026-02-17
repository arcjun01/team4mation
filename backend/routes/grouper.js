const studentData = require("../data/students.js")
const { students, settings } = studentData

function grouper() {
    const groupNum = Math.ceil(students.length / settings.teamSize);
    const { males, others } = seperateGenders();
    const groups = makeBasicGroups(males, others, groupNum);
    improveGroups(groups);

    return groups;
}

function seperateGenders() {
    const males = []
    const others = []

    for (const person of students) {
        if (person.gender === "Male") males.push(person);
        if (person.gender === "Female" || person.gender === "Other") others.push(person)
    }

    return { males, others };
}


function makeBasicGroups(males, others, groupNum) {
    const groups = Array.from({ length: groupNum }, () => []);

    // Sort each gender group by GPA
    males.sort((a, b) => a.gpa - b.gpa);
    others.sort((a, b) => a.gpa - b.gpa);

    let maleIndex = 0;
    let otherIndex = 0;

    for (let g = 0; g < groupNum; g++) {

        // Add up to 2 males
        for (let m = 0; m < 2 && maleIndex < males.length; m++) {
            groups[g].push(males[maleIndex++]);
        }

        // Add up to 2 others
        for (let o = 0; o < 2 && otherIndex < others.length; o++) {
            groups[g].push(others[otherIndex++]);
        }
    }

    // If any leftovers remain, fill remaining spots
    while (maleIndex < males.length) {
        for (let g = 0; g < groupNum && maleIndex < males.length; g++) {
            if (groups[g].length < settings.teamSize) {
                groups[g].push(males[maleIndex++]);
            }
        }
    }

    while (otherIndex < others.length) {
        for (let g = 0; g < groupNum && otherIndex < others.length; g++) {
            if (groups[g].length < settings.teamSize) {
                groups[g].push(others[otherIndex++]);
            }
        }
    }

    return groups;
}

//////////////////////////////////////////////////////

function improveGroups(groups) {

    let improvementMade = true;
    let passCount = 0;
    const MAX_PASSES = 4;

    while (improvementMade && passCount < MAX_PASSES) {

        improvementMade = false;
        passCount++;
        console.log("Checking improvement Start: improvementMade=", improvementMade, ", passCount=", passCount);
        for (let i = 0; i < groups.length - 1; i++) {
            for (let j = i + 1; j < groups.length; j++) {
                for (const studentA of groups[i]) {
                    console.log("Checking: ", studentA, " from ", groups[i]);
                    for (const studentB of groups[j]) {
                        console.log("Checking: ", studentB, " from ", groups[j]);
                        if (evalulateSwap(studentA, studentB, groups[i], groups[j])) {
                            console.log("Swap ", studentA, " and ", studentB);

                            const indexA = groups[i].findIndex(s => s.student_id === studentA.student_id);

                            const indexB = groups[j].findIndex(s => s.student_id === studentB.student_id);

                            groups[i][indexA] = studentB;
                            groups[j][indexB] = studentA;


                            improvementMade = true
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

function evalulateSwap(studentA, studentB, groupA, groupB) {
    const testA = groupA.map(student => student.student_id === studentA.student_id ? studentB : student);
    console.log("GroupA: ", groupA, " TestA: ", testA)

    const testB = groupB.map(student => student.student_id === studentB.student_id ? studentA : student);
    console.log("GroupB: ", groupB, " TestB: ", testB);

    if (!checkGenderRule(testA, testB)) {
        return false;
    }

    let currentScoreA = calculateGroupScore(groupA);
    let currentScoreB = calculateGroupScore(groupB);

    let testScoreA = calculateGroupScore(testA);
    let testScoreB = calculateGroupScore(testB);

    console.log("Current Group A: ", currentScoreA);
    console.log("Test Group A: ", testScoreA);
    console.log("Current Group B: ", currentScoreB);
    console.log("Test Group B: ", testScoreB);

    if ((testScoreA + testScoreB) > (currentScoreA + currentScoreB)) {
        return true;
    }

    return false;
}

function calculateScheduleOverlap() {

}

function calculateCommitmentVariance() {

}

function calculateGPASimilarity(group) {

    let min = group[0].gpa;
    let max = group[0].gpa;

    for (const student of group) {
        if (student.gpa > max) {
            max = student.gpa;
        }
        if (student.gpa < min) {
            min = student.gpa;
        }
    }

    let gpaSpread = max - min

    return (-1 * gpaSpread);
}

function calculateGroupScore(group) {
    const GPA_WEIGHT = 3
    const SCHEDULE_WEIGHT = 2
    const COMMITMENT_WEIGHT = 1

    const gpaScore = calculateGPASimilarity(group);
    //
    //

    const totalScore = (gpaScore * GPA_WEIGHT)

    return totalScore;
}

function checkGenderRule(testA, testB) {
    return (
        isGenderBalanced(testA) &&
        isGenderBalanced(testB)
    );
}

function isGenderBalanced(group) {
    let maleCount = 0;
    let otherCount = 0;

    for (const student of group) {
        if (student.gender === "Male") {
            maleCount++;
        } else {
            otherCount++;
        }
    }

    return maleCount <= otherCount;
}

function findAvailableTeam(startIndex, groups, groupNum) {
    let checked = 0;
    let i = startIndex;

    while (checked < groupNum) {
        if (groups[i].length < settings.teamSize) {
            return i;
        }
        i = (i + 1) % groupNum;
        checked++;
    }
    return -1;
}

module.exports = grouper;