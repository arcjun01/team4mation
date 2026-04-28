import { enforceGroupSizes } from "../routes/grouper.js";

describe("enforceGroupSizes", () => {

    test("moves a student out of an oversized group into a smaller one", () => {
        const groups = [
            [
                { student_id: "S01" },
                { student_id: "S02" },
                { student_id: "S03" },
                { student_id: "S04" },
                { student_id: "S05" },
            ],
            [{ student_id: "S06" }],
        ];
        enforceGroupSizes(groups, 1, 3);
        groups.forEach(g => {
            expect(g.length).toBeLessThanOrEqual(3);
        });
    });

    test("all students are still present after enforcing sizes", () => {
        const groups = [
            [
                { student_id: "S01" },
                { student_id: "S02" },
                { student_id: "S03" },
                { student_id: "S04" },
            ],
            [{ student_id: "S05" }],
        ];
        enforceGroupSizes(groups, 1, 3);
        const allIds = groups.flat().map(s => s.student_id);
        expect(allIds.length).toBe(5);
        ["S01", "S02", "S03", "S04", "S05"].forEach(id =>
            expect(allIds).toContain(id)
        );
    });

    test("does not modify groups that are already within size bounds", () => {
        const groups = [
            [{ student_id: "S01" }, { student_id: "S02" }],
            [{ student_id: "S03" }, { student_id: "S04" }],
        ];
        const before = groups.map(g => g.length);
        enforceGroupSizes(groups, 2, 4);
        groups.forEach((g, i) => expect(g.length).toBe(before[i]));
    });

});