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

    test("handles three groups where one is oversized", () => {
        const groups = [
            [
                { student_id: "S01" },
                { student_id: "S02" },
                { student_id: "S03" },
                { student_id: "S04" },
                { student_id: "S05" },
                { student_id: "S06" },
            ],
            [{ student_id: "S07" }, { student_id: "S08" }],
            [{ student_id: "S09" }, { student_id: "S10" }],
        ];
        enforceGroupSizes(groups, 2, 4);
        groups.forEach(g => {
            expect(g.length).toBeLessThanOrEqual(4);
            expect(g.length).toBeGreaterThanOrEqual(2);
        });
    });

    test("handles three groups where one is undersized", () => {
        const groups = [
            [{ student_id: "S01" }, { student_id: "S02" }, { student_id: "S03" }, { student_id: "S04" }],
            [{ student_id: "S05" }, { student_id: "S06" }, { student_id: "S07" }, { student_id: "S08" }],
            [{ student_id: "S09" }],
        ];
        enforceGroupSizes(groups, 3, 5);
        // The undersized group should have been topped up to at least minSize
        groups.forEach(g => {
            expect(g.length).toBeGreaterThanOrEqual(3);
        });
    });

    test("no students are lost or duplicated with three groups", () => {
        const groups = [
            [
                { student_id: "S01" },
                { student_id: "S02" },
                { student_id: "S03" },
                { student_id: "S04" },
                { student_id: "S05" },
            ],
            [{ student_id: "S06" }, { student_id: "S07" }],
            [{ student_id: "S08" }, { student_id: "S09" }],
        ];
        enforceGroupSizes(groups, 2, 4);
        const allIds = groups.flat().map(s => s.student_id);
        const unique = new Set(allIds);
        // Total count unchanged
        expect(allIds.length).toBe(9);
        // No duplicates
        expect(unique.size).toBe(9);
    });

    test("handles large groups being redistributed across many groups", () => {
        // 5 groups, one has 8 students, rest have 1 each — max size 3
        const groups = [
            [
                { student_id: "S01" }, { student_id: "S02" }, { student_id: "S03" },
                { student_id: "S04" }, { student_id: "S05" }, { student_id: "S06" },
                { student_id: "S07" }, { student_id: "S08" },
            ],
            [{ student_id: "S09" }],
            [{ student_id: "S10" }],
            [{ student_id: "S11" }],
            [{ student_id: "S12" }],
        ];
        enforceGroupSizes(groups, 1, 3);
        groups.forEach(g => {
            expect(g.length).toBeLessThanOrEqual(3);
        });
        // All 12 students still present
        const allIds = groups.flat().map(s => s.student_id);
        expect(allIds.length).toBe(12);
    });

    test("handles groups already at exactly the min size boundary", () => {
        const groups = [
            [{ student_id: "S01" }, { student_id: "S02" }],
            [{ student_id: "S03" }, { student_id: "S04" }],
            [{ student_id: "S05" }, { student_id: "S06" }],
        ];
        const before = groups.map(g => g.length);
        enforceGroupSizes(groups, 2, 4);
        groups.forEach((g, i) => expect(g.length).toBe(before[i]));
    });

    test("handles groups already at exactly the max size boundary", () => {
        const groups = [
            [{ student_id: "S01" }, { student_id: "S02" }, { student_id: "S03" }],
            [{ student_id: "S04" }, { student_id: "S05" }, { student_id: "S06" }],
        ];
        const before = groups.map(g => g.length);
        enforceGroupSizes(groups, 2, 3);
        groups.forEach((g, i) => expect(g.length).toBe(before[i]));
    });
});