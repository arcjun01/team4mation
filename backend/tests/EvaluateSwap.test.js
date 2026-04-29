import { evaluateSwap } from "../routes/grouperImprover.js";

describe("evaluateSwap", () => {
    let availabilityMap;

    beforeEach(() => {
        // Setup a basic availability map
        // S1 & S2 share slots 1, 2, 3
        // S3 & S4 share slots 4, 5, 6
        availabilityMap = {
            "S1": [1, 2, 3],
            "S2": [1, 2, 3],
            "S3": [4, 5, 6],
            "S4": [4, 5, 6],
        };
    });

    test("returns true when a swap improves the total schedule overlap score", () => {
        // Group A has S1 and S3 (poor overlap)
        // Group B has S2 and S4 (poor overlap)
        const studentA = { student_id: "S3", gpa: 3.0, commitment: 5, gender: "male" };
        const studentB = { student_id: "S2", gpa: 3.0, commitment: 5, gender: "male" };

        const groupA = [
            { student_id: "S1", gpa: 3.0, commitment: 5, gender: "male" },
            studentA
        ];
        const groupB = [
            studentB,
            { student_id: "S4", gpa: 3.0, commitment: 5, gender: "male" }
        ];

        // After swap: 
        // Group A: [S1, S2] (Perfect overlap)
        // Group B: [S3, S4] (Perfect overlap)
        const result = evaluateSwap(studentA, studentB, groupA, groupB, availabilityMap);
        expect(result).toBe(true);
    });

    test("returns true when a swap improves GPA similarity (reduces spread)", () => {
        const studentA = { student_id: "S1", gpa: 4.0, commitment: 5, gender: "female" }; // High GPA
        const studentB = { student_id: "S2", gpa: 2.0, commitment: 5, gender: "female" }; // Low GPA

        // Group A: 4.0 and 2.0 (Spread 2)
        // Group B: 4.0 and 2.0 (Spread 2)
        const groupA = [studentA, { student_id: "S3", gpa: 2.0, commitment: 5, gender: "female" }];
        const groupB = [studentB, { student_id: "S4", gpa: 4.0, commitment: 5, gender: "female" }];

        // After swap:
        // Group A: [2.0, 2.0] (Spread 0)
        // Group B: [4.0, 4.0] (Spread 0)
        // Note: Schedule overlap is 0 for both, so GPA improvement wins.
        const result = evaluateSwap(studentA, studentB, groupA, groupB, {});
        expect(result).toBe(true);
    });

    test("returns false when a swap violates the gender balance rule", () => {
        // Rule: ratio cannot exceed 2:1 if mixed.
        // Group A: 2 males, 1 female (Balanced 2:1)
        // Group B: 1 male, 2 females (Balanced 1:2)

        const studentA = { id: "M1", gender: "male", gpa: 4.0, commitment: 5 };
        const studentB = { id: "F1", gender: "female", gpa: 4.0, commitment: 5 };

        const groupA = [
            studentA,
            { id: "M2", gender: "male", gpa: 4.0, commitment: 5 },
            { id: "F2", gender: "female", gpa: 4.0, commitment: 5 }
        ];
        const groupB = [
            studentB,
            { id: "M3", gender: "male", gpa: 1.0, commitment: 1 }, // Low scores to encourage swap
            { id: "F3", gender: "female", gpa: 1.0, commitment: 1 }
        ];

        // Swapping M1 (from A) for F1 (from B) would result in:
        // Group A: [F1, M2, F2] (1 Male, 2 Female - OK)
        // But let's test a swap that results in 3:0 or similar if it broke the ratio.
        // Actually, let's create a 3:1 ratio (fails 2:1 rule).
        const studentToSwapA = { id: "F2", gender: "female", gpa: 4.0, commitment: 5 };
        const studentToSwapB = { id: "M3", gender: "male", gpa: 1.0, commitment: 5 };

        const testGroupA = [
            { id: "M1", gender: "male" },
            { id: "M2", gender: "male" },
            studentToSwapA // Currently 2M, 1F
        ];
        const testGroupB = [
            studentToSwapB,
            { id: "F1", gender: "female" } // Currently 1M, 1F
        ];

        // Swapping F2 for M3 results in Group A having [M1, M2, M3] 
        // Code: "All males is ok". 
        // To force a FAIL, we need a mixed group that exceeds 2:1.
        // Group A (4 students): M, M, M, F (3:1 ratio - Invalid because 3 > 1*2)

        const failGroupA = [
            { id: "M1", gender: "male", gpa: 4.0 },
            { id: "M2", gender: "male", gpa: 4.0 },
            { id: "F1", gender: "female", gpa: 4.0 },
            { id: "F2", gender: "female", gpa: 4.0 } // Balanced 2:2
        ];
        const failGroupB = [
            { id: "M3", gender: "male", gpa: 1.0 },
            { id: "M4", gender: "male", gpa: 1.0 }
        ];

        const sA = failGroupA[2]; // F1
        const sB = failGroupB[0]; // M3

        // Swap F1 for M3:
        // Group A becomes M1, M2, M3, F2 (3:1 ratio) -> returns false
        const result = evaluateSwap(sA, sB, failGroupA, failGroupB, {});
        expect(result).toBe(false);
    });

    test("returns false if the total score does not increase", () => {
        const studentA = { student_id: "S1", gpa: 3.0, commitment: 5, gender: "male" };
        const studentB = { student_id: "S2", gpa: 3.0, commitment: 5, gender: "male" };

        const groupA = [studentA, { student_id: "S3", gpa: 3.0, commitment: 5, gender: "male" }];
        const groupB = [studentB, { student_id: "S4", gpa: 3.0, commitment: 5, gender: "male" }];

        // Identical students, no score change
        const result = evaluateSwap(studentA, studentB, groupA, groupB, {});
        expect(result).toBe(false);
    });

    test("correctly identifies students using both 'id' and 'student_id' keys", () => {
        // Student A (Low stats) to be moved out of Group A
        const studentA = { id: "S1", gpa: 1.0, commitment: 1, gender: "male" };
        // Student B (High stats) to be moved out of Group B
        const studentB = { student_id: "S2", gpa: 4.0, commitment: 10, gender: "male" };

        // Group A currently has High + Low
        const groupA = [
            { id: "S3", gpa: 4.0, commitment: 10, gender: "male" },
            studentA
        ];
        // Group B currently has High + Low
        const groupB = [
            studentB,
            { student_id: "S4", gpa: 1.0, commitment: 1, gender: "male" }
        ];

        /* After Swap:
           Group A: [S3(4.0), S2(4.0)] -> Spread 0 (Improved)
           Group B: [S1(1.0), S4(1.0)] -> Spread 0 (Improved)
        */
        const result = evaluateSwap(studentA, studentB, groupA, groupB, {});

        // This should now be true because the spread decreased, 
        // and the getID logic correctly mapped the different ID keys.
        expect(result).toBe(true);
    });
});