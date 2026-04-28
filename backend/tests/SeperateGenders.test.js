import { seperateGenders } from "../routes/grouper.js";

describe("seperateGenders", () => {

    test("correctly separates males from non-males", () => {
        const students = [
            { student_id: "S01", gender: "Male" },
            { student_id: "S02", gender: "Female" },
            { student_id: "S03", gender: "Male" },
            { student_id: "S04", gender: "Other" },
        ];
        const { males, others } = seperateGenders(students);
        expect(males.map(s => s.student_id)).toEqual(["S01", "S03"]);
        expect(others.map(s => s.student_id)).toEqual(["S02", "S04"]);
    });

    test("handles gender strings with extra whitespace and mixed case", () => {
        const students = [
            { student_id: "S01", gender: "  MALE  " },
            { student_id: "S02", gender: "Female" },
        ];
        const { males, others } = seperateGenders(students);
        expect(males.length).toBe(1);
        expect(others.length).toBe(1);
    });

    test("returns empty males array when no males are present", () => {
        const students = [
            { student_id: "S01", gender: "Female" },
            { student_id: "S02", gender: "Other" },
        ];
        const { males, others } = seperateGenders(students);
        expect(males.length).toBe(0);
        expect(others.length).toBe(2);
    });

    test("handles missing gender property gracefully", () => {
        const students = [
            { student_id: "S01" },
            { student_id: "S02", gender: "Male" },
        ];
        const { males, others } = seperateGenders(students);
        expect(males.length).toBe(1);
        expect(others.length).toBe(1);
    });

    test("returns empty arrays when given an empty list", () => {
        const { males, others } = seperateGenders([]);
        expect(males).toEqual([]);
        expect(others).toEqual([]);
    });

});

