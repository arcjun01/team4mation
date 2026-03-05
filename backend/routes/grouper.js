const studentData = require("../data/students.js")
const { students, settings } = studentData
const { availabilityData } = require("../data/availibility.js")

function buildAvailabilityMap(availabilityData) {
    const availibilityMap = {}
    for (const time of availabilityData) {
        if (!availibilityMap[time.student_id]) {
            availibilityMap[time.student_id] = [];
        }
        availibilityMap[time.student_id].push(`${time.day_of_week}-${time.time_slot}`)
    }
    console.log(availibilityMap)
    return availibilityMap;
}


function grouper() {
    const availabilityMap = buildAvailabilityMap(availabilityData);
    //get min group number
    const groupNum = Math.ceil(students.length / settings.teamSize);
    const { males, others } = seperateGenders();
    const groups = makeBasicGroups(males, others, groupNum);
    improveGroups(groups, availabilityMap);

    return groups;
}

function seperateGenders() {
    const males = []
    const others = []

    for (const person of students) {
        if (person.gender.trim().toLowerCase() === "male") males.push(person);
        if (person.gender.trim().toLowerCase() !== "male") others.push(person)
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

//plan split
//////////////////////////////////////////////////////

function improveGroups(groups, availabilityMap) {

    let improvementMade = true;
    let passCount = 0;
    const MAX_PASSES = 4;

    // loop while improvements to groups are made and we have checked at least 4 times
    // for improvements
    while (improvementMade && passCount < MAX_PASSES) {

        improvementMade = false;
        passCount++;

        console.log("Checking improvement Start: improvementMade=", improvementMade, ", passCount=", passCount);

        // loop groups twice so a group can be compared to every other group 
        for (let i = 0; i < groups.length - 1; i++) {
            for (let j = i + 1; j < groups.length; j++) {
                // get students from group 1 and group 2
                for (const studentA of groups[i]) {
                    console.log("Checking: ", studentA, " from ", groups[i]);
                    for (const studentB of groups[j]) {
                        console.log("Checking: ", studentB, " from ", groups[j]);
                        // check if swaping students would result in a better group
                        if (evalulateSwap(studentA, studentB, groups[i], groups[j], availabilityMap)) {
                            console.log("Swap ", studentA, " and ", studentB);

                            // swap students
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

function evalulateSwap(studentA, studentB, groupA, groupB, availabilityMap) {
    const testA = groupA.map(student => student.student_id === studentA.student_id ? studentB : student);
    console.log("GroupA: ", groupA, " TestA: ", testA)

    const testB = groupB.map(student => student.student_id === studentB.student_id ? studentA : student);
    console.log("GroupB: ", groupB, " TestB: ", testB);

    if (!checkGenderRule(testA, testB)) {
        return false;
    }

    let currentScoreA = calculateGroupScore(groupA, availabilityMap);
    let currentScoreB = calculateGroupScore(groupB, availabilityMap);

    let testScoreA = calculateGroupScore(testA, availabilityMap);
    let testScoreB = calculateGroupScore(testB, availabilityMap);

    console.log("Current Group A: ", currentScoreA);
    console.log("Test Group A: ", testScoreA);
    console.log("Current Group B: ", currentScoreB);
    console.log("Test Group B: ", testScoreB);

    if ((testScoreA + testScoreB) > (currentScoreA + currentScoreB)) {
        return true;
    }

    return false;
}

function calculateScheduleOverlap(group, availabilityMap) {
    const availibilitySlots = {}

    for (const student of group) {
        const timeSlots = availabilityMap[student.student_id] || []
        for (const slot of timeSlots) {
            if (!availibilitySlots[slot]) {
                availibilitySlots[slot] = 0
            }
            availibilitySlots[slot]++;
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

    return totalOverlap / group.length;

}

function calculateCommitmentSimilarity(group) {
    let min = group[0].commitment;
    let max = group[0].commitment;

    for (const student of group) {
        if (student.commitment > max) {
            max = student.commitment;
        }
        if (student.commitment < min) {
            min = student.commitment;
        }
    }

    let commitmentRange = max - min

    return commitmentRange === 0 ? 0 : (-1 * commitmentRange);
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

    return gpaSpread === 0 ? 0 : (-1 * gpaSpread);
}

function calculateGroupScore(group, availabilityMap) {
    const GPA_WEIGHT = 2
    const SCHEDULE_WEIGHT = 3
    const COMMITMENT_WEIGHT = 1

    const gpaScore = calculateGPASimilarity(group);
    const availibilityScore = calculateScheduleOverlap(group, availabilityMap);
    const commitmentScore = calculateCommitmentSimilarity(group);

    const totalScore = (gpaScore * GPA_WEIGHT) + (availibilityScore * SCHEDULE_WEIGHT) + (commitmentScore * COMMITMENT_WEIGHT)

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
        if (student.gender.trim().toLowerCase() === "male") {
            maleCount++;
        } else {
            otherCount++;
        }
    }

    return maleCount <= otherCount;
}
module.exports = {
    grouper,
    buildAvailabilityMap,
    calculateScheduleOverlap,
    calculateGPASimilarity,
    calculateCommitmentSimilarity,
    calculateGroupScore,
    isGenderBalanced,
    makeBasicGroups
};