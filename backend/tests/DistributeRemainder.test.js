import { distributeRemainder } from "../routes/grouper.js";

describe("distributeRemainder", () => {

    test("distributes all remaining students across groups", () => {
        const arr = [
            { student_id: "S01" },
            { student_id: "S02" },
            { student_id: "S03" },
        ];
        const groups = [[], [], []];
        distributeRemainder(arr, 0, groups);
        const allStudents = groups.flat().map(s => s.student_id);
        expect(allStudents.length).toBe(3);
        arr.forEach(s => expect(allStudents).toContain(s.student_id));
    });

    test("does nothing when start index is at the end of the array", () => {
        const arr = [{ student_id: "S01" }, { student_id: "S02" }];
        const groups = [[], []];
        distributeRemainder(arr, arr.length, groups);
        expect(groups.flat().length).toBe(0);
    });

    test("distributes students in round-robin order across groups", () => {
        const arr = [
            { student_id: "S01" },
            { student_id: "S02" },
            { student_id: "S03" },
            { student_id: "S04" },
        ];
        const groups = [[], []];
        distributeRemainder(arr, 0, groups);
        expect(groups[0].map(s => s.student_id)).toEqual(["S01", "S03"]);
        expect(groups[1].map(s => s.student_id)).toEqual(["S02", "S04"]);
    });

    test("can start distributing from a mid-array index", () => {
        const arr = [
            { student_id: "S01" },
            { student_id: "S02" },
            { student_id: "S03" },
        ];
        const groups = [[], []];
        distributeRemainder(arr, 1, groups);
        const allStudents = groups.flat().map(s => s.student_id);
        expect(allStudents).not.toContain("S01");
        expect(allStudents).toContain("S02");
        expect(allStudents).toContain("S03");
    });

});