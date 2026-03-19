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

        // ===== CLEANUP: Delete existing data and reset auto_increment =====
        console.log('🧹 Cleaning up existing data and resetting auto_increment...');
        await connection.query('TRUNCATE TABLE availability');
        await connection.query('TRUNCATE TABLE student_survey_entries');
        await connection.query('TRUNCATE TABLE survey_configurations');
        console.log('✓ Cleanup completed\n');

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
            { name: 'encrypted_s1_f1', iv: 'iv_s1_f1', gender: 'Female', gpa: 3.9, commitment: 4 },
            // 23 Males
            { name: 'encrypted_s1_m1', iv: 'iv_s1_m1', gender: 'Male', gpa: 3.6, commitment: 1 },
            { name: 'encrypted_s1_m2', iv: 'iv_s1_m2', gender: 'Male', gpa: 3.5, commitment: 2 },
            { name: 'encrypted_s1_m3', iv: 'iv_s1_m3', gender: 'Male', gpa: 1.8, commitment: 3 },
            { name: 'encrypted_s1_m4', iv: 'iv_s1_m4', gender: 'Male', gpa: 2.7, commitment: 4 },
            { name: 'encrypted_s1_m5', iv: 'iv_s1_m5', gender: 'Male', gpa: 3.2, commitment: 1 },
            { name: 'encrypted_s1_m6', iv: 'iv_s1_m6', gender: 'Male', gpa: 2.9, commitment: 2 },
            { name: 'encrypted_s1_m7', iv: 'iv_s1_m7', gender: 'Male', gpa: 2.6, commitment: 3 },
            { name: 'encrypted_s1_m8', iv: 'iv_s1_m8', gender: 'Male', gpa: 4.0, commitment: 4 },
            { name: 'encrypted_s1_m9', iv: 'iv_s1_m9', gender: 'Male', gpa: 3.3, commitment: 1 },
            { name: 'encrypted_s1_m10', iv: 'iv_s1_m10', gender: 'Male', gpa: 2.5, commitment: 2 },
            { name: 'encrypted_s1_m11', iv: 'iv_s1_m11', gender: 'Male', gpa: 2.2, commitment: 3 },
            { name: 'encrypted_s1_m12', iv: 'iv_s1_m12', gender: 'Male', gpa: 3.7, commitment: 4 },
            { name: 'encrypted_s1_m13', iv: 'iv_s1_m13', gender: 'Male', gpa: 2.4, commitment: 1 },
            { name: 'encrypted_s1_m14', iv: 'iv_s1_m14', gender: 'Male', gpa: 3.1, commitment: 2 },
            { name: 'encrypted_s1_m15', iv: 'iv_s1_m15', gender: 'Male', gpa: 2.8, commitment: 3 },
            { name: 'encrypted_s1_m16', iv: 'iv_s1_m16', gender: 'Male', gpa: 3.4, commitment: 4 },
            { name: 'encrypted_s1_m17', iv: 'iv_s1_m17', gender: 'Male', gpa: 1.9, commitment: 1 },
            { name: 'encrypted_s1_m18', iv: 'iv_s1_m18', gender: 'Male', gpa: 3.8, commitment: 2 },
            { name: 'encrypted_s1_m19', iv: 'iv_s1_m19', gender: 'Male', gpa: 2.3, commitment: 3 },
            { name: 'encrypted_s1_m20', iv: 'iv_s1_m20', gender: 'Male', gpa: 3.0, commitment: 4 },
            { name: 'encrypted_s1_m21', iv: 'iv_s1_m21', gender: 'Male', gpa: 2.1, commitment: 1 },
            { name: 'encrypted_s1_m22', iv: 'iv_s1_m22', gender: 'Male', gpa: 3.9, commitment: 2 },
            { name: 'encrypted_s1_m23', iv: 'iv_s1_m23', gender: 'Male', gpa: 2.6, commitment: 3 },
        ];

        for (const student of survey1Students) {
            await connection.query(
                `INSERT INTO student_survey_entries (encrypted_name, iv, gender, gpa, commitment, survey_id) 
       VALUES (?, ?, ?, ?, ?, ?)`,
                [student.name, student.iv, student.gender, student.gpa, student.commitment, surveyId1]
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
            { name: 'encrypted_s2_m1', iv: 'iv_s2_m1', gender: 'Male', gpa: 3.6, commitment: 4 },
            { name: 'encrypted_s2_m2', iv: 'iv_s2_m2', gender: 'Male', gpa: 3.5, commitment: 3 },
            { name: 'encrypted_s2_m3', iv: 'iv_s2_m3', gender: 'Male', gpa: 1.8, commitment: 1 },
            { name: 'encrypted_s2_m4', iv: 'iv_s2_m4', gender: 'Male', gpa: 2.7, commitment: 2 },
            { name: 'encrypted_s2_m5', iv: 'iv_s2_m5', gender: 'Male', gpa: 3.2, commitment: 4 },
            { name: 'encrypted_s2_m6', iv: 'iv_s2_m6', gender: 'Male', gpa: 2.9, commitment: 3 },
            { name: 'encrypted_s2_m7', iv: 'iv_s2_m7', gender: 'Male', gpa: 2.6, commitment: 1 },
            { name: 'encrypted_s2_m8', iv: 'iv_s2_m8', gender: 'Male', gpa: 4.0, commitment: 2 },
            // 13 Females
            { name: 'encrypted_s2_f1', iv: 'iv_s2_f1', gender: 'Female', gpa: 3.9, commitment: 4 },
            { name: 'encrypted_s2_f2', iv: 'iv_s2_f2', gender: 'Female', gpa: 2.0, commitment: 1 },
            { name: 'encrypted_s2_f3', iv: 'iv_s2_f3', gender: 'Female', gpa: 2.3, commitment: 2 },
            { name: 'encrypted_s2_f4', iv: 'iv_s2_f4', gender: 'Female', gpa: 2.5, commitment: 3 },
            { name: 'encrypted_s2_f5', iv: 'iv_s2_f5', gender: 'Female', gpa: 3.3, commitment: 4 },
            { name: 'encrypted_s2_f6', iv: 'iv_s2_f6', gender: 'Female', gpa: 1.9, commitment: 1 },
            { name: 'encrypted_s2_f7', iv: 'iv_s2_f7', gender: 'Female', gpa: 4.0, commitment: 2 },
            { name: 'encrypted_s2_f8', iv: 'iv_s2_f8', gender: 'Female', gpa: 3.3, commitment: 3 },
            { name: 'encrypted_s2_f9', iv: 'iv_s2_f9', gender: 'Female', gpa: 1.6, commitment: 4 },
            { name: 'encrypted_s2_f10', iv: 'iv_s2_f10', gender: 'Female', gpa: 3.1, commitment: 1 },
            { name: 'encrypted_s2_f11', iv: 'iv_s2_f11', gender: 'Female', gpa: 2.8, commitment: 2 },
            { name: 'encrypted_s2_f12', iv: 'iv_s2_f12', gender: 'Female', gpa: 2.2, commitment: 3 },
            { name: 'encrypted_s2_f13', iv: 'iv_s2_f13', gender: 'Female', gpa: 3.7, commitment: 4 },
            // 2 Other
            { name: 'encrypted_s2_o1', iv: 'iv_s2_o1', gender: 'Other', gpa: 2.8, commitment: 1 },
            { name: 'encrypted_s2_o2', iv: 'iv_s2_o2', gender: 'Other', gpa: 4.0, commitment: 3 },
        ];

        for (const student of survey2Students) {
            await connection.query(
                `INSERT INTO student_survey_entries (encrypted_name, iv, gender, gpa, commitment, survey_id) 
         VALUES (?, ?, ?, ?, ?, ?)`,
                [student.name, student.iv, student.gender, student.gpa, student.commitment, surveyId2]
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
            { name: 'encrypted_s3_m1', iv: 'iv_s3_m1', gender: 'Male', gpa: 3.6, commitment: 4 },
            { name: 'encrypted_s3_m2', iv: 'iv_s3_m2', gender: 'Male', gpa: 3.5, commitment: 3 },
            { name: 'encrypted_s3_m3', iv: 'iv_s3_m3', gender: 'Male', gpa: 1.8, commitment: 1 },
            { name: 'encrypted_s3_m4', iv: 'iv_s3_m4', gender: 'Male', gpa: 2.7, commitment: 2 },
            { name: 'encrypted_s3_m5', iv: 'iv_s3_m5', gender: 'Male', gpa: 3.2, commitment: 4 },
            { name: 'encrypted_s3_m6', iv: 'iv_s3_m6', gender: 'Male', gpa: 2.9, commitment: 3 },
            { name: 'encrypted_s3_m7', iv: 'iv_s3_m7', gender: 'Male', gpa: 2.6, commitment: 1 },
            { name: 'encrypted_s3_m8', iv: 'iv_s3_m8', gender: 'Male', gpa: 4.0, commitment: 2 },
            { name: 'encrypted_s3_m9', iv: 'iv_s3_m9', gender: 'Male', gpa: 3.3, commitment: 4 },
            // 9 Females
            { name: 'encrypted_s3_f1', iv: 'iv_s3_f1', gender: 'Female', gpa: 3.9, commitment: 1 },
            { name: 'encrypted_s3_f2', iv: 'iv_s3_f2', gender: 'Female', gpa: 2.0, commitment: 2 },
            { name: 'encrypted_s3_f3', iv: 'iv_s3_f3', gender: 'Female', gpa: 2.3, commitment: 3 },
            { name: 'encrypted_s3_f4', iv: 'iv_s3_f4', gender: 'Female', gpa: 2.5, commitment: 4 },
            { name: 'encrypted_s3_f5', iv: 'iv_s3_f5', gender: 'Female', gpa: 3.3, commitment: 1 },
            { name: 'encrypted_s3_f6', iv: 'iv_s3_f6', gender: 'Female', gpa: 1.9, commitment: 2 },
            { name: 'encrypted_s3_f7', iv: 'iv_s3_f7', gender: 'Female', gpa: 4.0, commitment: 3 },
            { name: 'encrypted_s3_f8', iv: 'iv_s3_f8', gender: 'Female', gpa: 3.3, commitment: 4 },
            { name: 'encrypted_s3_f9', iv: 'iv_s3_f9', gender: 'Female', gpa: 1.6, commitment: 2 },
            // 1 Other
            { name: 'encrypted_s3_o1', iv: 'iv_s3_o1', gender: 'Other', gpa: 2.8, commitment: 3 },
        ];

        for (const student of survey3Students) {
            await connection.query(
                `INSERT INTO student_survey_entries (encrypted_name, iv, gender, gpa, commitment, survey_id) 
         VALUES (?, ?, ?, ?, ?, ?)`,
                [student.name, student.iv, student.gender, student.gpa, student.commitment, surveyId3]
            );
        }
        console.log(`✓ ${survey3Students.length} students added to survey 3\n`);

        // ===== INSERT AVAILABILITY DATA =====
        console.log('📝 Inserting availability data...');

        // Availability data for survey 1 students (24 students)
        // Groups are formed: 1-4, 5-8, 9-12, 13-16, 17-20, 21-24
        // Using realistic time blocks (consecutive hours representing availability windows)
        const availabilityDataSurvey1 = [
            // GROUP 1 (students 1-4) - Common: MON 4-7 PM, WED 2-4 PM, FRI 3-5 PM
            // S1: 6 slots covering common times
            { student_id: 1, day_of_week: 'MON', time_slot: '4 PM' },
            { student_id: 1, day_of_week: 'MON', time_slot: '5 PM' },
            { student_id: 1, day_of_week: 'MON', time_slot: '6 PM' },
            { student_id: 1, day_of_week: 'WED', time_slot: '2 PM' },
            { student_id: 1, day_of_week: 'WED', time_slot: '3 PM' },
            { student_id: 1, day_of_week: 'FRI', time_slot: '3 PM' },
            { student_id: 1, day_of_week: 'FRI', time_slot: '4 PM' },
            { student_id: 1, day_of_week: 'FRI', time_slot: '5 PM' },
            
            // S2: same common times
            { student_id: 2, day_of_week: 'MON', time_slot: '4 PM' },
            { student_id: 2, day_of_week: 'MON', time_slot: '5 PM' },
            { student_id: 2, day_of_week: 'MON', time_slot: '6 PM' },
            { student_id: 2, day_of_week: 'MON', time_slot: '7 PM' },
            { student_id: 2, day_of_week: 'WED', time_slot: '2 PM' },
            { student_id: 2, day_of_week: 'WED', time_slot: '3 PM' },
            { student_id: 2, day_of_week: 'WED', time_slot: '4 PM' },
            { student_id: 2, day_of_week: 'FRI', time_slot: '3 PM' },
            { student_id: 2, day_of_week: 'FRI', time_slot: '4 PM' },
            { student_id: 2, day_of_week: 'FRI', time_slot: '5 PM' },
            { student_id: 2, day_of_week: 'FRI', time_slot: '6 PM' },
            
            // S3: same common times
            { student_id: 3, day_of_week: 'MON', time_slot: '4 PM' },
            { student_id: 3, day_of_week: 'MON', time_slot: '5 PM' },
            { student_id: 3, day_of_week: 'MON', time_slot: '6 PM' },
            { student_id: 3, day_of_week: 'WED', time_slot: '2 PM' },
            { student_id: 3, day_of_week: 'WED', time_slot: '3 PM' },
            { student_id: 3, day_of_week: 'FRI', time_slot: '3 PM' },
            { student_id: 3, day_of_week: 'FRI', time_slot: '4 PM' },
            { student_id: 3, day_of_week: 'FRI', time_slot: '5 PM' },
            { student_id: 3, day_of_week: 'SAT', time_slot: '9 AM' },
            
            // S4: same common times
            { student_id: 4, day_of_week: 'MON', time_slot: '4 PM' },
            { student_id: 4, day_of_week: 'MON', time_slot: '5 PM' },
            { student_id: 4, day_of_week: 'MON', time_slot: '6 PM' },
            { student_id: 4, day_of_week: 'MON', time_slot: '7 PM' },
            { student_id: 4, day_of_week: 'WED', time_slot: '2 PM' },
            { student_id: 4, day_of_week: 'WED', time_slot: '3 PM' },
            { student_id: 4, day_of_week: 'FRI', time_slot: '3 PM' },
            { student_id: 4, day_of_week: 'FRI', time_slot: '4 PM' },
            { student_id: 4, day_of_week: 'SUN', time_slot: '10 AM' },
            
            // GROUP 2 (students 5-8) - Common: TUE 10 AM-12 PM, THU 1-3 PM, SAT 10-11 AM
            // S5: 8 slots
            { student_id: 5, day_of_week: 'TUE', time_slot: '10 AM' },
            { student_id: 5, day_of_week: 'TUE', time_slot: '11 AM' },
            { student_id: 5, day_of_week: 'TUE', time_slot: '12 PM' },
            { student_id: 5, day_of_week: 'THU', time_slot: '1 PM' },
            { student_id: 5, day_of_week: 'THU', time_slot: '2 PM' },
            { student_id: 5, day_of_week: 'THU', time_slot: '3 PM' },
            { student_id: 5, day_of_week: 'SAT', time_slot: '10 AM' },
            { student_id: 5, day_of_week: 'SAT', time_slot: '11 AM' },
            
            // S6: same common times
            { student_id: 6, day_of_week: 'TUE', time_slot: '10 AM' },
            { student_id: 6, day_of_week: 'TUE', time_slot: '11 AM' },
            { student_id: 6, day_of_week: 'TUE', time_slot: '12 PM' },
            { student_id: 6, day_of_week: 'THU', time_slot: '1 PM' },
            { student_id: 6, day_of_week: 'THU', time_slot: '2 PM' },
            { student_id: 6, day_of_week: 'THU', time_slot: '3 PM' },
            { student_id: 6, day_of_week: 'SAT', time_slot: '10 AM' },
            { student_id: 6, day_of_week: 'SAT', time_slot: '11 AM' },
            { student_id: 6, day_of_week: 'MON', time_slot: '9 AM' },
            
            // S7: same common times
            { student_id: 7, day_of_week: 'TUE', time_slot: '10 AM' },
            { student_id: 7, day_of_week: 'TUE', time_slot: '11 AM' },
            { student_id: 7, day_of_week: 'TUE', time_slot: '12 PM' },
            { student_id: 7, day_of_week: 'THU', time_slot: '1 PM' },
            { student_id: 7, day_of_week: 'THU', time_slot: '2 PM' },
            { student_id: 7, day_of_week: 'THU', time_slot: '3 PM' },
            { student_id: 7, day_of_week: 'SAT', time_slot: '10 AM' },
            { student_id: 7, day_of_week: 'SAT', time_slot: '11 AM' },
            { student_id: 7, day_of_week: 'WED', time_slot: '6 PM' },
            
            // S8: same common times
            { student_id: 8, day_of_week: 'TUE', time_slot: '10 AM' },
            { student_id: 8, day_of_week: 'TUE', time_slot: '11 AM' },
            { student_id: 8, day_of_week: 'TUE', time_slot: '12 PM' },
            { student_id: 8, day_of_week: 'THU', time_slot: '1 PM' },
            { student_id: 8, day_of_week: 'THU', time_slot: '2 PM' },
            { student_id: 8, day_of_week: 'THU', time_slot: '3 PM' },
            { student_id: 8, day_of_week: 'SAT', time_slot: '10 AM' },
            { student_id: 8, day_of_week: 'SAT', time_slot: '11 AM' },
            { student_id: 8, day_of_week: 'FRI', time_slot: '5 PM' },
            
            // GROUP 3 (students 9-12) - Common: WED 9-11 AM, FRI 2-4 PM
            // S9: 7 slots
            { student_id: 9, day_of_week: 'WED', time_slot: '9 AM' },
            { student_id: 9, day_of_week: 'WED', time_slot: '10 AM' },
            { student_id: 9, day_of_week: 'WED', time_slot: '11 AM' },
            { student_id: 9, day_of_week: 'FRI', time_slot: '2 PM' },
            { student_id: 9, day_of_week: 'FRI', time_slot: '3 PM' },
            { student_id: 9, day_of_week: 'FRI', time_slot: '4 PM' },
            { student_id: 9, day_of_week: 'MON', time_slot: '1 PM' },
            
            // S10: same common times
            { student_id: 10, day_of_week: 'WED', time_slot: '9 AM' },
            { student_id: 10, day_of_week: 'WED', time_slot: '10 AM' },
            { student_id: 10, day_of_week: 'WED', time_slot: '11 AM' },
            { student_id: 10, day_of_week: 'FRI', time_slot: '2 PM' },
            { student_id: 10, day_of_week: 'FRI', time_slot: '3 PM' },
            { student_id: 10, day_of_week: 'FRI', time_slot: '4 PM' },
            { student_id: 10, day_of_week: 'THU', time_slot: '9 AM' },
            
            // S11: same common times
            { student_id: 11, day_of_week: 'WED', time_slot: '9 AM' },
            { student_id: 11, day_of_week: 'WED', time_slot: '10 AM' },
            { student_id: 11, day_of_week: 'WED', time_slot: '11 AM' },
            { student_id: 11, day_of_week: 'FRI', time_slot: '2 PM' },
            { student_id: 11, day_of_week: 'FRI', time_slot: '3 PM' },
            { student_id: 11, day_of_week: 'FRI', time_slot: '4 PM' },
            { student_id: 11, day_of_week: 'TUE', time_slot: '1 PM' },
            
            // S12: same common times
            { student_id: 12, day_of_week: 'WED', time_slot: '9 AM' },
            { student_id: 12, day_of_week: 'WED', time_slot: '10 AM' },
            { student_id: 12, day_of_week: 'WED', time_slot: '11 AM' },
            { student_id: 12, day_of_week: 'FRI', time_slot: '2 PM' },
            { student_id: 12, day_of_week: 'FRI', time_slot: '3 PM' },
            { student_id: 12, day_of_week: 'FRI', time_slot: '4 PM' },
            { student_id: 12, day_of_week: 'SUN', time_slot: '3 PM' },
            
            // GROUP 4 (students 13-16) - Common: MON 2-4 PM, THU 9-10 AM
            // S13: 7 slots
            { student_id: 13, day_of_week: 'MON', time_slot: '2 PM' },
            { student_id: 13, day_of_week: 'MON', time_slot: '3 PM' },
            { student_id: 13, day_of_week: 'MON', time_slot: '4 PM' },
            { student_id: 13, day_of_week: 'THU', time_slot: '9 AM' },
            { student_id: 13, day_of_week: 'THU', time_slot: '10 AM' },
            { student_id: 13, day_of_week: 'WED', time_slot: '1 PM' },
            { student_id: 13, day_of_week: 'FRI', time_slot: '9 AM' },
            
            // S14: same common times
            { student_id: 14, day_of_week: 'MON', time_slot: '2 PM' },
            { student_id: 14, day_of_week: 'MON', time_slot: '3 PM' },
            { student_id: 14, day_of_week: 'MON', time_slot: '4 PM' },
            { student_id: 14, day_of_week: 'THU', time_slot: '9 AM' },
            { student_id: 14, day_of_week: 'THU', time_slot: '10 AM' },
            { student_id: 14, day_of_week: 'TUE', time_slot: '1 PM' },
            { student_id: 14, day_of_week: 'SUN', time_slot: '11 AM' },
            
            // S15: same common times
            { student_id: 15, day_of_week: 'MON', time_slot: '2 PM' },
            { student_id: 15, day_of_week: 'MON', time_slot: '3 PM' },
            { student_id: 15, day_of_week: 'MON', time_slot: '4 PM' },
            { student_id: 15, day_of_week: 'THU', time_slot: '9 AM' },
            { student_id: 15, day_of_week: 'THU', time_slot: '10 AM' },
            { student_id: 15, day_of_week: 'WED', time_slot: '3 PM' },
            { student_id: 15, day_of_week: 'FRI', time_slot: '11 AM' },
            
            // S16: same common times
            { student_id: 16, day_of_week: 'MON', time_slot: '2 PM' },
            { student_id: 16, day_of_week: 'MON', time_slot: '3 PM' },
            { student_id: 16, day_of_week: 'MON', time_slot: '4 PM' },
            { student_id: 16, day_of_week: 'THU', time_slot: '9 AM' },
            { student_id: 16, day_of_week: 'THU', time_slot: '10 AM' },
            { student_id: 16, day_of_week: 'TUE', time_slot: '2 PM' },
            
            // GROUP 5 (students 17-20) - Common: TUE 4-6 PM, FRI 10-11 AM
            // S17: 7 slots
            { student_id: 17, day_of_week: 'TUE', time_slot: '4 PM' },
            { student_id: 17, day_of_week: 'TUE', time_slot: '5 PM' },
            { student_id: 17, day_of_week: 'TUE', time_slot: '6 PM' },
            { student_id: 17, day_of_week: 'FRI', time_slot: '10 AM' },
            { student_id: 17, day_of_week: 'FRI', time_slot: '11 AM' },
            { student_id: 17, day_of_week: 'MON', time_slot: '11 AM' },
            { student_id: 17, day_of_week: 'WED', time_slot: '4 PM' },
            
            // S18: same common times
            { student_id: 18, day_of_week: 'TUE', time_slot: '4 PM' },
            { student_id: 18, day_of_week: 'TUE', time_slot: '5 PM' },
            { student_id: 18, day_of_week: 'TUE', time_slot: '6 PM' },
            { student_id: 18, day_of_week: 'FRI', time_slot: '10 AM' },
            { student_id: 18, day_of_week: 'FRI', time_slot: '11 AM' },
            { student_id: 18, day_of_week: 'THU', time_slot: '3 PM' },
            { student_id: 18, day_of_week: 'SAT', time_slot: '9 AM' },
            
            // S19: same common times
            { student_id: 19, day_of_week: 'TUE', time_slot: '4 PM' },
            { student_id: 19, day_of_week: 'TUE', time_slot: '5 PM' },
            { student_id: 19, day_of_week: 'TUE', time_slot: '6 PM' },
            { student_id: 19, day_of_week: 'FRI', time_slot: '10 AM' },
            { student_id: 19, day_of_week: 'FRI', time_slot: '11 AM' },
            { student_id: 19, day_of_week: 'MON', time_slot: '3 PM' },
            { student_id: 19, day_of_week: 'WED', time_slot: '10 AM' },
            
            // S20: same common times
            { student_id: 20, day_of_week: 'TUE', time_slot: '4 PM' },
            { student_id: 20, day_of_week: 'TUE', time_slot: '5 PM' },
            { student_id: 20, day_of_week: 'TUE', time_slot: '6 PM' },
            { student_id: 20, day_of_week: 'FRI', time_slot: '10 AM' },
            { student_id: 20, day_of_week: 'FRI', time_slot: '11 AM' },
            { student_id: 20, day_of_week: 'THU', time_slot: '11 AM' },
            
            // GROUP 6 (students 21-24) - Common: WED 6-8 PM, SAT 1-3 PM
            // S21: 7 slots
            { student_id: 21, day_of_week: 'WED', time_slot: '6 PM' },
            { student_id: 21, day_of_week: 'WED', time_slot: '7 PM' },
            { student_id: 21, day_of_week: 'WED', time_slot: '8 PM' },
            { student_id: 21, day_of_week: 'SAT', time_slot: '1 PM' },
            { student_id: 21, day_of_week: 'SAT', time_slot: '2 PM' },
            { student_id: 21, day_of_week: 'SAT', time_slot: '3 PM' },
            { student_id: 21, day_of_week: 'MON', time_slot: '4 PM' },
            
            // S22: same common times
            { student_id: 22, day_of_week: 'WED', time_slot: '6 PM' },
            { student_id: 22, day_of_week: 'WED', time_slot: '7 PM' },
            { student_id: 22, day_of_week: 'WED', time_slot: '8 PM' },
            { student_id: 22, day_of_week: 'SAT', time_slot: '1 PM' },
            { student_id: 22, day_of_week: 'SAT', time_slot: '2 PM' },
            { student_id: 22, day_of_week: 'SAT', time_slot: '3 PM' },
            { student_id: 22, day_of_week: 'TUE', time_slot: '11 AM' },
            
            // S23: same common times
            { student_id: 23, day_of_week: 'WED', time_slot: '6 PM' },
            { student_id: 23, day_of_week: 'WED', time_slot: '7 PM' },
            { student_id: 23, day_of_week: 'WED', time_slot: '8 PM' },
            { student_id: 23, day_of_week: 'SAT', time_slot: '1 PM' },
            { student_id: 23, day_of_week: 'SAT', time_slot: '2 PM' },
            { student_id: 23, day_of_week: 'SAT', time_slot: '3 PM' },
            { student_id: 23, day_of_week: 'MON', time_slot: '11 AM' },
            
            // S24: same common times
            { student_id: 24, day_of_week: 'WED', time_slot: '6 PM' },
            { student_id: 24, day_of_week: 'WED', time_slot: '7 PM' },
            { student_id: 24, day_of_week: 'WED', time_slot: '8 PM' },
            { student_id: 24, day_of_week: 'SAT', time_slot: '1 PM' },
            { student_id: 24, day_of_week: 'SAT', time_slot: '2 PM' },
            { student_id: 24, day_of_week: 'SAT', time_slot: '3 PM' },
            { student_id: 24, day_of_week: 'TUE', time_slot: '3 PM' },
        ];

        for (const availability of availabilityDataSurvey1) {
            await connection.query(
                `INSERT INTO availability (student_id, day_of_week, time_slot) 
         VALUES (?, ?, ?)`,
                [availability.student_id, availability.day_of_week, availability.time_slot]
            );
        }
        console.log(`✓ ${availabilityDataSurvey1.length} availability slots added for survey 1\n`);

        // Availability data for survey 2 students
        const availabilityDataSurvey2 = [
            // S01 - 7 slots (encrypted_s2_m1) -> ID 25
            { student_id: 25, day_of_week: 'MON', time_slot: '9 AM' },
            { student_id: 25, day_of_week: 'MON', time_slot: '1 PM' },
            { student_id: 25, day_of_week: 'TUE', time_slot: '10 AM' },
            { student_id: 25, day_of_week: 'TUE', time_slot: '2 PM' },
            { student_id: 25, day_of_week: 'WED', time_slot: '9 AM' },
            { student_id: 25, day_of_week: 'MON', time_slot: '4 PM' },
            { student_id: 25, day_of_week: 'TUE', time_slot: '8 AM' },
            // S02 - 3 slots (encrypted_s2_m2) -> ID 26
            { student_id: 26, day_of_week: 'WED', time_slot: '9 AM' },
            { student_id: 26, day_of_week: 'THU', time_slot: '2 PM' },
            { student_id: 26, day_of_week: 'SAT', time_slot: '9 AM' },
            // S03 - 5 slots (encrypted_s2_m3) -> ID 27
            { student_id: 27, day_of_week: 'MON', time_slot: '9 AM' },
            { student_id: 27, day_of_week: 'TUE', time_slot: '10 AM' },
            { student_id: 27, day_of_week: 'THU', time_slot: '11 AM' },
            { student_id: 27, day_of_week: 'MON', time_slot: '4 PM' },
            { student_id: 27, day_of_week: 'SAT', time_slot: '2 PM' },
            // S04 - 3 slots (encrypted_s2_m4) -> ID 28
            { student_id: 28, day_of_week: 'MON', time_slot: '9 AM' },
            { student_id: 28, day_of_week: 'WED', time_slot: '3 PM' },
            { student_id: 28, day_of_week: 'SAT', time_slot: '2 PM' },
            // S05 - 2 slots (encrypted_s2_m5) -> ID 29
            { student_id: 29, day_of_week: 'TUE', time_slot: '2 PM' },
            { student_id: 29, day_of_week: 'WED', time_slot: '5 PM' },
            // S06 - 5 slots (encrypted_s2_m6) -> ID 30
            { student_id: 30, day_of_week: 'MON', time_slot: '1 PM' },
            { student_id: 30, day_of_week: 'WED', time_slot: '9 AM' },
            { student_id: 30, day_of_week: 'FRI', time_slot: '10 AM' },
            { student_id: 30, day_of_week: 'TUE', time_slot: '8 AM' },
            { student_id: 30, day_of_week: 'SUN', time_slot: '10 AM' },
            // S07 - 3 slots (encrypted_s2_m7) -> ID 31
            { student_id: 31, day_of_week: 'TUE', time_slot: '10 AM' },
            { student_id: 31, day_of_week: 'FRI', time_slot: '1 PM' },
            { student_id: 31, day_of_week: 'SUN', time_slot: '10 AM' },
            // S08 - 7 slots (encrypted_s2_m8) -> ID 32
            { student_id: 32, day_of_week: 'MON', time_slot: '1 PM' },
            { student_id: 32, day_of_week: 'TUE', time_slot: '10 AM' },
            { student_id: 32, day_of_week: 'WED', time_slot: '9 AM' },
            { student_id: 32, day_of_week: 'THU', time_slot: '11 AM' },
            { student_id: 32, day_of_week: 'FRI', time_slot: '10 AM' },
            { student_id: 32, day_of_week: 'TUE', time_slot: '5 PM' },
            { student_id: 32, day_of_week: 'WED', time_slot: '12 PM' },
            // S09 - 2 slots (encrypted_s2_f1) -> ID 33
            { student_id: 33, day_of_week: 'THU', time_slot: '11 AM' },
            { student_id: 33, day_of_week: 'THU', time_slot: '8 AM' },
            // S10 - 5 slots (encrypted_s2_f2) -> ID 34
            { student_id: 34, day_of_week: 'TUE', time_slot: '2 PM' },
            { student_id: 34, day_of_week: 'WED', time_slot: '3 PM' },
            { student_id: 34, day_of_week: 'FRI', time_slot: '1 PM' },
            { student_id: 34, day_of_week: 'TUE', time_slot: '5 PM' },
            { student_id: 34, day_of_week: 'SUN', time_slot: '2 PM' },
            // S11 - 3 slots (encrypted_s2_f3) -> ID 35
            { student_id: 35, day_of_week: 'MON', time_slot: '1 PM' },
            { student_id: 35, day_of_week: 'THU', time_slot: '11 AM' },
            { student_id: 35, day_of_week: 'SUN', time_slot: '2 PM' },
            // S12 - 5 slots (encrypted_s2_f4) -> ID 36
            { student_id: 36, day_of_week: 'MON', time_slot: '9 AM' },
            { student_id: 36, day_of_week: 'THU', time_slot: '2 PM' },
            { student_id: 36, day_of_week: 'SAT', time_slot: '11 AM' },
            { student_id: 36, day_of_week: 'WED', time_slot: '12 PM' },
            { student_id: 36, day_of_week: 'WED', time_slot: '5 PM' },
            // S13 - 7 slots (encrypted_s2_f5) -> ID 37
            { student_id: 37, day_of_week: 'MON', time_slot: '9 AM' },
            { student_id: 37, day_of_week: 'TUE', time_slot: '2 PM' },
            { student_id: 37, day_of_week: 'WED', time_slot: '3 PM' },
            { student_id: 37, day_of_week: 'THU', time_slot: '2 PM' },
            { student_id: 37, day_of_week: 'FRI', time_slot: '1 PM' },
            { student_id: 37, day_of_week: 'WED', time_slot: '5 PM' },
            { student_id: 37, day_of_week: 'THU', time_slot: '8 AM' },
            // S14 - 3 slots (encrypted_s2_f6) -> ID 38
            { student_id: 38, day_of_week: 'TUE', time_slot: '2 PM' },
            { student_id: 38, day_of_week: 'FRI', time_slot: '10 AM' },
            { student_id: 38, day_of_week: 'MON', time_slot: '4 PM' },
            // S15 - 2 slots (encrypted_s2_f7) -> ID 39
            { student_id: 39, day_of_week: 'MON', time_slot: '1 PM' },
            { student_id: 39, day_of_week: 'THU', time_slot: '4 PM' },
            // S16 - 7 slots (encrypted_s2_f8) -> ID 40
            { student_id: 40, day_of_week: 'TUE', time_slot: '10 AM' },
            { student_id: 40, day_of_week: 'WED', time_slot: '9 AM' },
            { student_id: 40, day_of_week: 'THU', time_slot: '11 AM' },
            { student_id: 40, day_of_week: 'FRI', time_slot: '10 AM' },
            { student_id: 40, day_of_week: 'SAT', time_slot: '11 AM' },
            { student_id: 40, day_of_week: 'THU', time_slot: '4 PM' },
            { student_id: 40, day_of_week: 'FRI', time_slot: '8 AM' },
            // S17 - 3 slots (encrypted_s2_f9) -> ID 41
            { student_id: 41, day_of_week: 'WED', time_slot: '3 PM' },
            { student_id: 41, day_of_week: 'SAT', time_slot: '11 AM' },
            { student_id: 41, day_of_week: 'TUE', time_slot: '8 AM' },
            // S18 - 5 slots (encrypted_s2_f10) -> ID 42
            { student_id: 42, day_of_week: 'TUE', time_slot: '10 AM' },
            { student_id: 42, day_of_week: 'THU', time_slot: '11 AM' },
            { student_id: 42, day_of_week: 'FRI', time_slot: '10 AM' },
            { student_id: 42, day_of_week: 'THU', time_slot: '8 AM' },
            { student_id: 42, day_of_week: 'THU', time_slot: '4 PM' },
            // S19 - 7 slots (encrypted_s2_f11) -> ID 43
            { student_id: 43, day_of_week: 'MON', time_slot: '9 AM' },
            { student_id: 43, day_of_week: 'MON', time_slot: '1 PM' },
            { student_id: 43, day_of_week: 'TUE', time_slot: '2 PM' },
            { student_id: 43, day_of_week: 'WED', time_slot: '3 PM' },
            { student_id: 43, day_of_week: 'THU', time_slot: '2 PM' },
            { student_id: 43, day_of_week: 'FRI', time_slot: '4 PM' },
            { student_id: 43, day_of_week: 'SAT', time_slot: '9 AM' },
            // S20 - 2 slots (encrypted_s2_f12) -> ID 44
            { student_id: 44, day_of_week: 'FRI', time_slot: '10 AM' },
            { student_id: 44, day_of_week: 'FRI', time_slot: '8 AM' },
            // S21 - 3 slots (encrypted_s2_f13) -> ID 45
            { student_id: 45, day_of_week: 'MON', time_slot: '9 AM' },
            { student_id: 45, day_of_week: 'THU', time_slot: '2 PM' },
            { student_id: 45, day_of_week: 'TUE', time_slot: '5 PM' },
            // S22 - 5 slots (encrypted_s2_o1) -> ID 46
            { student_id: 46, day_of_week: 'MON', time_slot: '1 PM' },
            { student_id: 46, day_of_week: 'TUE', time_slot: '2 PM' },
            { student_id: 46, day_of_week: 'FRI', time_slot: '1 PM' },
            { student_id: 46, day_of_week: 'FRI', time_slot: '8 AM' },
            { student_id: 46, day_of_week: 'FRI', time_slot: '4 PM' },
            // S23 - 3 slots (encrypted_s2_o2) -> ID 47
            { student_id: 47, day_of_week: 'WED', time_slot: '9 AM' },
            { student_id: 47, day_of_week: 'FRI', time_slot: '1 PM' },
            { student_id: 47, day_of_week: 'WED', time_slot: '12 PM' },
        ];

        for (const availability of availabilityDataSurvey2) {
            await connection.query(
                `INSERT INTO availability (student_id, day_of_week, time_slot) 
         VALUES (?, ?, ?)`,
                [availability.student_id, availability.day_of_week, availability.time_slot]
            );
        }
        console.log(`✓ ${availabilityDataSurvey2.length} availability slots added for survey 2\n`);

        // Availability data for survey 3 students (19 students)
        const availabilityDataSurvey3 = [
            // S01 - 5 slots (encrypted_s3_m1) -> ID 48
            { student_id: 48, day_of_week: 'MON', time_slot: '9 AM' },
            { student_id: 48, day_of_week: 'TUE', time_slot: '2 PM' },
            { student_id: 48, day_of_week: 'WED', time_slot: '9 AM' },
            { student_id: 48, day_of_week: 'THU', time_slot: '11 AM' },
            { student_id: 48, day_of_week: 'FRI', time_slot: '1 PM' },
            // S02 - 4 slots (encrypted_s3_m2) -> ID 49
            { student_id: 49, day_of_week: 'TUE', time_slot: '10 AM' },
            { student_id: 49, day_of_week: 'WED', time_slot: '3 PM' },
            { student_id: 49, day_of_week: 'THU', time_slot: '2 PM' },
            { student_id: 49, day_of_week: 'FRI', time_slot: '10 AM' },
            // S03 - 6 slots (encrypted_s3_m3) -> ID 50
            { student_id: 50, day_of_week: 'MON', time_slot: '1 PM' },
            { student_id: 50, day_of_week: 'TUE', time_slot: '9 AM' },
            { student_id: 50, day_of_week: 'WED', time_slot: '2 PM' },
            { student_id: 50, day_of_week: 'THU', time_slot: '9 AM' },
            { student_id: 50, day_of_week: 'FRI', time_slot: '2 PM' },
            { student_id: 50, day_of_week: 'SAT', time_slot: '10 AM' },
            // S04 - 5 slots (encrypted_s3_m4) -> ID 51
            { student_id: 51, day_of_week: 'MON', time_slot: '10 AM' },
            { student_id: 51, day_of_week: 'WED', time_slot: '11 AM' },
            { student_id: 51, day_of_week: 'THU', time_slot: '1 PM' },
            { student_id: 51, day_of_week: 'FRI', time_slot: '9 AM' },
            { student_id: 51, day_of_week: 'SAT', time_slot: '1 PM' },
            // S05 - 4 slots (encrypted_s3_m5) -> ID 52
            { student_id: 52, day_of_week: 'TUE', time_slot: '1 PM' },
            { student_id: 52, day_of_week: 'WED', time_slot: '10 AM' },
            { student_id: 52, day_of_week: 'THU', time_slot: '3 PM' },
            { student_id: 52, day_of_week: 'FRI', time_slot: '4 PM' },
            // S06 - 6 slots (encrypted_s3_m6) -> ID 53
            { student_id: 53, day_of_week: 'MON', time_slot: '11 AM' },
            { student_id: 53, day_of_week: 'TUE', time_slot: '3 PM' },
            { student_id: 53, day_of_week: 'WED', time_slot: '1 PM' },
            { student_id: 53, day_of_week: 'THU', time_slot: '10 AM' },
            { student_id: 53, day_of_week: 'FRI', time_slot: '3 PM' },
            { student_id: 53, day_of_week: 'SUN', time_slot: '2 PM' },
            // S07 - 5 slots (encrypted_s3_m7) -> ID 54
            { student_id: 54, day_of_week: 'TUE', time_slot: '11 AM' },
            { student_id: 54, day_of_week: 'WED', time_slot: '2 PM' },
            { student_id: 54, day_of_week: 'THU', time_slot: '4 PM' },
            { student_id: 54, day_of_week: 'FRI', time_slot: '11 AM' },
            { student_id: 54, day_of_week: 'SAT', time_slot: '9 AM' },
            // S08 - 4 slots (encrypted_s3_m8) -> ID 55
            { student_id: 55, day_of_week: 'MON', time_slot: '2 PM' },
            { student_id: 55, day_of_week: 'WED', time_slot: '12 PM' },
            { student_id: 55, day_of_week: 'THU', time_slot: '11 AM' },
            { student_id: 55, day_of_week: 'FRI', time_slot: '2 PM' },
            // S09 - 6 slots (encrypted_s3_m9) -> ID 56
            { student_id: 56, day_of_week: 'TUE', time_slot: '2 PM' },
            { student_id: 56, day_of_week: 'WED', time_slot: '9 AM' },
            { student_id: 56, day_of_week: 'THU', time_slot: '2 PM' },
            { student_id: 56, day_of_week: 'FRI', time_slot: '10 AM' },
            { student_id: 56, day_of_week: 'SAT', time_slot: '2 PM' },
            { student_id: 56, day_of_week: 'SUN', time_slot: '11 AM' },
            // S10 - 5 slots (encrypted_s3_f1) -> ID 57
            { student_id: 57, day_of_week: 'MON', time_slot: '9 AM' },
            { student_id: 57, day_of_week: 'TUE', time_slot: '10 AM' },
            { student_id: 57, day_of_week: 'WED', time_slot: '3 PM' },
            { student_id: 57, day_of_week: 'THU', time_slot: '1 PM' },
            { student_id: 57, day_of_week: 'FRI', time_slot: '1 PM' },
            // S11 - 4 slots (encrypted_s3_f2) -> ID 58
            { student_id: 58, day_of_week: 'TUE', time_slot: '9 AM' },
            { student_id: 58, day_of_week: 'WED', time_slot: '4 PM' },
            { student_id: 58, day_of_week: 'THU', time_slot: '9 AM' },
            { student_id: 58, day_of_week: 'SAT', time_slot: '11 AM' },
            // S12 - 6 slots (encrypted_s3_f3) -> ID 59
            { student_id: 59, day_of_week: 'MON', time_slot: '12 PM' },
            { student_id: 59, day_of_week: 'TUE', time_slot: '1 PM' },
            { student_id: 59, day_of_week: 'WED', time_slot: '10 AM' },
            { student_id: 59, day_of_week: 'THU', time_slot: '3 PM' },
            { student_id: 59, day_of_week: 'FRI', time_slot: '9 AM' },
            { student_id: 59, day_of_week: 'SUN', time_slot: '1 PM' },
            // S13 - 5 slots (encrypted_s3_f4) -> ID 60
            { student_id: 60, day_of_week: 'TUE', time_slot: '3 PM' },
            { student_id: 60, day_of_week: 'WED', time_slot: '1 PM' },
            { student_id: 60, day_of_week: 'THU', time_slot: '10 AM' },
            { student_id: 60, day_of_week: 'FRI', time_slot: '4 PM' },
            { student_id: 60, day_of_week: 'SAT', time_slot: '3 PM' },
            // S14 - 4 slots (encrypted_s3_f5) -> ID 61
            { student_id: 61, day_of_week: 'MON', time_slot: '3 PM' },
            { student_id: 61, day_of_week: 'WED', time_slot: '2 PM' },
            { student_id: 61, day_of_week: 'THU', time_slot: '12 PM' },
            { student_id: 61, day_of_week: 'FRI', time_slot: '11 AM' },
            // S15 - 6 slots (encrypted_s3_f6) -> ID 62
            { student_id: 62, day_of_week: 'TUE', time_slot: '11 AM' },
            { student_id: 62, day_of_week: 'WED', time_slot: '11 AM' },
            { student_id: 62, day_of_week: 'THU', time_slot: '2 PM' },
            { student_id: 62, day_of_week: 'FRI', time_slot: '2 PM' },
            { student_id: 62, day_of_week: 'SAT', time_slot: '10 AM' },
            { student_id: 62, day_of_week: 'SUN', time_slot: '9 AM' },
            // S16 - 5 slots (encrypted_s3_f7) -> ID 63
            { student_id: 63, day_of_week: 'MON', time_slot: '4 PM' },
            { student_id: 63, day_of_week: 'TUE', time_slot: '2 PM' },
            { student_id: 63, day_of_week: 'WED', time_slot: '9 AM' },
            { student_id: 63, day_of_week: 'FRI', time_slot: '10 AM' },
            { student_id: 63, day_of_week: 'SAT', time_slot: '1 PM' },
            // S17 - 4 slots (encrypted_s3_f8) -> ID 64
            { student_id: 64, day_of_week: 'TUE', time_slot: '12 PM' },
            { student_id: 64, day_of_week: 'THU', time_slot: '4 PM' },
            { student_id: 64, day_of_week: 'FRI', time_slot: '3 PM' },
            { student_id: 64, day_of_week: 'SUN', time_slot: '10 AM' },
            // S18 - 6 slots (encrypted_s3_f9) -> ID 65
            { student_id: 65, day_of_week: 'MON', time_slot: '8 AM' },
            { student_id: 65, day_of_week: 'TUE', time_slot: '4 PM' },
            { student_id: 65, day_of_week: 'WED', time_slot: '3 PM' },
            { student_id: 65, day_of_week: 'THU', time_slot: '9 AM' },
            { student_id: 65, day_of_week: 'FRI', time_slot: '12 PM' },
            { student_id: 65, day_of_week: 'SAT', time_slot: '4 PM' },
            // S19 - 5 slots (encrypted_s3_o1) -> ID 66
            { student_id: 66, day_of_week: 'TUE', time_slot: '8 AM' },
            { student_id: 66, day_of_week: 'WED', time_slot: '5 PM' },
            { student_id: 66, day_of_week: 'THU', time_slot: '11 AM' },
            { student_id: 66, day_of_week: 'FRI', time_slot: '8 AM' },
            { student_id: 66, day_of_week: 'SUN', time_slot: '3 PM' },
        ];

        for (const availability of availabilityDataSurvey3) {
            await connection.query(
                `INSERT INTO availability (student_id, day_of_week, time_slot) 
         VALUES (?, ?, ?)`,
                [availability.student_id, availability.day_of_week, availability.time_slot]
            );
        }
        console.log(`✓ ${availabilityDataSurvey3.length} availability slots added for survey 3\n`);

        console.log('✅ Database seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log('   - Survey 1 (Female Only): 24 students');
        console.log('   - Survey 2 (Max Group 4): 23 students');
        console.log('   - Survey 3 (Min Group 2): 19 students');
        console.log('   - Total: 66 students seeded');
        console.log(`   - Survey 1 availability slots: ${availabilityDataSurvey1.length}`);
        console.log(`   - Survey 2 availability slots: ${availabilityDataSurvey2.length}`);
        console.log(`   - Survey 3 availability slots: ${availabilityDataSurvey3.length}`);
        console.log(`   - Total availability slots: ${availabilityDataSurvey1.length + availabilityDataSurvey2.length + availabilityDataSurvey3.length}\n`);

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
