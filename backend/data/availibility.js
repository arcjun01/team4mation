const availabilityData = [
    // S01
    { student_id: "S01", day_of_week: "MON", time_slot: "9 AM" },
    { student_id: "S01", day_of_week: "MON", time_slot: "1 PM" },
    { student_id: "S01", day_of_week: "TUE", time_slot: "10 AM" },
    { student_id: "S01", day_of_week: "TUE", time_slot: "2 PM" },
    { student_id: "S01", day_of_week: "WED", time_slot: "9 AM" },
    { student_id: "S01", day_of_week: "MON", time_slot: "4 PM" },
    { student_id: "S01", day_of_week: "TUE", time_slot: "8 AM" },
    // S02
    { student_id: "S02", day_of_week: "WED", time_slot: "9 AM" },
    { student_id: "S02", day_of_week: "THU", time_slot: "2 PM" },
    { student_id: "S02", day_of_week: "SAT", time_slot: "9 AM" },
    // S03
    { student_id: "S03", day_of_week: "MON", time_slot: "9 AM" },
    { student_id: "S03", day_of_week: "TUE", time_slot: "10 AM" },
    { student_id: "S03", day_of_week: "THU", time_slot: "11 AM" },
    { student_id: "S03", day_of_week: "MON", time_slot: "4 PM" },
    { student_id: "S03", day_of_week: "SAT", time_slot: "2 PM" },
    // S04
    { student_id: "S04", day_of_week: "MON", time_slot: "9 AM" },
    { student_id: "S04", day_of_week: "WED", time_slot: "3 PM" },
    { student_id: "S04", day_of_week: "SAT", time_slot: "2 PM" },
    // S05
    { student_id: "S05", day_of_week: "TUE", time_slot: "2 PM" },
    { student_id: "S05", day_of_week: "WED", time_slot: "5 PM" },
    // S06
    { student_id: "S06", day_of_week: "MON", time_slot: "1 PM" },
    { student_id: "S06", day_of_week: "WED", time_slot: "9 AM" },
    { student_id: "S06", day_of_week: "FRI", time_slot: "10 AM" },
    { student_id: "S06", day_of_week: "TUE", time_slot: "8 AM" },
    { student_id: "S06", day_of_week: "SUN", time_slot: "10 AM" },
    // S07
    { student_id: "S07", day_of_week: "TUE", time_slot: "10 AM" },
    { student_id: "S07", day_of_week: "FRI", time_slot: "1 PM" },
    { student_id: "S07", day_of_week: "SUN", time_slot: "10 AM" },
    // S08
    { student_id: "S08", day_of_week: "MON", time_slot: "1 PM" },
    { student_id: "S08", day_of_week: "TUE", time_slot: "10 AM" },
    { student_id: "S08", day_of_week: "WED", time_slot: "9 AM" },
    { student_id: "S08", day_of_week: "THU", time_slot: "11 AM" },
    { student_id: "S08", day_of_week: "FRI", time_slot: "10 AM" },
    { student_id: "S08", day_of_week: "TUE", time_slot: "5 PM" },
    { student_id: "S08", day_of_week: "WED", time_slot: "12 PM" },
    // S09
    { student_id: "S09", day_of_week: "THU", time_slot: "11 AM" },
    { student_id: "S09", day_of_week: "THU", time_slot: "8 AM" },
    // S10
    { student_id: "S10", day_of_week: "TUE", time_slot: "2 PM" },
    { student_id: "S10", day_of_week: "WED", time_slot: "3 PM" },
    { student_id: "S10", day_of_week: "FRI", time_slot: "1 PM" },
    { student_id: "S10", day_of_week: "TUE", time_slot: "5 PM" },
    { student_id: "S10", day_of_week: "SUN", time_slot: "2 PM" },
    // S11
    { student_id: "S11", day_of_week: "MON", time_slot: "1 PM" },
    { student_id: "S11", day_of_week: "THU", time_slot: "11 AM" },
    { student_id: "S11", day_of_week: "SUN", time_slot: "2 PM" },
    // S12
    { student_id: "S12", day_of_week: "MON", time_slot: "9 AM" },
    { student_id: "S12", day_of_week: "THU", time_slot: "2 PM" },
    { student_id: "S12", day_of_week: "SAT", time_slot: "11 AM" },
    { student_id: "S12", day_of_week: "WED", time_slot: "12 PM" },
    { student_id: "S12", day_of_week: "WED", time_slot: "5 PM" },
    // S13
    { student_id: "S13", day_of_week: "MON", time_slot: "9 AM" },
    { student_id: "S13", day_of_week: "TUE", time_slot: "2 PM" },
    { student_id: "S13", day_of_week: "WED", time_slot: "3 PM" },
    { student_id: "S13", day_of_week: "THU", time_slot: "2 PM" },
    { student_id: "S13", day_of_week: "FRI", time_slot: "1 PM" },
    { student_id: "S13", day_of_week: "WED", time_slot: "5 PM" },
    { student_id: "S13", day_of_week: "THU", time_slot: "8 AM" },
    // S14
    { student_id: "S14", day_of_week: "TUE", time_slot: "2 PM" },
    { student_id: "S14", day_of_week: "FRI", time_slot: "10 AM" },
    { student_id: "S14", day_of_week: "MON", time_slot: "4 PM" },
    // S15
    { student_id: "S15", day_of_week: "MON", time_slot: "1 PM" },
    { student_id: "S15", day_of_week: "THU", time_slot: "4 PM" },
    // S16
    { student_id: "S16", day_of_week: "TUE", time_slot: "10 AM" },
    { student_id: "S16", day_of_week: "WED", time_slot: "9 AM" },
    { student_id: "S16", day_of_week: "THU", time_slot: "11 AM" },
    { student_id: "S16", day_of_week: "FRI", time_slot: "10 AM" },
    { student_id: "S16", day_of_week: "SAT", time_slot: "11 AM" },
    { student_id: "S16", day_of_week: "THU", time_slot: "4 PM" },
    { student_id: "S16", day_of_week: "FRI", time_slot: "8 AM" },
    // S17
    { student_id: "S17", day_of_week: "WED", time_slot: "3 PM" },
    { student_id: "S17", day_of_week: "SAT", time_slot: "11 AM" },
    { student_id: "S17", day_of_week: "TUE", time_slot: "8 AM" },
    // S18
    { student_id: "S18", day_of_week: "TUE", time_slot: "10 AM" },
    { student_id: "S18", day_of_week: "THU", time_slot: "11 AM" },
    { student_id: "S18", day_of_week: "FRI", time_slot: "10 AM" },
    { student_id: "S18", day_of_week: "THU", time_slot: "8 AM" },
    { student_id: "S18", day_of_week: "THU", time_slot: "4 PM" },
    // S19
    { student_id: "S19", day_of_week: "MON", time_slot: "9 AM" },
    { student_id: "S19", day_of_week: "MON", time_slot: "1 PM" },
    { student_id: "S19", day_of_week: "TUE", time_slot: "2 PM" },
    { student_id: "S19", day_of_week: "WED", time_slot: "3 PM" },
    { student_id: "S19", day_of_week: "THU", time_slot: "2 PM" },
    { student_id: "S19", day_of_week: "FRI", time_slot: "4 PM" },
    { student_id: "S19", day_of_week: "SAT", time_slot: "9 AM" },
    // S20
    { student_id: "S20", day_of_week: "FRI", time_slot: "10 AM" },
    { student_id: "S20", day_of_week: "FRI", time_slot: "8 AM" },
    // S21
    { student_id: "S21", day_of_week: "MON", time_slot: "9 AM" },
    { student_id: "S21", day_of_week: "THU", time_slot: "2 PM" },
    { student_id: "S21", day_of_week: "TUE", time_slot: "5 PM" },
    // S22
    { student_id: "S22", day_of_week: "MON", time_slot: "1 PM" },
    { student_id: "S22", day_of_week: "TUE", time_slot: "2 PM" },
    { student_id: "S22", day_of_week: "FRI", time_slot: "1 PM" },
    { student_id: "S22", day_of_week: "FRI", time_slot: "8 AM" },
    { student_id: "S22", day_of_week: "FRI", time_slot: "4 PM" },
    // S23
    { student_id: "S23", day_of_week: "WED", time_slot: "9 AM" },
    { student_id: "S23", day_of_week: "FRI", time_slot: "1 PM" },
    { student_id: "S23", day_of_week: "WED", time_slot: "12 PM" },
]

module.exports = {
    availabilityData
}