import { pool } from '../db.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

/**
 * Seed script to populate the database with test data.
 * Creates three survey configurations with different constraints:
 * 1. Class with only 1 female
 * 2. Class with max group size 4 and class size 23
 * 3. Class with min group size 2 and class size 19
 */

const seedData = async () => {
    const connection = await pool.getConnection();

    try {
        console.log('🌱 Starting database seed...\n');

        // ===== SURVEY CONFIGURATION 1: Only 1 Female =====
        const surveyId1 = 'SURVEY-FEMALE-ONLY-001';
        console.log(`📝 Creating Survey Configuration 1: ${surveyId1}`);

        await connection.query(
            `INSERT INTO survey_configurations (id, course_name, class_size, team_limit, limit_type, use_gpa, prev_course, encryption_salt, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                surveyId1,
                'Advanced Algorithms',
                24,
                4,
                'max',
                true,
                null,
                'salt_survey_1',
                'open',
            ]
        );
        console.log('✓ Survey configuration 1 created');

        // Insert 24 students (1 female, 23 males) for survey 1
        const survey1Students = [
            // 1 Female
            { name: 'encrypted_f1_s1', iv: 'iv_f1_s1', gender: 'Female', gpa: 3.9 },
            // 23 Males
            { name: 'encrypted_m1_s1', iv: 'iv_m1_s1', gender: 'Male', gpa: 3.6 },
            { name: 'encrypted_m2_s1', iv: 'iv_m2_s1', gender: 'Male', gpa: 3.5 },
            { name: 'encrypted_m3_s1', iv: 'iv_m3_s1', gender: 'Male', gpa: 1.8 },
            { name: 'encrypted_m4_s1', iv: 'iv_m4_s1', gender: 'Male', gpa: 2.7 },
            { name: 'encrypted_m5_s1', iv: 'iv_m5_s1', gender: 'Male', gpa: 3.2 },
            { name: 'encrypted_m6_s1', iv: 'iv_m6_s1', gender: 'Male', gpa: 2.9 },
            { name: 'encrypted_m7_s1', iv: 'iv_m7_s1', gender: 'Male', gpa: 2.6 },
            { name: 'encrypted_m8_s1', iv: 'iv_m8_s1', gender: 'Male', gpa: 4.0 },
            { name: 'encrypted_m9_s1', iv: 'iv_m9_s1', gender: 'Male', gpa: 3.3 },
            { name: 'encrypted_m10_s1', iv: 'iv_m10_s1', gender: 'Male', gpa: 2.5 },
            { name: 'encrypted_m11_s1', iv: 'iv_m11_s1', gender: 'Male', gpa: 2.2 },
            { name: 'encrypted_m12_s1', iv: 'iv_m12_s1', gender: 'Male', gpa: 3.7 },
            { name: 'encrypted_m13_s1', iv: 'iv_m13_s1', gender: 'Male', gpa: 2.4 },
            { name: 'encrypted_m14_s1', iv: 'iv_m14_s1', gender: 'Male', gpa: 3.1 },
            { name: 'encrypted_m15_s1', iv: 'iv_m15_s1', gender: 'Male', gpa: 2.8 },
            { name: 'encrypted_m16_s1', iv: 'iv_m16_s1', gender: 'Male', gpa: 3.4 },
            { name: 'encrypted_m17_s1', iv: 'iv_m17_s1', gender: 'Male', gpa: 1.9 },
            { name: 'encrypted_m18_s1', iv: 'iv_m18_s1', gender: 'Male', gpa: 3.8 },
            { name: 'encrypted_m19_s1', iv: 'iv_m19_s1', gender: 'Male', gpa: 2.3 },
            { name: 'encrypted_m20_s1', iv: 'iv_m20_s1', gender: 'Male', gpa: 3.0 },
            { name: 'encrypted_m21_s1', iv: 'iv_m21_s1', gender: 'Male', gpa: 2.1 },
            { name: 'encrypted_m22_s1', iv: 'iv_m22_s1', gender: 'Male', gpa: 3.9 },
            { name: 'encrypted_m23_s1', iv: 'iv_m23_s1', gender: 'Male', gpa: 2.6 },
        ];

        for (const student of survey1Students) {
            await connection.query(
                `INSERT INTO student_survey_entries (encrypted_name, iv, gender, gpa, survey_id) 
       VALUES (?, ?, ?, ?, ?)`,
                [student.name, student.iv, student.gender, student.gpa, surveyId1]
            );
        }
        console.log(`✓ ${survey1Students.length} students added to survey 1\n`);

        // ===== SURVEY CONFIGURATION 2: Max Group Size 4, Class Size 23 =====
        const surveyId2 = 'SURVEY-MAX-GROUP-4-001';
        console.log(`📝 Creating Survey Configuration 2: ${surveyId2}`);

        await connection.query(
            `INSERT INTO survey_configurations (id, course_name, class_size, team_limit, limit_type, use_gpa, prev_course, encryption_salt, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                surveyId2,
                'Web Development',
                23,
                4,
                'max',
                true,
                null,
                'salt_survey_2',
                'open',
            ]
        );
        console.log('✓ Survey configuration 2 created');

        // Insert 23 students with varied demographics for survey 2
        const survey2Students = [
            // 8 Males
            { name: 'encrypted_m1', iv: 'iv_m1', gender: 'Male', gpa: 3.6 },
            { name: 'encrypted_m2', iv: 'iv_m2', gender: 'Male', gpa: 3.5 },
            { name: 'encrypted_m3', iv: 'iv_m3', gender: 'Male', gpa: 1.8 },
            { name: 'encrypted_m4', iv: 'iv_m4', gender: 'Male', gpa: 2.7 },
            { name: 'encrypted_m5', iv: 'iv_m5', gender: 'Male', gpa: 3.2 },
            { name: 'encrypted_m6', iv: 'iv_m6', gender: 'Male', gpa: 2.9 },
            { name: 'encrypted_m7', iv: 'iv_m7', gender: 'Male', gpa: 2.6 },
            { name: 'encrypted_m8', iv: 'iv_m8', gender: 'Male', gpa: 4.0 },
            // 13 Females
            { name: 'encrypted_f1', iv: 'iv_f1', gender: 'Female', gpa: 3.9 },
            { name: 'encrypted_f2', iv: 'iv_f2', gender: 'Female', gpa: 2.0 },
            { name: 'encrypted_f3', iv: 'iv_f3', gender: 'Female', gpa: 2.3 },
            { name: 'encrypted_f4', iv: 'iv_f4', gender: 'Female', gpa: 2.5 },
            { name: 'encrypted_f5', iv: 'iv_f5', gender: 'Female', gpa: 3.3 },
            { name: 'encrypted_f6', iv: 'iv_f6', gender: 'Female', gpa: 1.9 },
            { name: 'encrypted_f7', iv: 'iv_f7', gender: 'Female', gpa: 4.0 },
            { name: 'encrypted_f8', iv: 'iv_f8', gender: 'Female', gpa: 3.3 },
            { name: 'encrypted_f9', iv: 'iv_f9', gender: 'Female', gpa: 1.6 },
            { name: 'encrypted_f10', iv: 'iv_f10', gender: 'Female', gpa: 3.1 },
            { name: 'encrypted_f11', iv: 'iv_f11', gender: 'Female', gpa: 2.8 },
            { name: 'encrypted_f12', iv: 'iv_f12', gender: 'Female', gpa: 2.2 },
            { name: 'encrypted_f13', iv: 'iv_f13', gender: 'Female', gpa: 3.7 },
            // 2 Other
            { name: 'encrypted_o1', iv: 'iv_o1', gender: 'Other', gpa: 2.8 },
            { name: 'encrypted_o2', iv: 'iv_o2', gender: 'Other', gpa: 4.0 },
        ];

        for (const student of survey2Students) {
            await connection.query(
                `INSERT INTO student_survey_entries (encrypted_name, iv, gender, gpa, survey_id) 
         VALUES (?, ?, ?, ?, ?)`,
                [student.name, student.iv, student.gender, student.gpa, surveyId2]
            );
        }
        console.log(`✓ ${survey2Students.length} students added to survey 2\n`);

        // ===== SURVEY CONFIGURATION 3: Min Group Size 2, Class Size 19 =====
        const surveyId3 = 'SURVEY-MIN-GROUP-2-001';
        console.log(`📝 Creating Survey Configuration 3: ${surveyId3}`);

        await connection.query(
            `INSERT INTO survey_configurations (id, course_name, class_size, team_limit, limit_type, use_gpa, prev_course, encryption_salt, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                surveyId3,
                'Data Structures',
                19,
                2,
                'min',
                true,
                null,
                'salt_survey_3',
                'open',
            ]
        );
        console.log('✓ Survey configuration 3 created');

        // Insert 19 students with varied demographics for survey 3
        const survey3Students = [
            // 9 Males
            { name: 'encrypted_m1_s3', iv: 'iv_m1_s3', gender: 'Male', gpa: 3.6 },
            { name: 'encrypted_m2_s3', iv: 'iv_m2_s3', gender: 'Male', gpa: 3.5 },
            { name: 'encrypted_m3_s3', iv: 'iv_m3_s3', gender: 'Male', gpa: 1.8 },
            { name: 'encrypted_m4_s3', iv: 'iv_m4_s3', gender: 'Male', gpa: 2.7 },
            { name: 'encrypted_m5_s3', iv: 'iv_m5_s3', gender: 'Male', gpa: 3.2 },
            { name: 'encrypted_m6_s3', iv: 'iv_m6_s3', gender: 'Male', gpa: 2.9 },
            { name: 'encrypted_m7_s3', iv: 'iv_m7_s3', gender: 'Male', gpa: 2.6 },
            { name: 'encrypted_m8_s3', iv: 'iv_m8_s3', gender: 'Male', gpa: 4.0 },
            { name: 'encrypted_m9_s3', iv: 'iv_m9_s3', gender: 'Male', gpa: 3.3 },
            // 9 Females
            { name: 'encrypted_f1_s3', iv: 'iv_f1_s3', gender: 'Female', gpa: 3.9 },
            { name: 'encrypted_f2_s3', iv: 'iv_f2_s3', gender: 'Female', gpa: 2.0 },
            { name: 'encrypted_f3_s3', iv: 'iv_f3_s3', gender: 'Female', gpa: 2.3 },
            { name: 'encrypted_f4_s3', iv: 'iv_f4_s3', gender: 'Female', gpa: 2.5 },
            { name: 'encrypted_f5_s3', iv: 'iv_f5_s3', gender: 'Female', gpa: 3.3 },
            { name: 'encrypted_f6_s3', iv: 'iv_f6_s3', gender: 'Female', gpa: 1.9 },
            { name: 'encrypted_f7_s3', iv: 'iv_f7_s3', gender: 'Female', gpa: 4.0 },
            { name: 'encrypted_f8_s3', iv: 'iv_f8_s3', gender: 'Female', gpa: 3.3 },
            { name: 'encrypted_f9_s3', iv: 'iv_f9_s3', gender: 'Female', gpa: 1.6 },
            // 1 Other
            { name: 'encrypted_o1_s3', iv: 'iv_o1_s3', gender: 'Other', gpa: 2.8 },
        ];

        for (const student of survey3Students) {
            await connection.query(
                `INSERT INTO student_survey_entries (encrypted_name, iv, gender, gpa, survey_id) 
         VALUES (?, ?, ?, ?, ?)`,
                [student.name, student.iv, student.gender, student.gpa, surveyId3]
            );
        }
        console.log(`✓ ${survey3Students.length} students added to survey 3\n`);

        // ===== INSERT AVAILABILITY DATA =====
        console.log('📝 Inserting availability data...');

        // Availability data for survey 2 students
        const availabilityDataSurvey2 = [
            // S01 - 7 slots
            { student_id: 1, day_of_week: 'MON', time_slot: '9 AM' },
            { student_id: 1, day_of_week: 'MON', time_slot: '1 PM' },
            { student_id: 1, day_of_week: 'TUE', time_slot: '10 AM' },
            { student_id: 1, day_of_week: 'TUE', time_slot: '2 PM' },
            { student_id: 1, day_of_week: 'WED', time_slot: '9 AM' },
            { student_id: 1, day_of_week: 'MON', time_slot: '4 PM' },
            { student_id: 1, day_of_week: 'TUE', time_slot: '8 AM' },
            // S02 - 3 slots
            { student_id: 2, day_of_week: 'WED', time_slot: '9 AM' },
            { student_id: 2, day_of_week: 'THU', time_slot: '2 PM' },
            { student_id: 2, day_of_week: 'SAT', time_slot: '9 AM' },
            // S03 - 5 slots
            { student_id: 3, day_of_week: 'MON', time_slot: '9 AM' },
            { student_id: 3, day_of_week: 'TUE', time_slot: '10 AM' },
            { student_id: 3, day_of_week: 'THU', time_slot: '11 AM' },
            { student_id: 3, day_of_week: 'MON', time_slot: '4 PM' },
            { student_id: 3, day_of_week: 'SAT', time_slot: '2 PM' },
            // S04 - 3 slots
            { student_id: 4, day_of_week: 'MON', time_slot: '9 AM' },
            { student_id: 4, day_of_week: 'WED', time_slot: '3 PM' },
            { student_id: 4, day_of_week: 'SAT', time_slot: '2 PM' },
            // S05 - 2 slots
            { student_id: 5, day_of_week: 'TUE', time_slot: '2 PM' },
            { student_id: 5, day_of_week: 'WED', time_slot: '5 PM' },
            // S06 - 5 slots
            { student_id: 6, day_of_week: 'MON', time_slot: '1 PM' },
            { student_id: 6, day_of_week: 'WED', time_slot: '9 AM' },
            { student_id: 6, day_of_week: 'FRI', time_slot: '10 AM' },
            { student_id: 6, day_of_week: 'TUE', time_slot: '8 AM' },
            { student_id: 6, day_of_week: 'SUN', time_slot: '10 AM' },
            // S07 - 3 slots
            { student_id: 7, day_of_week: 'TUE', time_slot: '10 AM' },
            { student_id: 7, day_of_week: 'FRI', time_slot: '1 PM' },
            { student_id: 7, day_of_week: 'SUN', time_slot: '10 AM' },
            // S08 - 7 slots
            { student_id: 8, day_of_week: 'MON', time_slot: '1 PM' },
            { student_id: 8, day_of_week: 'TUE', time_slot: '10 AM' },
            { student_id: 8, day_of_week: 'WED', time_slot: '9 AM' },
            { student_id: 8, day_of_week: 'THU', time_slot: '11 AM' },
            { student_id: 8, day_of_week: 'FRI', time_slot: '10 AM' },
            { student_id: 8, day_of_week: 'TUE', time_slot: '5 PM' },
            { student_id: 8, day_of_week: 'WED', time_slot: '12 PM' },
            // S09 - 2 slots
            { student_id: 9, day_of_week: 'THU', time_slot: '11 AM' },
            { student_id: 9, day_of_week: 'THU', time_slot: '8 AM' },
            // S10 - 5 slots
            { student_id: 10, day_of_week: 'TUE', time_slot: '2 PM' },
            { student_id: 10, day_of_week: 'WED', time_slot: '3 PM' },
            { student_id: 10, day_of_week: 'FRI', time_slot: '1 PM' },
            { student_id: 10, day_of_week: 'TUE', time_slot: '5 PM' },
            { student_id: 10, day_of_week: 'SUN', time_slot: '2 PM' },
            // S11 - 3 slots
            { student_id: 11, day_of_week: 'MON', time_slot: '1 PM' },
            { student_id: 11, day_of_week: 'THU', time_slot: '11 AM' },
            { student_id: 11, day_of_week: 'SUN', time_slot: '2 PM' },
            // S12 - 5 slots
            { student_id: 12, day_of_week: 'MON', time_slot: '9 AM' },
            { student_id: 12, day_of_week: 'THU', time_slot: '2 PM' },
            { student_id: 12, day_of_week: 'SAT', time_slot: '11 AM' },
            { student_id: 12, day_of_week: 'WED', time_slot: '12 PM' },
            { student_id: 12, day_of_week: 'WED', time_slot: '5 PM' },
            // S13 - 7 slots
            { student_id: 13, day_of_week: 'MON', time_slot: '9 AM' },
            { student_id: 13, day_of_week: 'TUE', time_slot: '2 PM' },
            { student_id: 13, day_of_week: 'WED', time_slot: '3 PM' },
            { student_id: 13, day_of_week: 'THU', time_slot: '2 PM' },
            { student_id: 13, day_of_week: 'FRI', time_slot: '1 PM' },
            { student_id: 13, day_of_week: 'WED', time_slot: '5 PM' },
            { student_id: 13, day_of_week: 'THU', time_slot: '8 AM' },
            // S14 - 3 slots
            { student_id: 14, day_of_week: 'TUE', time_slot: '2 PM' },
            { student_id: 14, day_of_week: 'FRI', time_slot: '10 AM' },
            { student_id: 14, day_of_week: 'MON', time_slot: '4 PM' },
            // S15 - 2 slots
            { student_id: 15, day_of_week: 'MON', time_slot: '1 PM' },
            { student_id: 15, day_of_week: 'THU', time_slot: '4 PM' },
            // S16 - 7 slots
            { student_id: 16, day_of_week: 'TUE', time_slot: '10 AM' },
            { student_id: 16, day_of_week: 'WED', time_slot: '9 AM' },
            { student_id: 16, day_of_week: 'THU', time_slot: '11 AM' },
            { student_id: 16, day_of_week: 'FRI', time_slot: '10 AM' },
            { student_id: 16, day_of_week: 'SAT', time_slot: '11 AM' },
            { student_id: 16, day_of_week: 'THU', time_slot: '4 PM' },
            { student_id: 16, day_of_week: 'FRI', time_slot: '8 AM' },
            // S17 - 3 slots
            { student_id: 17, day_of_week: 'WED', time_slot: '3 PM' },
            { student_id: 17, day_of_week: 'SAT', time_slot: '11 AM' },
            { student_id: 17, day_of_week: 'TUE', time_slot: '8 AM' },
            // S18 - 5 slots
            { student_id: 18, day_of_week: 'TUE', time_slot: '10 AM' },
            { student_id: 18, day_of_week: 'THU', time_slot: '11 AM' },
            { student_id: 18, day_of_week: 'FRI', time_slot: '10 AM' },
            { student_id: 18, day_of_week: 'THU', time_slot: '8 AM' },
            { student_id: 18, day_of_week: 'THU', time_slot: '4 PM' },
            // S19 - 7 slots
            { student_id: 19, day_of_week: 'MON', time_slot: '9 AM' },
            { student_id: 19, day_of_week: 'MON', time_slot: '1 PM' },
            { student_id: 19, day_of_week: 'TUE', time_slot: '2 PM' },
            { student_id: 19, day_of_week: 'WED', time_slot: '3 PM' },
            { student_id: 19, day_of_week: 'THU', time_slot: '2 PM' },
            { student_id: 19, day_of_week: 'FRI', time_slot: '4 PM' },
            { student_id: 19, day_of_week: 'SAT', time_slot: '9 AM' },
            // S20 - 2 slots
            { student_id: 20, day_of_week: 'FRI', time_slot: '10 AM' },
            { student_id: 20, day_of_week: 'FRI', time_slot: '8 AM' },
            // S21 - 3 slots
            { student_id: 21, day_of_week: 'MON', time_slot: '9 AM' },
            { student_id: 21, day_of_week: 'THU', time_slot: '2 PM' },
            { student_id: 21, day_of_week: 'TUE', time_slot: '5 PM' },
            // S22 - 5 slots
            { student_id: 22, day_of_week: 'MON', time_slot: '1 PM' },
            { student_id: 22, day_of_week: 'TUE', time_slot: '2 PM' },
            { student_id: 22, day_of_week: 'FRI', time_slot: '1 PM' },
            { student_id: 22, day_of_week: 'FRI', time_slot: '8 AM' },
            { student_id: 22, day_of_week: 'FRI', time_slot: '4 PM' },
            // S23 - 3 slots
            { student_id: 23, day_of_week: 'WED', time_slot: '9 AM' },
            { student_id: 23, day_of_week: 'FRI', time_slot: '1 PM' },
            { student_id: 23, day_of_week: 'WED', time_slot: '12 PM' },
        ];

        for (const availability of availabilityDataSurvey2) {
            await connection.query(
                `INSERT INTO availability (student_id, day_of_week, time_slot) 
         VALUES (?, ?, ?)`,
                [availability.student_id, availability.day_of_week, availability.time_slot]
            );
        }
        console.log(`✓ ${availabilityDataSurvey2.length} availability slots added\n`);

        console.log('✅ Database seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log('   - Survey 1 (Female Only): 1 student');
        console.log('   - Survey 2 (Max Group 4): 23 students');
        console.log('   - Survey 3 (Min Group 2): 19 students');
        console.log('   - Total: 43 students seeded');
        console.log(`   - Availability slots: ${availabilityDataSurvey2.length}\n`);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    } finally {
        connection.release();
        await pool.end();
    }
};

// Run the seed
seedData().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
