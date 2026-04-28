import {
    grouper,
    buildAvailabilityMap,
    makeBasicGroups
} from "../routes/grouper.js";

import {
    // improveGroups,
    calculateScheduleOverlap,
    calculateGPASimilarity,
    calculateCommitmentSimilarity,
    isGenderBalanced
} from "../routes/grouperImprover.js";



const mockAvailability = [
    { student_id: "S01", day_of_week: "MON", time_slot: "9 AM" },
    { student_id: "S01", day_of_week: "TUE", time_slot: "2 PM" },
    { student_id: "S02", day_of_week: "MON", time_slot: "9 AM" },
    { student_id: "S02", day_of_week: "WED", time_slot: "3 PM" },
    { student_id: "S03", day_of_week: "MON", time_slot: "9 AM" },
    { student_id: "S03", day_of_week: "TUE", time_slot: "2 PM" },
    { student_id: "S04", day_of_week: "FRI", time_slot: "1 PM" },
];

const mockAvailabilityMap = buildAvailabilityMap(mockAvailability);

// buildAvailabilityMap


describe("buildAvailabilityMap", () => {

    test("correctly maps a student to their slots", () => {
        expect(mockAvailabilityMap["S01"]).toEqual(["MON-9 AM", "TUE-2 PM"]);
    });

    test("each student gets their own separate slot array", () => {
        expect(mockAvailabilityMap["S02"]).toEqual(["MON-9 AM", "WED-3 PM"]);
    });

    test("returns an empty object when given an empty array", () => {
        const emptyMap = buildAvailabilityMap([]);
        expect(emptyMap).toEqual({});
    });

    test("a student not in the availability data has no entry in the map", () => {
        expect(mockAvailabilityMap["S99"]).toBeUndefined();
    });

});

// calculateScheduleOverlap

describe("calculateScheduleOverlap", () => {

    test("returns higher score when more students share the same slot", () => {
        const highOverlapGroup = [
            { student_id: "S01" },
            { student_id: "S02" },
            { student_id: "S03" },
        ];
        const lowOverlapGroup = [
            { student_id: "S01" },
            { student_id: "S04" },
        ];
        expect(calculateScheduleOverlap(highOverlapGroup, mockAvailabilityMap))
            .toBeGreaterThan(calculateScheduleOverlap(lowOverlapGroup, mockAvailabilityMap));
    });

    test("returns 0 when no students share any slots", () => {
        // S01 has MON and TUE, S04 only has FRI - no overlap
        const group = [
            { student_id: "S01" },
            { student_id: "S04" },
        ];
        expect(calculateScheduleOverlap(group, mockAvailabilityMap)).toBe(0);
    });

    test("returns 0 when a student has no availability data", () => {
        const group = [
            { student_id: "S99" }, // not in map
            { student_id: "S01" },
        ];
        expect(calculateScheduleOverlap(group, mockAvailabilityMap)).toBe(0);
    });

    test("returns 0 for a group of one student", () => {
        const group = [{ student_id: "S01" }];
        expect(calculateScheduleOverlap(group, mockAvailabilityMap)).toBe(0);
    });

});

// calculateGPASimilarity

describe("calculateGPASimilarity", () => {

    test("returns 0 when all students have the same GPA", () => {
        const group = [
            { student_id: "S01", gpa: 3.5 },
            { student_id: "S02", gpa: 3.5 },
            { student_id: "S03", gpa: 3.5 },
        ];
        expect(calculateGPASimilarity(group)).toBe(0);
    });

    test("returns a negative value when GPAs differ", () => {
        const group = [
            { student_id: "S01", gpa: 2.0 },
            { student_id: "S02", gpa: 4.0 },
        ];
        // spread is 2.0, so score should be -2.0
        expect(calculateGPASimilarity(group)).toBe(-2.0);
    });

    test("a smaller GPA spread produces a higher (less negative) score", () => {
        const smallSpread = [
            { student_id: "S01", gpa: 3.0 },
            { student_id: "S02", gpa: 3.5 },
        ];
        const largeSpread = [
            { student_id: "S01", gpa: 1.0 },
            { student_id: "S02", gpa: 4.0 },
        ];
        expect(calculateGPASimilarity(smallSpread)).toBeGreaterThan(calculateGPASimilarity(largeSpread));
    });

});

// calculateCommitmentSimilarity

describe("calculateCommitmentSimilarity", () => {

    test("returns 0 when all students have the same commitment level", () => {
        const group = [
            { student_id: "S01", commitment: 3 },
            { student_id: "S02", commitment: 3 },
            { student_id: "S03", commitment: 3 },
        ];
        expect(calculateCommitmentSimilarity(group)).toBe(0);
    });

    test("returns a negative value when commitment levels differ", () => {
        const group = [
            { student_id: "S01", commitment: 1 },
            { student_id: "S02", commitment: 4 },
        ];
        // range is 3, so score should be -3
        expect(calculateCommitmentSimilarity(group)).toBe(-3);
    });

    test("a smaller commitment range produces a higher (less negative) score", () => {
        const smallRange = [
            { student_id: "S01", commitment: 2 },
            { student_id: "S02", commitment: 3 },
        ];
        const largeRange = [
            { student_id: "S01", commitment: 1 },
            { student_id: "S02", commitment: 4 },
        ];
        expect(calculateCommitmentSimilarity(smallRange)).toBeGreaterThan(calculateCommitmentSimilarity(largeRange));
    });

});

// isGenderBalanced

describe("isGenderBalanced", () => {

    test("returns true when males are less than 50% of the group", () => {
        const group = [
            { student_id: "S01", gender: "Male" },
            { student_id: "S02", gender: "Female" },
            { student_id: "S03", gender: "Female" },
        ];
        expect(isGenderBalanced(group)).toBe(true);
    });

    test("returns true when males are exactly 50% of the group", () => {
        const group = [
            { student_id: "S01", gender: "Male" },
            { student_id: "S02", gender: "Female" },
        ];
        expect(isGenderBalanced(group)).toBe(true);
    });

    test("returns false when males are more than 50% of the group", () => {
        const group = [
            { student_id: "S01", gender: "Male" },
            { student_id: "S02", gender: "Male" },
            { student_id: "S03", gender: "Female" },
            { student_id: "S04", gender: "Male" },
        ];
        expect(isGenderBalanced(group)).toBe(false);
    });

    test("returns true when male to female ratio isn't too extreme", () => {
        const group = [
            { student_id: "S01", gender: "Male" },
            { student_id: "S02", gender: "Male" },
            { student_id: "S03", gender: "Female" },
        ];
        expect(isGenderBalanced(group)).toBe(true);
    });

    test("returns true when all students are non-male", () => {
        const group = [
            { student_id: "S01", gender: "Female" },
            { student_id: "S02", gender: "Other" },
            { student_id: "S03", gender: "Female" },
        ];
        expect(isGenderBalanced(group)).toBe(true);
    });

    test("handles gender values with extra whitespace", () => {
        const group = [
            { student_id: "S01", gender: "  Male  " },
            { student_id: "S02", gender: "Female" },
        ];
        expect(isGenderBalanced(group)).toBe(true);
    });

});

// makeBasicGroups

describe("makeBasicGroups", () => {

    const males = [
        { student_id: "S01", gender: "Male", gpa: 2.0, commitment: 2 },
        { student_id: "S02", gender: "Male", gpa: 3.0, commitment: 3 },
        { student_id: "S03", gender: "Male", gpa: 4.0, commitment: 4 },
    ];
    const others = [
        { student_id: "S04", gender: "Female", gpa: 2.5, commitment: 2 },
        { student_id: "S05", gender: "Female", gpa: 3.5, commitment: 3 },
        { student_id: "S06", gender: "Other", gpa: 1.5, commitment: 1 },
    ];

    test("every student appears in exactly one group", () => {
        const groups = makeBasicGroups(males, others, 2);
        const allStudents = groups.flat().map(s => s.student_id);
        const allIds = [...males, ...others].map(s => s.student_id);

        // same length — no duplicates or missing
        expect(allStudents.length).toBe(allIds.length);
        // every original student is present
        allIds.forEach(id => expect(allStudents).toContain(id));
    });

    test("no student appears in more than one group", () => {
        const groups = makeBasicGroups(males, others, 2);
        const allStudents = groups.flat().map(s => s.student_id);
        const unique = new Set(allStudents);
        expect(unique.size).toBe(allStudents.length);
    });

    test("produces the correct number of groups", () => {
        const groups = makeBasicGroups(males, others, 2);
        expect(groups.length).toBe(2);
    });

});