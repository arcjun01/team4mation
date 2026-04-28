import {
    calculateSpread,
    calculateScheduleOverlap,
    calculateGPASimilarity,
    calculateCommitmentSimilarity,
    calculateGroupScore
} from "../routes/grouperImprover.js";

import { buildAvailabilityMap } from "../routes/grouper.js";

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

describe("calculateSpread", () => {

    test("returns 0 when all values are the same", () => {
        const group = [
            { student_id: "S01", gpa: 3.0 },
            { student_id: "S02", gpa: 3.0 },
            { student_id: "S03", gpa: 3.0 },
        ];
        expect(calculateSpread(group, "gpa")).toBe(0);
    });

    test("returns a negative value equal to the negative spread", () => {
        const group = [
            { student_id: "S01", gpa: 2.0 },
            { student_id: "S02", gpa: 4.0 },
        ];
        expect(calculateSpread(group, "gpa")).toBe(-2.0);
    });

    test("works with any field, not just gpa", () => {
        const group = [
            { student_id: "S01", commitment: 1 },
            { student_id: "S02", commitment: 4 },
        ];
        expect(calculateSpread(group, "commitment")).toBe(-3);
    });

    test("returns 0 for an empty group", () => {
        expect(calculateSpread([], "gpa")).toBe(0);
    });

});

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
        const group = [
            { student_id: "S01" },
            { student_id: "S04" },
        ];
        expect(calculateScheduleOverlap(group, mockAvailabilityMap)).toBe(0);
    });

    test("returns 0 when a student has no availability data", () => {
        const group = [
            { student_id: "S99" },
            { student_id: "S01" },
        ];
        expect(calculateScheduleOverlap(group, mockAvailabilityMap)).toBe(0);
    });

    test("returns 0 for a group of one student", () => {
        const group = [{ student_id: "S01" }];
        expect(calculateScheduleOverlap(group, mockAvailabilityMap)).toBe(0);
    });

});

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

describe("calculateGroupScore", () => {

    test("returns a higher score for a group with identical GPA, commitment, and full schedule overlap", () => {
        const perfectGroup = [
            { student_id: "S01", gpa: 3.5, commitment: 3 },
            { student_id: "S02", gpa: 3.5, commitment: 3 },
            { student_id: "S03", gpa: 3.5, commitment: 3 },
        ];
        const poorGroup = [
            { student_id: "S01", gpa: 1.0, commitment: 1 },
            { student_id: "S04", gpa: 4.0, commitment: 5 },
        ];
        expect(calculateGroupScore(perfectGroup, mockAvailabilityMap))
            .toBeGreaterThan(calculateGroupScore(poorGroup, mockAvailabilityMap));
    });

    test("returns a lower score when GPA spread is high", () => {
        const highSpread = [
            { student_id: "S01", gpa: 1.0, commitment: 3 },
            { student_id: "S02", gpa: 4.0, commitment: 3 },
        ];
        const lowSpread = [
            { student_id: "S01", gpa: 3.0, commitment: 3 },
            { student_id: "S02", gpa: 3.5, commitment: 3 },
        ];
        expect(calculateGroupScore(lowSpread, mockAvailabilityMap))
            .toBeGreaterThan(calculateGroupScore(highSpread, mockAvailabilityMap));
    });

    test("returns a lower score when commitment spread is high", () => {
        const highSpread = [
            { student_id: "S01", gpa: 3.0, commitment: 1 },
            { student_id: "S02", gpa: 3.0, commitment: 5 },
        ];
        const lowSpread = [
            { student_id: "S01", gpa: 3.0, commitment: 3 },
            { student_id: "S02", gpa: 3.0, commitment: 3 },
        ];
        expect(calculateGroupScore(lowSpread, mockAvailabilityMap))
            .toBeGreaterThan(calculateGroupScore(highSpread, mockAvailabilityMap));
    });

    test("schedule overlap increases the score", () => {
        const highOverlapGroup = [
            { student_id: "S01", gpa: 3.0, commitment: 3 },
            { student_id: "S02", gpa: 3.0, commitment: 3 },
            { student_id: "S03", gpa: 3.0, commitment: 3 },
        ];
        const noOverlapGroup = [
            { student_id: "S01", gpa: 3.0, commitment: 3 },
            { student_id: "S04", gpa: 3.0, commitment: 3 },
        ];
        expect(calculateGroupScore(highOverlapGroup, mockAvailabilityMap))
            .toBeGreaterThan(calculateGroupScore(noOverlapGroup, mockAvailabilityMap));
    });

});