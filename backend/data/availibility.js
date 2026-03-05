const availabilityData = [
    // S01
    { student_id: "S01", day_of_week: "MON", time_slot: "9:00" },
    { student_id: "S01", day_of_week: "MON", time_slot: "14:00" },
    { student_id: "S01", day_of_week: "TUE", time_slot: "10:00" },
    { student_id: "S01", day_of_week: "WED", time_slot: "9:00" },
    { student_id: "S01", day_of_week: "WED", time_slot: "13:00" },
    { student_id: "S01", day_of_week: "THU", time_slot: "11:00" },
    { student_id: "S01", day_of_week: "FRI", time_slot: "15:00" },
    { student_id: "S01", day_of_week: "FRI", time_slot: "17:00" },
    // S02
    { student_id: "S02", day_of_week: "TUE", time_slot: "12:00" },
    { student_id: "S02", day_of_week: "THU", time_slot: "14:00" },
    // S03
    { student_id: "S03", day_of_week: "MON", time_slot: "10:00" },
    { student_id: "S03", day_of_week: "WED", time_slot: "11:00" },
    { student_id: "S03", day_of_week: "WED", time_slot: "16:00" },
    { student_id: "S03", day_of_week: "FRI", time_slot: "9:00" },
    { student_id: "S03", day_of_week: "SAT", time_slot: "10:00" },
    // S04
    { student_id: "S04", day_of_week: "TUE", time_slot: "9:00" },
    { student_id: "S04", day_of_week: "FRI", time_slot: "13:00" },
    // S05
    { student_id: "S05", day_of_week: "WED", time_slot: "15:00" },
    // S06
    { student_id: "S06", day_of_week: "MON", time_slot: "11:00" },
    { student_id: "S06", day_of_week: "TUE", time_slot: "14:00" },
    { student_id: "S06", day_of_week: "THU", time_slot: "9:00" },
    { student_id: "S06", day_of_week: "THU", time_slot: "16:00" },
    { student_id: "S06", day_of_week: "SAT", time_slot: "11:00" },
    // S07
    { student_id: "S07", day_of_week: "MON", time_slot: "13:00" },
    { student_id: "S07", day_of_week: "WED", time_slot: "10:00" },
    // S08
    { student_id: "S08", day_of_week: "MON", time_slot: "9:00" },
    { student_id: "S08", day_of_week: "TUE", time_slot: "11:00" },
    { student_id: "S08", day_of_week: "TUE", time_slot: "15:00" },
    { student_id: "S08", day_of_week: "WED", time_slot: "14:00" },
    { student_id: "S08", day_of_week: "THU", time_slot: "10:00" },
    { student_id: "S08", day_of_week: "FRI", time_slot: "9:00" },
    { student_id: "S08", day_of_week: "FRI", time_slot: "16:00" },
    // S09
    { student_id: "S09", day_of_week: "THU", time_slot: "13:00" },
    // S10
    { student_id: "S10", day_of_week: "MON", time_slot: "10:00" },
    { student_id: "S10", day_of_week: "MON", time_slot: "17:00" },
    { student_id: "S10", day_of_week: "WED", time_slot: "12:00" },
    { student_id: "S10", day_of_week: "FRI", time_slot: "14:00" },
    { student_id: "S10", day_of_week: "SAT", time_slot: "9:00" },
    // S11
    { student_id: "S11", day_of_week: "TUE", time_slot: "10:00" },
    { student_id: "S11", day_of_week: "FRI", time_slot: "11:00" },
    // S12
    { student_id: "S12", day_of_week: "MON", time_slot: "12:00" },
    { student_id: "S12", day_of_week: "TUE", time_slot: "16:00" },
    { student_id: "S12", day_of_week: "WED", time_slot: "9:00" },
    { student_id: "S12", day_of_week: "THU", time_slot: "14:00" },
    { student_id: "S12", day_of_week: "THU", time_slot: "17:00" },
    // S13
    { student_id: "S13", day_of_week: "MON", time_slot: "10:00" },
    { student_id: "S13", day_of_week: "MON", time_slot: "15:00" },
    { student_id: "S13", day_of_week: "TUE", time_slot: "9:00" },
    { student_id: "S13", day_of_week: "WED", time_slot: "13:00" },
    { student_id: "S13", day_of_week: "THU", time_slot: "10:00" },
    { student_id: "S13", day_of_week: "FRI", time_slot: "12:00" },
    { student_id: "S13", day_of_week: "SAT", time_slot: "14:00" },
    // S14
    { student_id: "S14", day_of_week: "WED", time_slot: "11:00" },
    { student_id: "S14", day_of_week: "FRI", time_slot: "10:00" },
    // S15
    { student_id: "S15", day_of_week: "TUE", time_slot: "13:00" },
    // S16
    { student_id: "S16", day_of_week: "MON", time_slot: "11:00" },
    { student_id: "S16", day_of_week: "TUE", time_slot: "9:00" },
    { student_id: "S16", day_of_week: "TUE", time_slot: "14:00" },
    { student_id: "S16", day_of_week: "WED", time_slot: "16:00" },
    { student_id: "S16", day_of_week: "THU", time_slot: "11:00" },
    { student_id: "S16", day_of_week: "FRI", time_slot: "9:00" },
    { student_id: "S16", day_of_week: "SAT", time_slot: "13:00" },
    // S17
    { student_id: "S17", day_of_week: "MON", time_slot: "14:00" },
    { student_id: "S17", day_of_week: "THU", time_slot: "12:00" },
    // S18
    { student_id: "S18", day_of_week: "TUE", time_slot: "10:00" },
    { student_id: "S18", day_of_week: "TUE", time_slot: "15:00" },
    { student_id: "S18", day_of_week: "WED", time_slot: "13:00" },
    { student_id: "S18", day_of_week: "FRI", time_slot: "11:00" },
    { student_id: "S18", day_of_week: "SAT", time_slot: "10:00" },
    // S19
    { student_id: "S19", day_of_week: "MON", time_slot: "9:00" },
    { student_id: "S19", day_of_week: "MON", time_slot: "16:00" },
    { student_id: "S19", day_of_week: "TUE", time_slot: "11:00" },
    { student_id: "S19", day_of_week: "WED", time_slot: "10:00" },
    { student_id: "S19", day_of_week: "THU", time_slot: "9:00" },
    { student_id: "S19", day_of_week: "THU", time_slot: "14:00" },
    { student_id: "S19", day_of_week: "FRI", time_slot: "13:00" },
    { student_id: "S19", day_of_week: "SAT", time_slot: "11:00" },
    // S20
    { student_id: "S20", day_of_week: "FRI", time_slot: "12:00" },
    // S21
    { student_id: "S21", day_of_week: "WED", time_slot: "14:00" },
    { student_id: "S21", day_of_week: "SAT", time_slot: "10:00" },
    // S22
    { student_id: "S22", day_of_week: "MON", time_slot: "13:00" },
    { student_id: "S22", day_of_week: "TUE", time_slot: "10:00" },
    { student_id: "S22", day_of_week: "WED", time_slot: "15:00" },
    { student_id: "S22", day_of_week: "THU", time_slot: "9:00" },
    { student_id: "S22", day_of_week: "THU", time_slot: "17:00" },
    // S23
    { student_id: "S23", day_of_week: "TUE", time_slot: "12:00" },
    { student_id: "S23", day_of_week: "FRI", time_slot: "15:00" },
]

module.exports = {
    availabilityData
}