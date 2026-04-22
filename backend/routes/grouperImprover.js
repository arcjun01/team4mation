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
