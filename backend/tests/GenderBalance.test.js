import { isGenderBalanced, checkGenderRule } from "../routes/grouperImprover.js";

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

describe("checkGenderRule", () => {

    test("returns true when both groups are gender balanced", () => {
        const groupA = [
            { student_id: "S01", gender: "Male" },
            { student_id: "S02", gender: "Female" },
        ];
        const groupB = [
            { student_id: "S03", gender: "Male" },
            { student_id: "S04", gender: "Female" },
        ];
        expect(checkGenderRule(groupA, groupB)).toBe(true);
    });

    test("returns false when one group is not gender balanced", () => {
        const groupA = [
            { student_id: "S01", gender: "Male" },
            { student_id: "S02", gender: "Female" },
        ];
        const groupB = [
            { student_id: "S03", gender: "Male" },
            { student_id: "S04", gender: "Male" },
            { student_id: "S05", gender: "Male" },
            { student_id: "S06", gender: "Female" },
        ];
        expect(checkGenderRule(groupA, groupB)).toBe(false);
    });

    test("returns false when both groups are not gender balanced", () => {
        const groupA = [
            { student_id: "S01", gender: "Male" },
            { student_id: "S02", gender: "Male" },
            { student_id: "S03", gender: "Male" },
            { student_id: "S04", gender: "Female" },
        ];
        const groupB = [
            { student_id: "S05", gender: "Male" },
            { student_id: "S06", gender: "Male" },
            { student_id: "S07", gender: "Male" },
            { student_id: "S08", gender: "Female" },
        ];
        expect(checkGenderRule(groupA, groupB)).toBe(false);
    });

});