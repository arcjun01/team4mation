import { pool } from './db.js';

const testAvailability = async () => {
    try {
        // Check students in survey 1
        const [students] = await pool.execute(
            'SELECT COUNT(*) as count FROM student_survey_entries WHERE survey_id = ?',
            ['SURVEY-FEMALE-ONLY-001']
        );
        console.log('Survey 1 students:', students[0].count);

        // Check availability data
        const [avail] = await pool.execute(
            'SELECT COUNT(*) as count FROM availability'
        );
        console.log('Total availability slots:', avail[0].count);

        // Check availability per student
        const [byStudent] = await pool.execute(
            'SELECT student_id, COUNT(*) as slot_count FROM availability GROUP BY student_id ORDER BY student_id LIMIT 10'
        );
        console.log('\nAvailability per student (first 10):');
        byStudent.forEach(row => {
            console.log(`  Student ${row.student_id}: ${row.slot_count} slots`);
        });

        // Check specific group (students 1-4)
        const [group1Avail] = await pool.execute(
            'SELECT * FROM availability WHERE student_id IN (1,2,3,4) ORDER BY student_id, day_of_week'
        );
        console.log('\nGroup 1 (students 1-4) availability:');
        const byStudentMap = {};
        group1Avail.forEach(row => {
            if (!byStudentMap[row.student_id]) {
                byStudentMap[row.student_id] = [];
            }
            byStudentMap[row.student_id].push(`${row.day_of_week} ${row.time_slot}`);
        });
        
        Object.entries(byStudentMap).forEach(([sid, slots]) => {
            console.log(`  S${sid}: ${slots.join(', ')}`);
        });

        // Find common times
        const students_array = [1, 2, 3, 4];
        const sets = [];
        for (const sid of students_array) {
            const slots = group1Avail
                .filter(a => a.student_id == sid)
                .map(a => `${a.day_of_week}-${a.time_slot}`);
            sets.push(new Set(slots));
        }

        let common = new Set(sets[0]);
        for (let i = 1; i < sets.length; i++) {
            common = new Set([...common].filter(x => sets[i].has(x)));
            console.log(`  After student ${students_array[i]}: ${common.size} common`);
        }

        console.log(`\nFinal common times for group 1: ${Array.from(common).join(', ') || 'NONE'}`);

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

testAvailability();
