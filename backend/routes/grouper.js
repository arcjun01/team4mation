function grouper(students, teamSize) {
    if (!students || students.length === 0) return [];
    
    const groupNum = Math.ceil(students.length / teamSize);
    
    // Pass the students array into the helper function
    const { males, others } = seperateGenders(students); 
    const groups = makeBasicGroups(males, others, groupNum, teamSize);

    return groups;
}

// Accept studentsList as a parameter
function seperateGenders(studentsList) {
    const males = [];
    const others = [];

    // Use studentsList to match the parameter above
    for (const person of studentsList) {
        if (person.gender && person.gender.toLowerCase() === "male") {
            males.push(person);
        } else {
            others.push(person);
        }
    }
    return { males, others };
}

function makeBasicGroups(males, others, groupNum, teamSize) {
    const groups = Array.from({ length: groupNum }, () => []);

    let i = 0;
    // Fill with males first to distribute them
    for (const person of males) {
        const index = findAvailableTeam(i, groups, groupNum, teamSize);
        if (index !== -1) {
            groups[index].push(person);
            i = (index + 1) % groupNum;
        }
    }

    // Fill remaining spots with others
    for (const person of others) {
        const index = findAvailableTeam(i, groups, groupNum, teamSize);
        if (index !== -1) {
            groups[index].push(person);
            i = (index + 1) % groupNum;
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

function improveGroups(groups) {

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
                        if (evalulateSwap(studentA, studentB, groups[i], groups[j])) {
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

function findAvailableTeam(startIndex, groups, groupNum, teamSize) {
    let checked = 0;
    let i = startIndex;

    while (checked < groupNum) {
        if (groups[i].length < teamSize) {
            return i;
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
    const commitmentScore = calculateCommitmentSimilarity(group);

    const totalScore = (gpaScore * GPA_WEIGHT) + (0) + (commitmentScore * COMMITMENT_WEIGHT)

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
module.exports = grouper;