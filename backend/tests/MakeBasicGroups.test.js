import { makeBasicGroups } from "../routes/grouper.js";

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

describe("makeBasicGroups", () => {

    test("every student appears in exactly one group", () => {
        const groups = makeBasicGroups(males, others, 2);
        const allStudents = groups.flat().map(s => s.student_id);
        const allIds = [...males, ...others].map(s => s.student_id);
        expect(allStudents.length).toBe(allIds.length);
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