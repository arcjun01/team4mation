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