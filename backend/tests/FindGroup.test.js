import { findGroup } from "../routes/grouper.js";

describe("findGroup", () => {

    test("returns a matching group that is not the excluded index", () => {
        const groups = [
            [{ student_id: "S01" }],
            [{ student_id: "S02" }, { student_id: "S03" }],
        ];
        const result = findGroup(groups, 0, g => g.length === 2);
        expect(result).toBe(groups[1]);
    });

    test("returns undefined when no group meets the condition", () => {
        const groups = [[{ student_id: "S01" }], [{ student_id: "S02" }]];
        const result = findGroup(groups, 0, g => g.length > 5);
        expect(result).toBeUndefined();
    });

    test("does not return the excluded group even if it matches", () => {
        const groups = [
            [{ student_id: "S01" }, { student_id: "S02" }],
            [{ student_id: "S03" }],
        ];
        const result = findGroup(groups, 0, g => g.length === 2);
        expect(result).toBeUndefined();
    });

    test("returns undefined when the only matching group is excluded", () => {
        const groups = [
            [{ student_id: "S01" }],
            [{ student_id: "S02" }, { student_id: "S03" }],
            [{ student_id: "S04" }],
        ];
        const result = findGroup(groups, 1, g => g.length > 1);
        expect(result).toBeUndefined();
    });

});