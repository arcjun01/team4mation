// Determine unique ID key (database uses id or student_id)
const getID = (s) => s.id || s.student_id;

const NO_SHARED_AVAILABILITY_PENALTY = -1000;
const MAX_ENFORCEMENT_PASSES = 20;

function getSharedSlots(group, availabilityMap) {
    if (group.length === 0) return [];

    let shared = new Set(availabilityMap[getID(group[0])] || []);
    for (let i = 1; i < group.length; i++) {
        const slots = new Set(availabilityMap[getID(group[i])] || []);
        shared = new Set([...shared].filter(slot => slots.has(slot)));
        if (shared.size === 0) return [];
    }

    return [...shared];
}

function hasSharedAvailability(group, availabilityMap) {
    if (group.length <= 1) return true;
    return getSharedSlots(group, availabilityMap).length > 0;
}

function enforceSharedAvailability(groups, availabilityMap, minSize, maxSize) {
    let changed = true;
    let passCount = 0;

    while (changed && passCount < MAX_ENFORCEMENT_PASSES) {
        changed = false;
        passCount++;

        for (let i = 0; i < groups.length; i++) {
            if (hasSharedAvailability(groups[i], availabilityMap)) continue;

            for (let j = i + 1; j < groups.length; j++) {
                let fixed = false;

                for (const studentA of groups[i]) {
                    for (const studentB of groups[j]) {
                        const testA = groups[i].map(s => getID(s) === getID(studentA) ? studentB : s);
                        const testB = groups[j].map(s => getID(s) === getID(studentB) ? studentA : s);

                        if (!checkGenderRule(testA, testB)) continue;
                        if (!hasSharedAvailability(testA, availabilityMap)) continue;
                        if (!hasSharedAvailability(testB, availabilityMap)) continue;

                        const indexA = groups[i].findIndex(s => getID(s) === getID(studentA));
                        const indexB = groups[j].findIndex(s => getID(s) === getID(studentB));
                        groups[i][indexA] = studentB;
                        groups[j][indexB] = studentA;
                        changed = true;
                        fixed = true;
                        break;
                    }
                    if (fixed) break;
                }
                if (fixed) break;
            }
            if (changed) break;
        }

        if (changed) continue;

        outer:
        for (let i = 0; i < groups.length; i++) {
            if (hasSharedAvailability(groups[i], availabilityMap)) continue;

            const effectiveMin = Math.max(2, minSize - 1);

            for (let j = 0; j < groups.length; j++) {
                if (i === j) continue;

                for (let k = 0; k < groups[i].length; k++) {
                    const student = groups[i][k];
                    if (groups[i].length <= effectiveMin) continue;
                    if (groups[j].length >= maxSize) continue;

                    const testFrom = groups[i].filter(s => getID(s) !== getID(student));
                    const testTo = [...groups[j], student];

                    if (!isGenderBalanced(testFrom) || !isGenderBalanced(testTo)) continue;
                    if (!hasSharedAvailability(testFrom, availabilityMap)) continue;
                    if (!hasSharedAvailability(testTo, availabilityMap)) continue;

                    groups[j].push(groups[i].splice(k, 1)[0]);
                    changed = true;
                    break outer;
                }
            }
        }
    }

    return groups;
}

function resolveUnavailableTeams(groups, availabilityMap, maxSize) {
    const validGroups = [];
    const unplaced = [];

    for (const group of groups) {
        if (hasSharedAvailability(group, availabilityMap)) {
            validGroups.push(group);
        } else {
            unplaced.push(...group);
        }
    }

    for (const student of unplaced) {
        let placed = false;

        const candidates = validGroups
            .filter(group => group.length < maxSize)
            .filter(group => {
                const testGroup = [...group, student];
                return isGenderBalanced(testGroup) && hasSharedAvailability(testGroup, availabilityMap);
            })
            .sort((a, b) => a.length - b.length);

        if (candidates.length > 0) {
            candidates[0].push(student);
            placed = true;
        }

        if (!placed) {
            validGroups.push([student]);
        }
    }

    return validGroups;
}

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
    if (!hasSharedAvailability(testA, availabilityMap)) return false;
    if (!hasSharedAvailability(testB, availabilityMap)) return false;

    const currentScoreA = calculateGroupScore(groupA, availabilityMap);
    const currentScoreB = calculateGroupScore(groupB, availabilityMap);
    const testScoreA = calculateGroupScore(testA, availabilityMap);
    const testScoreB = calculateGroupScore(testB, availabilityMap);

    return (testScoreA + testScoreB) > (currentScoreA + currentScoreB);
}

function evaluateMove(student, fromGroup, toGroup, availabilityMap, minSize, maxSize) {
    const effectiveMin = Math.max(2, minSize - 1);

    if (fromGroup.length <= effectiveMin) return false;
    if (toGroup.length >= maxSize) return false;

    const testFrom = fromGroup.filter(s => getID(s) !== getID(student));
    const testTo = [...toGroup, student];

    if (!isGenderBalanced(testFrom) || !isGenderBalanced(testTo)) return false;
    if (!hasSharedAvailability(testFrom, availabilityMap)) return false;
    if (!hasSharedAvailability(testTo, availabilityMap)) return false;

    const currentScore = calculateGroupScore(fromGroup, availabilityMap) +
        calculateGroupScore(toGroup, availabilityMap);
    const testScore = calculateGroupScore(testFrom, availabilityMap) +
        calculateGroupScore(testTo, availabilityMap);

    return testScore > currentScore;
}

function calculateScheduleOverlap(group, availabilityMap) {
    const slotCounts = {}
    for (const student of group) {
        const sid = getID(student);
        const timeSlots = availabilityMap[sid] || []
        for (const slot of timeSlots) {
            slotCounts[slot] = (slotCounts[slot] || 0) + 1;
        }
    }

    // 1. Check if there is AT LEAST ONE slot that EVERYONE in the group shares
    const totalStudents = group.length;
    let perfectOverlapCount = 0;

    for (const slot of Object.keys(slotCounts)) {
        if (slotCounts[slot] === totalStudents) {
            perfectOverlapCount++;
        }
    }

    // 2. If a common time slot exists, reward the group heavily.
    if (perfectOverlapCount > 0) {
        return 100 + perfectOverlapCount;
    }

    // 3. No slot shared by every member — heavy penalty so swaps only accept valid teams.
    return NO_SHARED_AVAILABILITY_PENALTY;
}

function calculateSpread(group, field) {
    if (group.length === 0) return 0;

    const values = group.map(s => parseFloat(s[field])).filter(v => !isNaN(v));
    if (values.length === 0) return 0;

    let min = values[0], max = values[0];
    for (const v of values) {
        if (v > max) max = v;
        if (v < min) min = v;
    }
    const spread = max - min;
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
    enforceSharedAvailability,
    resolveUnavailableTeams,
    evaluateSwap,
    getSharedSlots,
    hasSharedAvailability,
    calculateScheduleOverlap,
    calculateSpread,
    calculateGPASimilarity,
    calculateCommitmentSimilarity,
    calculateGroupScore,
    checkGenderRule,
    isGenderBalanced
};