// Determine unique ID key (database uses id or student_id)
const getID = (s) => s.id || s.student_id;

function improveGroups(groups, availabilityMap, minSize, maxSize) {
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
                        if (evaluateSwap(studentA, studentB, groups[i], groups[j], availabilityMap)) {
                            const indexA = groups[i].findIndex(s => getID(s) === getID(studentA));
                            const indexB = groups[j].findIndex(s => getID(s) === getID(studentB));

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

        if (improvementMade) continue;

        // move logic
        outer:
        for (let i = 0; i < groups.length; i++) {
            for (let j = 0; j < groups.length; j++) {
                if (i === j) continue;
                for (let k = 0; k < groups[i].length; k++) {
                    const student = groups[i][k];
                    if (evaluateMove(student, groups[i], groups[j], availabilityMap, minSize, maxSize)) {
                        groups[j].push(groups[i].splice(k, 1)[0]);
                        improvementMade = true;
                        break outer;
                    }
                }
            }
        }
    }
    return groups;
}

function evaluateSwap(studentA, studentB, groupA, groupB, availabilityMap) {
    const testA = groupA.map(student => getID(student) === getID(studentA) ? studentB : student);
    const testB = groupB.map(student => getID(student) === getID(studentB) ? studentA : student);

    if (!checkGenderRule(testA, testB)) return false;

    const currentScoreA = calculateGroupScore(groupA, availabilityMap);
    const currentScoreB = calculateGroupScore(groupB, availabilityMap);
    const testScoreA = calculateGroupScore(testA, availabilityMap);
    const testScoreB = calculateGroupScore(testB, availabilityMap);

    return (testScoreA + testScoreB) > (currentScoreA + currentScoreB);
}

function evaluateMove(student, fromGroup, toGroup, availabilityMap, minSize, maxSize) {
    const effectiveMin = Math.max(2, minSize - 1);

    console.log(`--- evaluateMove: ${getID(student)} from group(${fromGroup.length}) to group(${toGroup.length}), minSize=${minSize}, maxSize=${maxSize}, effectiveMin=${effectiveMin}`);

    if (fromGroup.length <= effectiveMin) {
        console.log(`  BLOCKED: fromGroup too small (${fromGroup.length} <= ${effectiveMin})`);
        return false;
    }
    if (toGroup.length >= maxSize) {
        console.log(`  BLOCKED: toGroup too large (${toGroup.length} >= ${maxSize})`);
        return false;
    }

    const testFrom = fromGroup.filter(s => getID(s) !== getID(student));
    const testTo = [...toGroup, student];

    if (!isGenderBalanced(testFrom)) {
        console.log(`  BLOCKED: testFrom gender imbalanced`);
        return false;
    }
    if (!isGenderBalanced(testTo)) {
        console.log(`  BLOCKED: testTo gender imbalanced`);
        return false;
    }

    const currentScore = calculateGroupScore(fromGroup, availabilityMap) +
        calculateGroupScore(toGroup, availabilityMap);
    const testScore = calculateGroupScore(testFrom, availabilityMap) +
        calculateGroupScore(testTo, availabilityMap);

    console.log(`  currentScore=${currentScore}, testScore=${testScore}, improvement=${testScore > currentScore}`);

    return testScore > currentScore;
}

function calculateScheduleOverlap(group, availabilityMap) {
    const availabilitySlots = {}
    for (const student of group) {
        const sid = getID(student);
        const timeSlots = availabilitySlots[sid] || []
        for (const slot of timeSlots) {
            availabilitySlots[slot] = (availabilitySlots[slot] || 0) + 1;
        }
    }

    // 1. Check if there is AT LEAST ONE slot that EVERYONE in the group shares
    const totalStudents = group.length;
    let perfectOverlapCount = 0;

    for (const slot of Object.keys(availabilitySlots)) {
        if (availabilitySlots[slot] === totalStudents) {
            perfectOverlapCount++;
        }
    }

    // 2. If a common time slot exists, reward the group heavily.
    if (perfectOverlapCount > 0) {
        // Bonus + the number of perfectly overlapping slots to encourage finding even more matches
        return 100 + perfectOverlapCount;
    }

    // 3. FALLBACK
    let totalOverlap = 0;
    const minOverlap = Math.max(2, Math.ceil(group.length / 2));

    for (const slot of Object.keys(availabilitySlots)) {
        const count = availabilitySlots[slot];
        if (count >= minOverlap) {
            totalOverlap += count;
        }
    }

    return totalOverlap / (group.length || 1);
}

function calculateSpread(group, field) {
    if (group.length === 0) return 0;
    let min = group[0][field], max = group[0][field];
    for (const student of group) {
        if (student[field] > max) max = student[field];
        if (student[field] < min) min = student[field];
    }
    let spread = max - min;
    return spread === 0 ? 0 : (-1 * spread);
}

const calculateCommitmentSimilarity = (group) => calculateSpread(group, 'commitment');

const calculateGPASimilarity = (group) => calculateSpread(group, 'gpa');

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
    improveGroups,
    evaluateSwap,
    calculateScheduleOverlap,
    calculateSpread,
    calculateGPASimilarity,
    calculateCommitmentSimilarity,
    calculateGroupScore,
    checkGenderRule,
    isGenderBalanced
};