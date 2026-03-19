import { pool } from '../db.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const seedAvailability = async () => {
    const connection = await pool.getConnection();

    try {
        console.log('🌱 Starting availability data seed...\n');

        // Get all existing students and surveys
        const [surveys] = await connection.query('SELECT id FROM survey_configurations');
        const [students] = await connection.query('SELECT DISTINCT student_id FROM student_survey_entries');

        if (surveys.length === 0 || students.length === 0) {
            console.log('⚠️  No surveys or students found in database');
            connection.release();
            process.exit(0);
        }

        console.log(`Found ${surveys.length} surveys and ${students.length} students\n`);

        // Sample availability data - repeat for all students
        const timeSlots = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'];
        const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

        let insertCount = 0;

        for (const student of students) {
            // Give each student 3-5 random availability slots
            const numSlots = Math.floor(Math.random() * 3) + 3;
            const selectedSlots = new Set();

            while (selectedSlots.size < numSlots) {
                const randomDay = days[Math.floor(Math.random() * days.length)];
                const randomTime = timeSlots[Math.floor(Math.random() * timeSlots.length)];
                selectedSlots.add(`${randomDay}-${randomTime}`);
            }

            for (const slot of selectedSlots) {
                const [day, time] = slot.split('-');
                await connection.query(
                    'INSERT IGNORE INTO availability (student_id, day_of_week, time_slot) VALUES (?, ?, ?)',
                    [student.student_id, day, time]
                );
                insertCount++;
            }
        }

        console.log(`✓ Added ${insertCount} availability records\n`);
        console.log('✅ Availability data seed complete!');

    } catch (error) {
        console.error('❌ Error seeding availability:', error.message);
        process.exit(1);
    } finally {
        connection.release();
        await pool.end();
    }
};

seedAvailability();
