import { pool } from '../db.js';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config({ path: '.env' });

/**
 * Seed script to populate the database with test data.
 * Creates four survey configurations with different constraints:
 * 1. Class with only 1 female
 * 2. Class with max group size 4 and class size 23
 * 3. Class with min group size 2 and class size 19
 * 4. Class with max group size 3 and class size 20
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

        // ===== SURVEY CONFIGURATION 4: Max Group Size 3, Class Size 20 =====
        const surveyId4 = 'SURVEY-MAX-GROUP-3-001';
        console.log(`📝 Creating Survey Configuration 4: ${surveyId4}`);

        await connection.query(
            `INSERT INTO survey_configurations (id, course_name, class_size, team_limit, limit_type, use_gpa, prev_course, encryption_salt, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                surveyId4,
                'Database Design',
                20,
                3,
                'max',
                false,
                null,
                'salt_survey_4',
                'open',
            ]
        );
        console.log('✓ Survey configuration 4 created');

        // Insert 20 students for survey 4
        const survey4Students = [
            { name: 'encrypted_s4_m1', iv: 'iv_s4_m1', gender: 'Male', gpa: 3.4, commitment: 4 },
            { name: 'encrypted_s4_m2', iv: 'iv_s4_m2', gender: 'Male', gpa: 2.8, commitment: 3 },
            { name: 'encrypted_s4_m3', iv: 'iv_s4_m3', gender: 'Male', gpa: 3.7, commitment: 2 },
            { name: 'encrypted_s4_m4', iv: 'iv_s4_m4', gender: 'Male', gpa: 3.1, commitment: 1 },
            { name: 'encrypted_s4_m5', iv: 'iv_s4_m5', gender: 'Male', gpa: 2.9, commitment: 4 },
            { name: 'encrypted_s4_m6', iv: 'iv_s4_m6', gender: 'Male', gpa: 3.5, commitment: 3 },
            { name: 'encrypted_s4_m7', iv: 'iv_s4_m7', gender: 'Male', gpa: 2.6, commitment: 2 },
            { name: 'encrypted_s4_f1', iv: 'iv_s4_f1', gender: 'Female', gpa: 3.8, commitment: 1 },
            { name: 'encrypted_s4_f2', iv: 'iv_s4_f2', gender: 'Female', gpa: 3.2, commitment: 4 },
            { name: 'encrypted_s4_f3', iv: 'iv_s4_f3', gender: 'Female', gpa: 2.7, commitment: 3 },
            { name: 'encrypted_s4_f4', iv: 'iv_s4_f4', gender: 'Female', gpa: 3.9, commitment: 2 },
            { name: 'encrypted_s4_f5', iv: 'iv_s4_f5', gender: 'Female', gpa: 3.0, commitment: 1 },
            { name: 'encrypted_s4_f6', iv: 'iv_s4_f6', gender: 'Female', gpa: 3.3, commitment: 4 },
            { name: 'encrypted_s4_f7', iv: 'iv_s4_f7', gender: 'Female', gpa: 2.4, commitment: 3 },
            { name: 'encrypted_s4_o1', iv: 'iv_s4_o1', gender: 'Other', gpa: 3.6, commitment: 2 },
            { name: 'encrypted_s4_o2', iv: 'iv_s4_o2', gender: 'Other', gpa: 2.5, commitment: 1 },
            { name: 'encrypted_s4_o3', iv: 'iv_s4_o3', gender: 'Other', gpa: 3.4, commitment: 4 },
            { name: 'encrypted_s4_o4', iv: 'iv_s4_o4', gender: 'Other', gpa: 3.1, commitment: 3 },
            { name: 'encrypted_s4_o5', iv: 'iv_s4_o5', gender: 'Other', gpa: 2.8, commitment: 2 },
            { name: 'encrypted_s4_o6', iv: 'iv_s4_o6', gender: 'Other', gpa: 3.7, commitment: 1 },
        ];

        for (const student of survey4Students) {
            await connection.query(
                `INSERT INTO student_survey_entries (encrypted_name, iv, gender, gpa, commitment, survey_id) 
       VALUES (?, ?, ?, ?, ?, ?)`,
                [student.name, student.iv, student.gender, student.gpa, student.commitment, surveyId4]
            );
        }
        console.log(`✓ ${survey4Students.length} students added to survey 4\n`);

        // Availability data for survey 4 students (20 students)
        const availabilityDataSurvey4 = [
            // GROUP 1 (students 1-3) - Common: MON 7-9 PM, THU 6-8 PM
            { student_id: 67, day_of_week: 'MON', time_slot: '7 PM' },
            { student_id: 67, day_of_week: 'MON', time_slot: '8 PM' },
            { student_id: 67, day_of_week: 'MON', time_slot: '9 PM' },
            { student_id: 67, day_of_week: 'THU', time_slot: '6 PM' },
            { student_id: 67, day_of_week: 'THU', time_slot: '7 PM' },
            { student_id: 67, day_of_week: 'THU', time_slot: '8 PM' },
            { student_id: 67, day_of_week: 'SAT', time_slot: '12 PM' },

            { student_id: 68, day_of_week: 'MON', time_slot: '7 PM' },
            { student_id: 68, day_of_week: 'MON', time_slot: '8 PM' },
            { student_id: 68, day_of_week: 'MON', time_slot: '9 PM' },
            { student_id: 68, day_of_week: 'THU', time_slot: '6 PM' },
            { student_id: 68, day_of_week: 'THU', time_slot: '7 PM' },
            { student_id: 68, day_of_week: 'THU', time_slot: '8 PM' },
            { student_id: 68, day_of_week: 'WED', time_slot: '4 PM' },

            { student_id: 69, day_of_week: 'MON', time_slot: '7 PM' },
            { student_id: 69, day_of_week: 'MON', time_slot: '8 PM' },
            { student_id: 69, day_of_week: 'MON', time_slot: '9 PM' },
            { student_id: 69, day_of_week: 'THU', time_slot: '6 PM' },
            { student_id: 69, day_of_week: 'THU', time_slot: '7 PM' },
            { student_id: 69, day_of_week: 'THU', time_slot: '8 PM' },
            { student_id: 69, day_of_week: 'FRI', time_slot: '6 PM' },

            // GROUP 2 (students 4-6) - Common: TUE 3-5 PM, SAT 2-4 PM
            { student_id: 70, day_of_week: 'TUE', time_slot: '3 PM' },
            { student_id: 70, day_of_week: 'TUE', time_slot: '4 PM' },
            { student_id: 70, day_of_week: 'TUE', time_slot: '5 PM' },
            { student_id: 70, day_of_week: 'SAT', time_slot: '2 PM' },
            { student_id: 70, day_of_week: 'SAT', time_slot: '3 PM' },
            { student_id: 70, day_of_week: 'SAT', time_slot: '4 PM' },
            { student_id: 70, day_of_week: 'SUN', time_slot: '11 AM' },

            { student_id: 71, day_of_week: 'TUE', time_slot: '3 PM' },
            { student_id: 71, day_of_week: 'TUE', time_slot: '4 PM' },
            { student_id: 71, day_of_week: 'TUE', time_slot: '5 PM' },
            { student_id: 71, day_of_week: 'SAT', time_slot: '2 PM' },
            { student_id: 71, day_of_week: 'SAT', time_slot: '3 PM' },
            { student_id: 71, day_of_week: 'SAT', time_slot: '4 PM' },
            { student_id: 71, day_of_week: 'MON', time_slot: '6 PM' },

            { student_id: 72, day_of_week: 'TUE', time_slot: '3 PM' },
            { student_id: 72, day_of_week: 'TUE', time_slot: '4 PM' },
            { student_id: 72, day_of_week: 'TUE', time_slot: '5 PM' },
            { student_id: 72, day_of_week: 'SAT', time_slot: '2 PM' },
            { student_id: 72, day_of_week: 'SAT', time_slot: '3 PM' },
            { student_id: 72, day_of_week: 'SAT', time_slot: '4 PM' },
            { student_id: 72, day_of_week: 'FRI', time_slot: '5 PM' },

            // GROUP 3 (students 7-9) - Common: WED 5-7 PM, FRI 11 AM-1 PM
            { student_id: 73, day_of_week: 'WED', time_slot: '5 PM' },
            { student_id: 73, day_of_week: 'WED', time_slot: '6 PM' },
            { student_id: 73, day_of_week: 'WED', time_slot: '7 PM' },
            { student_id: 73, day_of_week: 'FRI', time_slot: '11 AM' },
            { student_id: 73, day_of_week: 'FRI', time_slot: '12 PM' },
            { student_id: 73, day_of_week: 'FRI', time_slot: '1 PM' },
            { student_id: 73, day_of_week: 'TUE', time_slot: '7 PM' },

            { student_id: 74, day_of_week: 'WED', time_slot: '5 PM' },
            { student_id: 74, day_of_week: 'WED', time_slot: '6 PM' },
            { student_id: 74, day_of_week: 'WED', time_slot: '7 PM' },
            { student_id: 74, day_of_week: 'FRI', time_slot: '11 AM' },
            { student_id: 74, day_of_week: 'FRI', time_slot: '12 PM' },
            { student_id: 74, day_of_week: 'FRI', time_slot: '1 PM' },
            { student_id: 74, day_of_week: 'SUN', time_slot: '3 PM' },

            { student_id: 75, day_of_week: 'WED', time_slot: '5 PM' },
            { student_id: 75, day_of_week: 'WED', time_slot: '6 PM' },
            { student_id: 75, day_of_week: 'WED', time_slot: '7 PM' },
            { student_id: 75, day_of_week: 'FRI', time_slot: '11 AM' },
            { student_id: 75, day_of_week: 'FRI', time_slot: '12 PM' },
            { student_id: 75, day_of_week: 'FRI', time_slot: '1 PM' },
            { student_id: 75, day_of_week: 'THU', time_slot: '4 PM' },

            // GROUP 4 (students 10-12) - Common: TUE 1-3 PM, SUN 6-8 PM
            { student_id: 76, day_of_week: 'TUE', time_slot: '1 PM' },
            { student_id: 76, day_of_week: 'TUE', time_slot: '2 PM' },
            { student_id: 76, day_of_week: 'TUE', time_slot: '3 PM' },
            { student_id: 76, day_of_week: 'SUN', time_slot: '6 PM' },
            { student_id: 76, day_of_week: 'SUN', time_slot: '7 PM' },
            { student_id: 76, day_of_week: 'SUN', time_slot: '8 PM' },
            { student_id: 76, day_of_week: 'MON', time_slot: '2 PM' },

            { student_id: 77, day_of_week: 'TUE', time_slot: '1 PM' },
            { student_id: 77, day_of_week: 'TUE', time_slot: '2 PM' },
            { student_id: 77, day_of_week: 'TUE', time_slot: '3 PM' },
            { student_id: 77, day_of_week: 'SUN', time_slot: '6 PM' },
            { student_id: 77, day_of_week: 'SUN', time_slot: '7 PM' },
            { student_id: 77, day_of_week: 'SUN', time_slot: '8 PM' },
            { student_id: 77, day_of_week: 'WED', time_slot: '3 PM' },

            { student_id: 78, day_of_week: 'TUE', time_slot: '1 PM' },
            { student_id: 78, day_of_week: 'TUE', time_slot: '2 PM' },
            { student_id: 78, day_of_week: 'TUE', time_slot: '3 PM' },
            { student_id: 78, day_of_week: 'SUN', time_slot: '6 PM' },
            { student_id: 78, day_of_week: 'SUN', time_slot: '7 PM' },
            { student_id: 78, day_of_week: 'SUN', time_slot: '8 PM' },
            { student_id: 78, day_of_week: 'SAT', time_slot: '1 PM' },

            // GROUP 5 (students 13-15) - Common: THU 9-11 AM, SAT 6-8 PM
            { student_id: 79, day_of_week: 'THU', time_slot: '9 AM' },
            { student_id: 79, day_of_week: 'THU', time_slot: '10 AM' },
            { student_id: 79, day_of_week: 'THU', time_slot: '11 AM' },
            { student_id: 79, day_of_week: 'SAT', time_slot: '6 PM' },
            { student_id: 79, day_of_week: 'SAT', time_slot: '7 PM' },
            { student_id: 79, day_of_week: 'SAT', time_slot: '8 PM' },
            { student_id: 79, day_of_week: 'FRI', time_slot: '9 AM' },

            { student_id: 80, day_of_week: 'THU', time_slot: '9 AM' },
            { student_id: 80, day_of_week: 'THU', time_slot: '10 AM' },
            { student_id: 80, day_of_week: 'THU', time_slot: '11 AM' },
            { student_id: 80, day_of_week: 'SAT', time_slot: '6 PM' },
            { student_id: 80, day_of_week: 'SAT', time_slot: '7 PM' },
            { student_id: 80, day_of_week: 'SAT', time_slot: '8 PM' },
            { student_id: 80, day_of_week: 'MON', time_slot: '11 AM' },

            { student_id: 81, day_of_week: 'THU', time_slot: '9 AM' },
            { student_id: 81, day_of_week: 'THU', time_slot: '10 AM' },
            { student_id: 81, day_of_week: 'THU', time_slot: '11 AM' },
            { student_id: 81, day_of_week: 'SAT', time_slot: '6 PM' },
            { student_id: 81, day_of_week: 'SAT', time_slot: '7 PM' },
            { student_id: 81, day_of_week: 'SAT', time_slot: '8 PM' },
            { student_id: 81, day_of_week: 'TUE', time_slot: '8 PM' },

            // GROUP 6 (students 16-18) - Common: WED 10 AM-12 PM, FRI 4-6 PM
            { student_id: 82, day_of_week: 'WED', time_slot: '10 AM' },
            { student_id: 82, day_of_week: 'WED', time_slot: '11 AM' },
            { student_id: 82, day_of_week: 'WED', time_slot: '12 PM' },
            { student_id: 82, day_of_week: 'FRI', time_slot: '4 PM' },
            { student_id: 82, day_of_week: 'FRI', time_slot: '5 PM' },
            { student_id: 82, day_of_week: 'FRI', time_slot: '6 PM' },
            { student_id: 82, day_of_week: 'THU', time_slot: '3 PM' },

            { student_id: 83, day_of_week: 'WED', time_slot: '10 AM' },
            { student_id: 83, day_of_week: 'WED', time_slot: '11 AM' },
            { student_id: 83, day_of_week: 'WED', time_slot: '12 PM' },
            { student_id: 83, day_of_week: 'FRI', time_slot: '4 PM' },
            { student_id: 83, day_of_week: 'FRI', time_slot: '5 PM' },
            { student_id: 83, day_of_week: 'FRI', time_slot: '6 PM' },
            { student_id: 83, day_of_week: 'SUN', time_slot: '2 PM' },

            { student_id: 84, day_of_week: 'WED', time_slot: '10 AM' },
            { student_id: 84, day_of_week: 'WED', time_slot: '11 AM' },
            { student_id: 84, day_of_week: 'WED', time_slot: '12 PM' },
            { student_id: 84, day_of_week: 'FRI', time_slot: '4 PM' },
            { student_id: 84, day_of_week: 'FRI', time_slot: '5 PM' },
            { student_id: 84, day_of_week: 'FRI', time_slot: '6 PM' },
            { student_id: 84, day_of_week: 'MON', time_slot: '5 PM' },

            // GROUP 7 (students 19-20) - Common: MON 1-3 PM, THU 2-4 PM
            { student_id: 85, day_of_week: 'MON', time_slot: '1 PM' },
            { student_id: 85, day_of_week: 'MON', time_slot: '2 PM' },
            { student_id: 85, day_of_week: 'MON', time_slot: '3 PM' },
            { student_id: 85, day_of_week: 'THU', time_slot: '2 PM' },
            { student_id: 85, day_of_week: 'THU', time_slot: '3 PM' },
            { student_id: 85, day_of_week: 'THU', time_slot: '4 PM' },
            { student_id: 85, day_of_week: 'WED', time_slot: '8 PM' },

            { student_id: 86, day_of_week: 'MON', time_slot: '1 PM' },
            { student_id: 86, day_of_week: 'MON', time_slot: '2 PM' },
            { student_id: 86, day_of_week: 'MON', time_slot: '3 PM' },
            { student_id: 86, day_of_week: 'THU', time_slot: '2 PM' },
            { student_id: 86, day_of_week: 'THU', time_slot: '3 PM' },
            { student_id: 86, day_of_week: 'THU', time_slot: '4 PM' },
            { student_id: 86, day_of_week: 'SAT', time_slot: '9 AM' },
        ];

        for (const availability of availabilityDataSurvey4) {
            await connection.query(
                `INSERT INTO availability (student_id, day_of_week, time_slot) 
         VALUES (?, ?, ?)`,
                [availability.student_id, availability.day_of_week, availability.time_slot]
            );
        }
        console.log(`✓ ${availabilityDataSurvey4.length} availability slots added for survey 4\n`);

        // ===== SURVEY CONFIGURATION 5: Group Demo - 9 Groups (32 students) =====
        const surveyId5 = 'SURVEY-GROUP-DEMO-001';
        const survey5DecryptionKey = 'salt_survey_5_123456789012345678'; // 32 chars for AES-256
        console.log(`📝 Creating Survey Configuration 5: ${surveyId5}`);

        await connection.query(
            `INSERT INTO survey_configurations (id, course_name, class_size, team_limit, limit_type, use_gpa, prev_course, encryption_salt, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                surveyId5,
                'Group Formation Demo',
                32,
                4,
                'max',
                true,
                null,
                survey5DecryptionKey,
                'open',
            ]
        );
        console.log('✓ Survey configuration 5 created');
        console.log(`🔐 Group Formation Demo decryption key: ${survey5DecryptionKey}\n`);

        // Insert 32 students (9 groups demo) for survey 5
        const survey5Students = [
            // GROUP 1
            { name: 'Student 1', iv: 'iv_g1_s1', gender: 'Female', gpa: 3.90, commitment: 4 },
            { name: 'Student 2', iv: 'iv_g1_s2', gender: 'Male', gpa: 4.00, commitment: 4 },
            { name: 'Student 3', iv: 'iv_g1_s3', gender: 'Male', gpa: 4.00, commitment: 4 },
            { name: 'Student 4', iv: 'iv_g1_s4', gender: 'Male', gpa: 3.20, commitment: 4 },
            // GROUP 2
            { name: 'Student 5', iv: 'iv_g2_s5', gender: 'Male', gpa: 4.00, commitment: 4 },
            { name: 'Student 6', iv: 'iv_g2_s6', gender: 'Male', gpa: 3.70, commitment: 4 },
            { name: 'Student 7', iv: 'iv_g2_s7', gender: 'Male', gpa: 4.00, commitment: 4 },
            { name: 'Student 8', iv: 'iv_g2_s8', gender: 'Female', gpa: 3.60, commitment: 4 },
            // GROUP 3
            { name: 'Student 9', iv: 'iv_g3_s9', gender: 'Male', gpa: 2.80, commitment: 4 },
            { name: 'Student 10', iv: 'iv_g3_s10', gender: 'Other', gpa: 3.90, commitment: 4 },
            { name: 'Student 11', iv: 'iv_g3_s11', gender: 'Female', gpa: 3.80, commitment: 4 },
            { name: 'Student 12', iv: 'iv_g3_s12', gender: 'Female', gpa: 3.90, commitment: 4 },
            // GROUP 4
            { name: 'Student 13', iv: 'iv_g4_s13', gender: 'Male', gpa: 3.80, commitment: 4 },
            { name: 'Student 14', iv: 'iv_g4_s14', gender: 'Female', gpa: 3.30, commitment: 4 },
            { name: 'Student 15', iv: 'iv_g4_s15', gender: 'Male', gpa: 4.00, commitment: 4 },
            { name: 'Student 16', iv: 'iv_g4_s16', gender: 'Male', gpa: 3.80, commitment: 4 },
            // GROUP 5
            { name: 'Student 17', iv: 'iv_g5_s17', gender: 'Male', gpa: 4.00, commitment: 4 },
            { name: 'Student 18', iv: 'iv_g5_s18', gender: 'Male', gpa: 4.00, commitment: 4 },
            { name: 'Student 19', iv: 'iv_g5_s19', gender: 'Male', gpa: 4.00, commitment: 4 },
            { name: 'Student 20', iv: 'iv_g5_s20', gender: 'Male', gpa: 4.00, commitment: 4 },
            // GROUP 6
            { name: 'Student 21', iv: 'iv_g6_s21', gender: 'Male', gpa: 2.50, commitment: 4 },
            { name: 'Student 22', iv: 'iv_g6_s22', gender: 'Female', gpa: 3.85, commitment: 4 },
            { name: 'Student 23', iv: 'iv_g6_s23', gender: 'Male', gpa: 3.50, commitment: 4 },
            { name: 'Student 24', iv: 'iv_g6_s24', gender: 'Male', gpa: 3.00, commitment: 4 },
            // GROUP 7
            { name: 'Student 25', iv: 'iv_g7_s25', gender: 'Female', gpa: 4.00, commitment: 4 },
            { name: 'Student 26', iv: 'iv_g7_s26', gender: 'Female', gpa: 3.90, commitment: 4 },
            { name: 'Student 27', iv: 'iv_g7_s27', gender: 'Female', gpa: 3.90, commitment: 4 },
            { name: 'Student 28', iv: 'iv_g7_s28', gender: 'Other', gpa: 4.00, commitment: 4 },
            // GROUP 8
            { name: 'Student 29', iv: 'iv_g8_s29', gender: 'Male', gpa: 3.40, commitment: 4 },
            { name: 'Student 30', iv: 'iv_g8_s30', gender: 'Male', gpa: 3.10, commitment: 4 },
            { name: 'Student 31', iv: 'iv_g8_s31', gender: 'Male', gpa: 3.40, commitment: 4 },
            { name: 'Student 32', iv: 'iv_g8_s32', gender: 'Female', gpa: 3.60, commitment: 4 },
        ];

        let studentIdStart = 0;
        const survey5KeyBuffer = Buffer.from(survey5DecryptionKey.substring(0, 32), 'utf8');
        for (const student of survey5Students) {
            const iv = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv('aes-256-cbc', survey5KeyBuffer, iv);
            let encryptedName = cipher.update(student.name, 'utf8', 'hex');
            encryptedName += cipher.final('hex');
            const ivHex = iv.toString('hex');

            const [result] = await connection.query(
                `INSERT INTO student_survey_entries (encrypted_name, iv, gender, gpa, commitment, survey_id) 
       VALUES (?, ?, ?, ?, ?, ?)`,
                [encryptedName, ivHex, student.gender, student.gpa, student.commitment, surveyId5]
            );
            if (studentIdStart === 0) {
                studentIdStart = result.insertId;
            }
        }
        console.log(`✓ ${survey5Students.length} students added to survey 5\n`);

        // Availability data for survey 5 students (32 students from 9 groups)
        const availabilityDataSurvey5 = [
            // GROUP 1 - S1-S4
            // S1: MON 8AM-4PM, WED 8AM-11PM, THU 5-11PM, FRI 8AM-5PM, SUN 8-11PM
            { student_id: studentIdStart + 0, day_of_week: 'MON', time_slot: '8 AM' },
            { student_id: studentIdStart + 0, day_of_week: 'MON', time_slot: '12 PM' },
            { student_id: studentIdStart + 0, day_of_week: 'MON', time_slot: '4 PM' },
            { student_id: studentIdStart + 0, day_of_week: 'WED', time_slot: '8 AM' },
            { student_id: studentIdStart + 0, day_of_week: 'WED', time_slot: '11 PM' },
            { student_id: studentIdStart + 0, day_of_week: 'THU', time_slot: '5 PM' },
            { student_id: studentIdStart + 0, day_of_week: 'THU', time_slot: '11 PM' },
            { student_id: studentIdStart + 0, day_of_week: 'FRI', time_slot: '8 AM' },
            { student_id: studentIdStart + 0, day_of_week: 'FRI', time_slot: '5 PM' },
            { student_id: studentIdStart + 0, day_of_week: 'SUN', time_slot: '8 AM' },
            { student_id: studentIdStart + 0, day_of_week: 'SUN', time_slot: '11 PM' },

            // S2: MON 4-10PM, TUE 5-10PM, WED 4-10PM, THU 5-10PM, FRI 3-10PM, SAT 3-10PM, SUN 3-10PM
            { student_id: studentIdStart + 1, day_of_week: 'MON', time_slot: '4 PM' },
            { student_id: studentIdStart + 1, day_of_week: 'MON', time_slot: '10 PM' },
            { student_id: studentIdStart + 1, day_of_week: 'TUE', time_slot: '5 PM' },
            { student_id: studentIdStart + 1, day_of_week: 'TUE', time_slot: '10 PM' },
            { student_id: studentIdStart + 1, day_of_week: 'WED', time_slot: '4 PM' },
            { student_id: studentIdStart + 1, day_of_week: 'WED', time_slot: '10 PM' },
            { student_id: studentIdStart + 1, day_of_week: 'THU', time_slot: '5 PM' },
            { student_id: studentIdStart + 1, day_of_week: 'THU', time_slot: '10 PM' },
            { student_id: studentIdStart + 1, day_of_week: 'FRI', time_slot: '3 PM' },
            { student_id: studentIdStart + 1, day_of_week: 'FRI', time_slot: '10 PM' },
            { student_id: studentIdStart + 1, day_of_week: 'SAT', time_slot: '3 PM' },
            { student_id: studentIdStart + 1, day_of_week: 'SAT', time_slot: '10 PM' },
            { student_id: studentIdStart + 1, day_of_week: 'SUN', time_slot: '3 PM' },
            { student_id: studentIdStart + 1, day_of_week: 'SUN', time_slot: '10 PM' },

            // S3: MON 7AM-6PM, TUE 7-9AM, WED 7AM-6PM, THU 7-9AM & 4-7PM, FRI 7AM-6PM, SAT 12-6PM
            { student_id: studentIdStart + 2, day_of_week: 'MON', time_slot: '7 AM' },
            { student_id: studentIdStart + 2, day_of_week: 'MON', time_slot: '6 PM' },
            { student_id: studentIdStart + 2, day_of_week: 'TUE', time_slot: '7 AM' },
            { student_id: studentIdStart + 2, day_of_week: 'TUE', time_slot: '9 AM' },
            { student_id: studentIdStart + 2, day_of_week: 'WED', time_slot: '7 AM' },
            { student_id: studentIdStart + 2, day_of_week: 'WED', time_slot: '6 PM' },
            { student_id: studentIdStart + 2, day_of_week: 'THU', time_slot: '7 AM' },
            { student_id: studentIdStart + 2, day_of_week: 'THU', time_slot: '9 AM' },
            { student_id: studentIdStart + 2, day_of_week: 'THU', time_slot: '4 PM' },
            { student_id: studentIdStart + 2, day_of_week: 'THU', time_slot: '7 PM' },
            { student_id: studentIdStart + 2, day_of_week: 'FRI', time_slot: '7 AM' },
            { student_id: studentIdStart + 2, day_of_week: 'FRI', time_slot: '6 PM' },
            { student_id: studentIdStart + 2, day_of_week: 'SAT', time_slot: '12 PM' },
            { student_id: studentIdStart + 2, day_of_week: 'SAT', time_slot: '6 PM' },

            // S4: MON 5-11PM, WED 5-11PM, FRI 5-11PM, SUN 10AM-2PM
            { student_id: studentIdStart + 3, day_of_week: 'MON', time_slot: '5 PM' },
            { student_id: studentIdStart + 3, day_of_week: 'MON', time_slot: '11 PM' },
            { student_id: studentIdStart + 3, day_of_week: 'WED', time_slot: '5 PM' },
            { student_id: studentIdStart + 3, day_of_week: 'WED', time_slot: '11 PM' },
            { student_id: studentIdStart + 3, day_of_week: 'FRI', time_slot: '5 PM' },
            { student_id: studentIdStart + 3, day_of_week: 'FRI', time_slot: '11 PM' },
            { student_id: studentIdStart + 3, day_of_week: 'SUN', time_slot: '10 AM' },
            { student_id: studentIdStart + 3, day_of_week: 'SUN', time_slot: '2 PM' },

            // GROUP 2 - S5-S8
            // S5: MON 10AM-3PM, WED 10AM-3PM, FRI 10AM-3PM, SAT 10AM-3PM, SUN 10AM-3PM
            { student_id: studentIdStart + 4, day_of_week: 'MON', time_slot: '10 AM' },
            { student_id: studentIdStart + 4, day_of_week: 'MON', time_slot: '3 PM' },
            { student_id: studentIdStart + 4, day_of_week: 'WED', time_slot: '10 AM' },
            { student_id: studentIdStart + 4, day_of_week: 'WED', time_slot: '3 PM' },
            { student_id: studentIdStart + 4, day_of_week: 'FRI', time_slot: '10 AM' },
            { student_id: studentIdStart + 4, day_of_week: 'FRI', time_slot: '3 PM' },
            { student_id: studentIdStart + 4, day_of_week: 'SAT', time_slot: '10 AM' },
            { student_id: studentIdStart + 4, day_of_week: 'SAT', time_slot: '3 PM' },
            { student_id: studentIdStart + 4, day_of_week: 'SUN', time_slot: '10 AM' },
            { student_id: studentIdStart + 4, day_of_week: 'SUN', time_slot: '3 PM' },

            // S6: MON 10AM-8PM, TUE 5-8PM, WED 10AM-8PM, THU 5-8PM, FRI 10AM-8PM, SAT 6-10PM, SUN 6-10PM
            { student_id: studentIdStart + 5, day_of_week: 'MON', time_slot: '10 AM' },
            { student_id: studentIdStart + 5, day_of_week: 'MON', time_slot: '8 PM' },
            { student_id: studentIdStart + 5, day_of_week: 'TUE', time_slot: '5 PM' },
            { student_id: studentIdStart + 5, day_of_week: 'TUE', time_slot: '8 PM' },
            { student_id: studentIdStart + 5, day_of_week: 'WED', time_slot: '10 AM' },
            { student_id: studentIdStart + 5, day_of_week: 'WED', time_slot: '8 PM' },
            { student_id: studentIdStart + 5, day_of_week: 'THU', time_slot: '5 PM' },
            { student_id: studentIdStart + 5, day_of_week: 'THU', time_slot: '8 PM' },
            { student_id: studentIdStart + 5, day_of_week: 'FRI', time_slot: '10 AM' },
            { student_id: studentIdStart + 5, day_of_week: 'FRI', time_slot: '8 PM' },
            { student_id: studentIdStart + 5, day_of_week: 'SAT', time_slot: '6 PM' },
            { student_id: studentIdStart + 5, day_of_week: 'SAT', time_slot: '10 PM' },
            { student_id: studentIdStart + 5, day_of_week: 'SUN', time_slot: '6 PM' },
            { student_id: studentIdStart + 5, day_of_week: 'SUN', time_slot: '10 PM' },

            // S7: MON 2-3PM, WED 2-3PM, FRI 2-3PM, SAT 2-3PM
            { student_id: studentIdStart + 6, day_of_week: 'MON', time_slot: '2 PM' },
            { student_id: studentIdStart + 6, day_of_week: 'MON', time_slot: '3 PM' },
            { student_id: studentIdStart + 6, day_of_week: 'WED', time_slot: '2 PM' },
            { student_id: studentIdStart + 6, day_of_week: 'WED', time_slot: '3 PM' },
            { student_id: studentIdStart + 6, day_of_week: 'FRI', time_slot: '2 PM' },
            { student_id: studentIdStart + 6, day_of_week: 'FRI', time_slot: '3 PM' },
            { student_id: studentIdStart + 6, day_of_week: 'SAT', time_slot: '2 PM' },
            { student_id: studentIdStart + 6, day_of_week: 'SAT', time_slot: '3 PM' },

            // S8: TUE 5-7PM, WED 11AM-7PM, THU 5-7PM, SUN 11AM-3PM
            { student_id: studentIdStart + 7, day_of_week: 'TUE', time_slot: '5 PM' },
            { student_id: studentIdStart + 7, day_of_week: 'TUE', time_slot: '7 PM' },
            { student_id: studentIdStart + 7, day_of_week: 'WED', time_slot: '11 AM' },
            { student_id: studentIdStart + 7, day_of_week: 'WED', time_slot: '7 PM' },
            { student_id: studentIdStart + 7, day_of_week: 'THU', time_slot: '5 PM' },
            { student_id: studentIdStart + 7, day_of_week: 'THU', time_slot: '7 PM' },
            { student_id: studentIdStart + 7, day_of_week: 'SUN', time_slot: '11 AM' },
            { student_id: studentIdStart + 7, day_of_week: 'SUN', time_slot: '3 PM' },

            // GROUP 3 - S9-S12
            // S9: MON 10-11PM, TUE-SUN 10-11PM
            { student_id: studentIdStart + 8, day_of_week: 'MON', time_slot: '10 PM' },
            { student_id: studentIdStart + 8, day_of_week: 'MON', time_slot: '11 PM' },
            { student_id: studentIdStart + 8, day_of_week: 'TUE', time_slot: '10 PM' },
            { student_id: studentIdStart + 8, day_of_week: 'TUE', time_slot: '11 PM' },
            { student_id: studentIdStart + 8, day_of_week: 'WED', time_slot: '10 PM' },
            { student_id: studentIdStart + 8, day_of_week: 'WED', time_slot: '11 PM' },
            { student_id: studentIdStart + 8, day_of_week: 'THU', time_slot: '10 PM' },
            { student_id: studentIdStart + 8, day_of_week: 'THU', time_slot: '11 PM' },
            { student_id: studentIdStart + 8, day_of_week: 'FRI', time_slot: '10 PM' },
            { student_id: studentIdStart + 8, day_of_week: 'FRI', time_slot: '11 PM' },
            { student_id: studentIdStart + 8, day_of_week: 'SAT', time_slot: '10 PM' },
            { student_id: studentIdStart + 8, day_of_week: 'SAT', time_slot: '11 PM' },
            { student_id: studentIdStart + 8, day_of_week: 'SUN', time_slot: '10 PM' },
            { student_id: studentIdStart + 8, day_of_week: 'SUN', time_slot: '11 PM' },

            // S10: MON 1-8PM, WED 1-8PM, FRI 10AM-2PM
            { student_id: studentIdStart + 9, day_of_week: 'MON', time_slot: '1 PM' },
            { student_id: studentIdStart + 9, day_of_week: 'MON', time_slot: '8 PM' },
            { student_id: studentIdStart + 9, day_of_week: 'WED', time_slot: '1 PM' },
            { student_id: studentIdStart + 9, day_of_week: 'WED', time_slot: '8 PM' },
            { student_id: studentIdStart + 9, day_of_week: 'FRI', time_slot: '10 AM' },
            { student_id: studentIdStart + 9, day_of_week: 'FRI', time_slot: '2 PM' },

            // S11: MON 9-10PM, TUE 5-10PM, WED 4PM & 8-10PM, THU 4PM & 7-10PM, FRI 4-7PM & 9-10PM, SAT 9-10PM, SUN 9-10PM
            { student_id: studentIdStart + 10, day_of_week: 'MON', time_slot: '9 PM' },
            { student_id: studentIdStart + 10, day_of_week: 'MON', time_slot: '10 PM' },
            { student_id: studentIdStart + 10, day_of_week: 'TUE', time_slot: '5 PM' },
            { student_id: studentIdStart + 10, day_of_week: 'TUE', time_slot: '10 PM' },
            { student_id: studentIdStart + 10, day_of_week: 'WED', time_slot: '4 PM' },
            { student_id: studentIdStart + 10, day_of_week: 'WED', time_slot: '8 PM' },
            { student_id: studentIdStart + 10, day_of_week: 'WED', time_slot: '10 PM' },
            { student_id: studentIdStart + 10, day_of_week: 'THU', time_slot: '4 PM' },
            { student_id: studentIdStart + 10, day_of_week: 'THU', time_slot: '7 PM' },
            { student_id: studentIdStart + 10, day_of_week: 'THU', time_slot: '10 PM' },
            { student_id: studentIdStart + 10, day_of_week: 'FRI', time_slot: '4 PM' },
            { student_id: studentIdStart + 10, day_of_week: 'FRI', time_slot: '7 PM' },
            { student_id: studentIdStart + 10, day_of_week: 'FRI', time_slot: '9 PM' },
            { student_id: studentIdStart + 10, day_of_week: 'FRI', time_slot: '10 PM' },
            { student_id: studentIdStart + 10, day_of_week: 'SAT', time_slot: '9 PM' },
            { student_id: studentIdStart + 10, day_of_week: 'SAT', time_slot: '10 PM' },
            { student_id: studentIdStart + 10, day_of_week: 'SUN', time_slot: '9 PM' },
            { student_id: studentIdStart + 10, day_of_week: 'SUN', time_slot: '10 PM' },

            // S12: MON 10AM-4PM, WED 10AM-4PM, FRI 10AM-4PM
            { student_id: studentIdStart + 11, day_of_week: 'MON', time_slot: '10 AM' },
            { student_id: studentIdStart + 11, day_of_week: 'MON', time_slot: '4 PM' },
            { student_id: studentIdStart + 11, day_of_week: 'WED', time_slot: '10 AM' },
            { student_id: studentIdStart + 11, day_of_week: 'WED', time_slot: '4 PM' },
            { student_id: studentIdStart + 11, day_of_week: 'FRI', time_slot: '10 AM' },
            { student_id: studentIdStart + 11, day_of_week: 'FRI', time_slot: '4 PM' },

            // GROUP 4 - S13-S16
            // S13: MON 6-7PM, TUE 12PM & 6-7PM, WED 6-7PM, THU 12PM & 6-7PM, FRI 6-7PM, SAT 6-7PM, SUN 6-7PM
            { student_id: studentIdStart + 12, day_of_week: 'MON', time_slot: '6 PM' },
            { student_id: studentIdStart + 12, day_of_week: 'MON', time_slot: '7 PM' },
            { student_id: studentIdStart + 12, day_of_week: 'TUE', time_slot: '12 PM' },
            { student_id: studentIdStart + 12, day_of_week: 'TUE', time_slot: '6 PM' },
            { student_id: studentIdStart + 12, day_of_week: 'TUE', time_slot: '7 PM' },
            { student_id: studentIdStart + 12, day_of_week: 'WED', time_slot: '6 PM' },
            { student_id: studentIdStart + 12, day_of_week: 'WED', time_slot: '7 PM' },
            { student_id: studentIdStart + 12, day_of_week: 'THU', time_slot: '12 PM' },
            { student_id: studentIdStart + 12, day_of_week: 'THU', time_slot: '6 PM' },
            { student_id: studentIdStart + 12, day_of_week: 'THU', time_slot: '7 PM' },
            { student_id: studentIdStart + 12, day_of_week: 'FRI', time_slot: '6 PM' },
            { student_id: studentIdStart + 12, day_of_week: 'FRI', time_slot: '7 PM' },
            { student_id: studentIdStart + 12, day_of_week: 'SAT', time_slot: '6 PM' },
            { student_id: studentIdStart + 12, day_of_week: 'SAT', time_slot: '7 PM' },
            { student_id: studentIdStart + 12, day_of_week: 'SUN', time_slot: '6 PM' },
            { student_id: studentIdStart + 12, day_of_week: 'SUN', time_slot: '7 PM' },

            // S14: MON 9AM-5PM, TUE 12-5PM, WED 9AM-5PM, THU 12PM, FRI 9AM-2PM, SAT 9AM-2PM, SUN 9AM-2PM
            { student_id: studentIdStart + 13, day_of_week: 'MON', time_slot: '9 AM' },
            { student_id: studentIdStart + 13, day_of_week: 'MON', time_slot: '5 PM' },
            { student_id: studentIdStart + 13, day_of_week: 'TUE', time_slot: '12 PM' },
            { student_id: studentIdStart + 13, day_of_week: 'TUE', time_slot: '5 PM' },
            { student_id: studentIdStart + 13, day_of_week: 'WED', time_slot: '9 AM' },
            { student_id: studentIdStart + 13, day_of_week: 'WED', time_slot: '5 PM' },
            { student_id: studentIdStart + 13, day_of_week: 'THU', time_slot: '12 PM' },
            { student_id: studentIdStart + 13, day_of_week: 'FRI', time_slot: '9 AM' },
            { student_id: studentIdStart + 13, day_of_week: 'FRI', time_slot: '2 PM' },
            { student_id: studentIdStart + 13, day_of_week: 'SAT', time_slot: '9 AM' },
            { student_id: studentIdStart + 13, day_of_week: 'SAT', time_slot: '2 PM' },
            { student_id: studentIdStart + 13, day_of_week: 'SUN', time_slot: '9 AM' },
            { student_id: studentIdStart + 13, day_of_week: 'SUN', time_slot: '2 PM' },

            // S15: MON 2-5PM, TUE 12PM, WED 2-5PM, THU 12PM, FRI 2-5PM, SAT 10AM-12PM, SUN 10AM-12PM
            { student_id: studentIdStart + 14, day_of_week: 'MON', time_slot: '2 PM' },
            { student_id: studentIdStart + 14, day_of_week: 'MON', time_slot: '5 PM' },
            { student_id: studentIdStart + 14, day_of_week: 'TUE', time_slot: '12 PM' },
            { student_id: studentIdStart + 14, day_of_week: 'WED', time_slot: '2 PM' },
            { student_id: studentIdStart + 14, day_of_week: 'WED', time_slot: '5 PM' },
            { student_id: studentIdStart + 14, day_of_week: 'THU', time_slot: '12 PM' },
            { student_id: studentIdStart + 14, day_of_week: 'FRI', time_slot: '2 PM' },
            { student_id: studentIdStart + 14, day_of_week: 'FRI', time_slot: '5 PM' },
            { student_id: studentIdStart + 14, day_of_week: 'SAT', time_slot: '10 AM' },
            { student_id: studentIdStart + 14, day_of_week: 'SAT', time_slot: '12 PM' },
            { student_id: studentIdStart + 14, day_of_week: 'SUN', time_slot: '10 AM' },
            { student_id: studentIdStart + 14, day_of_week: 'SUN', time_slot: '12 PM' },

            // S16: MON 2-6PM, TUE 7PM, WED 2-6PM, FRI 7AM-2PM & 4-9PM, SAT 7AM-9PM, SUN 7AM-9PM
            { student_id: studentIdStart + 15, day_of_week: 'MON', time_slot: '2 PM' },
            { student_id: studentIdStart + 15, day_of_week: 'MON', time_slot: '6 PM' },
            { student_id: studentIdStart + 15, day_of_week: 'TUE', time_slot: '7 PM' },
            { student_id: studentIdStart + 15, day_of_week: 'WED', time_slot: '2 PM' },
            { student_id: studentIdStart + 15, day_of_week: 'WED', time_slot: '6 PM' },
            { student_id: studentIdStart + 15, day_of_week: 'FRI', time_slot: '7 AM' },
            { student_id: studentIdStart + 15, day_of_week: 'FRI', time_slot: '2 PM' },
            { student_id: studentIdStart + 15, day_of_week: 'FRI', time_slot: '4 PM' },
            { student_id: studentIdStart + 15, day_of_week: 'FRI', time_slot: '9 PM' },
            { student_id: studentIdStart + 15, day_of_week: 'SAT', time_slot: '7 AM' },
            { student_id: studentIdStart + 15, day_of_week: 'SAT', time_slot: '9 PM' },
            { student_id: studentIdStart + 15, day_of_week: 'SUN', time_slot: '7 AM' },
            { student_id: studentIdStart + 15, day_of_week: 'SUN', time_slot: '9 PM' },

            // GROUP 5 - S17-S20
            // S17: MON 9AM-7PM, WED 9AM-7PM, FRI 9AM-7PM, SAT 9AM-7PM, SUN 9AM-7PM
            { student_id: studentIdStart + 16, day_of_week: 'MON', time_slot: '9 AM' },
            { student_id: studentIdStart + 16, day_of_week: 'MON', time_slot: '7 PM' },
            { student_id: studentIdStart + 16, day_of_week: 'WED', time_slot: '9 AM' },
            { student_id: studentIdStart + 16, day_of_week: 'WED', time_slot: '7 PM' },
            { student_id: studentIdStart + 16, day_of_week: 'FRI', time_slot: '9 AM' },
            { student_id: studentIdStart + 16, day_of_week: 'FRI', time_slot: '7 PM' },
            { student_id: studentIdStart + 16, day_of_week: 'SAT', time_slot: '9 AM' },
            { student_id: studentIdStart + 16, day_of_week: 'SAT', time_slot: '7 PM' },
            { student_id: studentIdStart + 16, day_of_week: 'SUN', time_slot: '9 AM' },
            { student_id: studentIdStart + 16, day_of_week: 'SUN', time_slot: '7 PM' },

            // S18: MON 8-10AM, TUE 8-10AM, WED 8AM-12PM, THU 8AM-12PM, FRI 8AM-12PM
            { student_id: studentIdStart + 17, day_of_week: 'MON', time_slot: '8 AM' },
            { student_id: studentIdStart + 17, day_of_week: 'MON', time_slot: '10 AM' },
            { student_id: studentIdStart + 17, day_of_week: 'TUE', time_slot: '8 AM' },
            { student_id: studentIdStart + 17, day_of_week: 'TUE', time_slot: '10 AM' },
            { student_id: studentIdStart + 17, day_of_week: 'WED', time_slot: '8 AM' },
            { student_id: studentIdStart + 17, day_of_week: 'WED', time_slot: '12 PM' },
            { student_id: studentIdStart + 17, day_of_week: 'THU', time_slot: '8 AM' },
            { student_id: studentIdStart + 17, day_of_week: 'THU', time_slot: '12 PM' },
            { student_id: studentIdStart + 17, day_of_week: 'FRI', time_slot: '8 AM' },
            { student_id: studentIdStart + 17, day_of_week: 'FRI', time_slot: '12 PM' },

            // S19: TUE 12-1PM & 4-6PM, THU 12-1PM & 4-6PM, FRI 10AM-4PM, SAT 10AM-1PM
            { student_id: studentIdStart + 18, day_of_week: 'TUE', time_slot: '12 PM' },
            { student_id: studentIdStart + 18, day_of_week: 'TUE', time_slot: '1 PM' },
            { student_id: studentIdStart + 18, day_of_week: 'TUE', time_slot: '4 PM' },
            { student_id: studentIdStart + 18, day_of_week: 'TUE', time_slot: '6 PM' },
            { student_id: studentIdStart + 18, day_of_week: 'THU', time_slot: '12 PM' },
            { student_id: studentIdStart + 18, day_of_week: 'THU', time_slot: '1 PM' },
            { student_id: studentIdStart + 18, day_of_week: 'THU', time_slot: '4 PM' },
            { student_id: studentIdStart + 18, day_of_week: 'THU', time_slot: '6 PM' },
            { student_id: studentIdStart + 18, day_of_week: 'FRI', time_slot: '10 AM' },
            { student_id: studentIdStart + 18, day_of_week: 'FRI', time_slot: '4 PM' },
            { student_id: studentIdStart + 18, day_of_week: 'SAT', time_slot: '10 AM' },
            { student_id: studentIdStart + 18, day_of_week: 'SAT', time_slot: '1 PM' },

            // S20: MON 10AM-7PM, WED 10AM-10PM, THU 6-10PM, FRI 10AM-3PM, SAT 10AM-3PM, SUN 10AM-3PM
            { student_id: studentIdStart + 19, day_of_week: 'MON', time_slot: '10 AM' },
            { student_id: studentIdStart + 19, day_of_week: 'MON', time_slot: '7 PM' },
            { student_id: studentIdStart + 19, day_of_week: 'WED', time_slot: '10 AM' },
            { student_id: studentIdStart + 19, day_of_week: 'WED', time_slot: '10 PM' },
            { student_id: studentIdStart + 19, day_of_week: 'THU', time_slot: '6 PM' },
            { student_id: studentIdStart + 19, day_of_week: 'THU', time_slot: '10 PM' },
            { student_id: studentIdStart + 19, day_of_week: 'FRI', time_slot: '10 AM' },
            { student_id: studentIdStart + 19, day_of_week: 'FRI', time_slot: '3 PM' },
            { student_id: studentIdStart + 19, day_of_week: 'SAT', time_slot: '10 AM' },
            { student_id: studentIdStart + 19, day_of_week: 'SAT', time_slot: '3 PM' },
            { student_id: studentIdStart + 19, day_of_week: 'SUN', time_slot: '10 AM' },
            { student_id: studentIdStart + 19, day_of_week: 'SUN', time_slot: '3 PM' },

            // GROUP 6 - S21-S24
            // S21: MON 11AM-4PM, WED 11AM-4PM, FRI 11AM-4PM, SAT 11AM-4PM, SUN 11AM-4PM
            { student_id: studentIdStart + 20, day_of_week: 'MON', time_slot: '11 AM' },
            { student_id: studentIdStart + 20, day_of_week: 'MON', time_slot: '4 PM' },
            { student_id: studentIdStart + 20, day_of_week: 'WED', time_slot: '11 AM' },
            { student_id: studentIdStart + 20, day_of_week: 'WED', time_slot: '4 PM' },
            { student_id: studentIdStart + 20, day_of_week: 'FRI', time_slot: '11 AM' },
            { student_id: studentIdStart + 20, day_of_week: 'FRI', time_slot: '4 PM' },
            { student_id: studentIdStart + 20, day_of_week: 'SAT', time_slot: '11 AM' },
            { student_id: studentIdStart + 20, day_of_week: 'SAT', time_slot: '4 PM' },
            { student_id: studentIdStart + 20, day_of_week: 'SUN', time_slot: '11 AM' },
            { student_id: studentIdStart + 20, day_of_week: 'SUN', time_slot: '4 PM' },

            // S22: MON 5-11PM, TUE 4-11PM, WED 7AM-11PM, THU 4-11PM
            { student_id: studentIdStart + 21, day_of_week: 'MON', time_slot: '5 PM' },
            { student_id: studentIdStart + 21, day_of_week: 'MON', time_slot: '11 PM' },
            { student_id: studentIdStart + 21, day_of_week: 'TUE', time_slot: '4 PM' },
            { student_id: studentIdStart + 21, day_of_week: 'TUE', time_slot: '11 PM' },
            { student_id: studentIdStart + 21, day_of_week: 'WED', time_slot: '7 AM' },
            { student_id: studentIdStart + 21, day_of_week: 'WED', time_slot: '11 PM' },
            { student_id: studentIdStart + 21, day_of_week: 'THU', time_slot: '4 PM' },
            { student_id: studentIdStart + 21, day_of_week: 'THU', time_slot: '11 PM' },

            // S23: MON 2-4PM & 10-11PM, TUE 10-11PM, WED 2-4PM & 10-11PM, THU 10-11PM, FRI 2-4PM & 10-11PM
            { student_id: studentIdStart + 22, day_of_week: 'MON', time_slot: '2 PM' },
            { student_id: studentIdStart + 22, day_of_week: 'MON', time_slot: '4 PM' },
            { student_id: studentIdStart + 22, day_of_week: 'MON', time_slot: '10 PM' },
            { student_id: studentIdStart + 22, day_of_week: 'MON', time_slot: '11 PM' },
            { student_id: studentIdStart + 22, day_of_week: 'TUE', time_slot: '10 PM' },
            { student_id: studentIdStart + 22, day_of_week: 'TUE', time_slot: '11 PM' },
            { student_id: studentIdStart + 22, day_of_week: 'WED', time_slot: '2 PM' },
            { student_id: studentIdStart + 22, day_of_week: 'WED', time_slot: '4 PM' },
            { student_id: studentIdStart + 22, day_of_week: 'WED', time_slot: '10 PM' },
            { student_id: studentIdStart + 22, day_of_week: 'WED', time_slot: '11 PM' },
            { student_id: studentIdStart + 22, day_of_week: 'THU', time_slot: '10 PM' },
            { student_id: studentIdStart + 22, day_of_week: 'THU', time_slot: '11 PM' },
            { student_id: studentIdStart + 22, day_of_week: 'FRI', time_slot: '2 PM' },
            { student_id: studentIdStart + 22, day_of_week: 'FRI', time_slot: '4 PM' },
            { student_id: studentIdStart + 22, day_of_week: 'FRI', time_slot: '10 PM' },
            { student_id: studentIdStart + 22, day_of_week: 'FRI', time_slot: '11 PM' },

            // S24: MON 7AM, 10-11AM, 1PM, 3PM, 5PM, 7-8PM, TUE 7AM, 10AM, 1PM, 3PM, 5-8PM, WED 11AM, 1PM, 3PM, 5-8PM, THU 8AM, 10-11AM, 4PM, 6-8PM, FRI 8AM, 10AM, 12PM, 2PM, 4PM, 6-8PM, SAT 9-10AM, 12PM, 2PM, 5-8PM, SUN 9-11AM, 1-2PM, 5PM, 7-8PM
            { student_id: studentIdStart + 23, day_of_week: 'MON', time_slot: '7 AM' },
            { student_id: studentIdStart + 23, day_of_week: 'MON', time_slot: '10 AM' },
            { student_id: studentIdStart + 23, day_of_week: 'MON', time_slot: '11 AM' },
            { student_id: studentIdStart + 23, day_of_week: 'MON', time_slot: '1 PM' },
            { student_id: studentIdStart + 23, day_of_week: 'MON', time_slot: '3 PM' },
            { student_id: studentIdStart + 23, day_of_week: 'MON', time_slot: '5 PM' },
            { student_id: studentIdStart + 23, day_of_week: 'MON', time_slot: '7 PM' },
            { student_id: studentIdStart + 23, day_of_week: 'MON', time_slot: '8 PM' },
            { student_id: studentIdStart + 23, day_of_week: 'TUE', time_slot: '7 AM' },
            { student_id: studentIdStart + 23, day_of_week: 'TUE', time_slot: '10 AM' },
            { student_id: studentIdStart + 23, day_of_week: 'TUE', time_slot: '1 PM' },
            { student_id: studentIdStart + 23, day_of_week: 'TUE', time_slot: '3 PM' },
            { student_id: studentIdStart + 23, day_of_week: 'TUE', time_slot: '5 PM' },
            { student_id: studentIdStart + 23, day_of_week: 'TUE', time_slot: '8 PM' },
            { student_id: studentIdStart + 23, day_of_week: 'WED', time_slot: '11 AM' },
            { student_id: studentIdStart + 23, day_of_week: 'WED', time_slot: '1 PM' },
            { student_id: studentIdStart + 23, day_of_week: 'WED', time_slot: '3 PM' },
            { student_id: studentIdStart + 23, day_of_week: 'WED', time_slot: '5 PM' },
            { student_id: studentIdStart + 23, day_of_week: 'WED', time_slot: '8 PM' },
            { student_id: studentIdStart + 23, day_of_week: 'THU', time_slot: '8 AM' },
            { student_id: studentIdStart + 23, day_of_week: 'THU', time_slot: '10 AM' },
            { student_id: studentIdStart + 23, day_of_week: 'THU', time_slot: '11 AM' },
            { student_id: studentIdStart + 23, day_of_week: 'THU', time_slot: '4 PM' },
            { student_id: studentIdStart + 23, day_of_week: 'THU', time_slot: '6 PM' },
            { student_id: studentIdStart + 23, day_of_week: 'THU', time_slot: '8 PM' },
            { student_id: studentIdStart + 23, day_of_week: 'FRI', time_slot: '8 AM' },
            { student_id: studentIdStart + 23, day_of_week: 'FRI', time_slot: '10 AM' },
            { student_id: studentIdStart + 23, day_of_week: 'FRI', time_slot: '12 PM' },
            { student_id: studentIdStart + 23, day_of_week: 'FRI', time_slot: '2 PM' },
            { student_id: studentIdStart + 23, day_of_week: 'FRI', time_slot: '4 PM' },
            { student_id: studentIdStart + 23, day_of_week: 'FRI', time_slot: '6 PM' },
            { student_id: studentIdStart + 23, day_of_week: 'FRI', time_slot: '8 PM' },
            { student_id: studentIdStart + 23, day_of_week: 'SAT', time_slot: '9 AM' },
            { student_id: studentIdStart + 23, day_of_week: 'SAT', time_slot: '10 AM' },
            { student_id: studentIdStart + 23, day_of_week: 'SAT', time_slot: '12 PM' },
            { student_id: studentIdStart + 23, day_of_week: 'SAT', time_slot: '2 PM' },
            { student_id: studentIdStart + 23, day_of_week: 'SAT', time_slot: '5 PM' },
            { student_id: studentIdStart + 23, day_of_week: 'SAT', time_slot: '8 PM' },
            { student_id: studentIdStart + 23, day_of_week: 'SUN', time_slot: '9 AM' },
            { student_id: studentIdStart + 23, day_of_week: 'SUN', time_slot: '11 AM' },
            { student_id: studentIdStart + 23, day_of_week: 'SUN', time_slot: '1 PM' },
            { student_id: studentIdStart + 23, day_of_week: 'SUN', time_slot: '2 PM' },
            { student_id: studentIdStart + 23, day_of_week: 'SUN', time_slot: '5 PM' },
            { student_id: studentIdStart + 23, day_of_week: 'SUN', time_slot: '7 PM' },
            { student_id: studentIdStart + 23, day_of_week: 'SUN', time_slot: '8 PM' },

            // GROUP 7 - S25-S28
            // S25: MON 4-11PM, TUE 5-11PM, WED 4-11PM, THU 5-11PM, FRI 4-11PM
            { student_id: studentIdStart + 24, day_of_week: 'MON', time_slot: '4 PM' },
            { student_id: studentIdStart + 24, day_of_week: 'MON', time_slot: '11 PM' },
            { student_id: studentIdStart + 24, day_of_week: 'TUE', time_slot: '5 PM' },
            { student_id: studentIdStart + 24, day_of_week: 'TUE', time_slot: '11 PM' },
            { student_id: studentIdStart + 24, day_of_week: 'WED', time_slot: '4 PM' },
            { student_id: studentIdStart + 24, day_of_week: 'WED', time_slot: '11 PM' },
            { student_id: studentIdStart + 24, day_of_week: 'THU', time_slot: '5 PM' },
            { student_id: studentIdStart + 24, day_of_week: 'THU', time_slot: '11 PM' },
            { student_id: studentIdStart + 24, day_of_week: 'FRI', time_slot: '4 PM' },
            { student_id: studentIdStart + 24, day_of_week: 'FRI', time_slot: '11 PM' },

            // S26: MON 10AM-5PM, WED 1-5PM, FRI 10AM-1PM
            { student_id: studentIdStart + 25, day_of_week: 'MON', time_slot: '10 AM' },
            { student_id: studentIdStart + 25, day_of_week: 'MON', time_slot: '5 PM' },
            { student_id: studentIdStart + 25, day_of_week: 'WED', time_slot: '1 PM' },
            { student_id: studentIdStart + 25, day_of_week: 'WED', time_slot: '5 PM' },
            { student_id: studentIdStart + 25, day_of_week: 'FRI', time_slot: '10 AM' },
            { student_id: studentIdStart + 25, day_of_week: 'FRI', time_slot: '1 PM' },

            // S27: MON 10AM-5PM, WED 1-5PM, FRI 10AM-1PM
            { student_id: studentIdStart + 26, day_of_week: 'MON', time_slot: '10 AM' },
            { student_id: studentIdStart + 26, day_of_week: 'MON', time_slot: '5 PM' },
            { student_id: studentIdStart + 26, day_of_week: 'WED', time_slot: '1 PM' },
            { student_id: studentIdStart + 26, day_of_week: 'WED', time_slot: '5 PM' },
            { student_id: studentIdStart + 26, day_of_week: 'FRI', time_slot: '10 AM' },
            { student_id: studentIdStart + 26, day_of_week: 'FRI', time_slot: '1 PM' },

            // S28: MON 8-11AM & 1-4PM, TUE 8-9AM, 12PM, 3-4PM, 6-8PM, WED 8-11AM, 1-2PM, THU 8-9AM, 12PM, 6-8PM, FRI 8-11AM, 1-2PM, SAT 10AM-4PM & 6-8PM, SUN 10AM-4PM & 6-8PM
            { student_id: studentIdStart + 27, day_of_week: 'MON', time_slot: '8 AM' },
            { student_id: studentIdStart + 27, day_of_week: 'MON', time_slot: '11 AM' },
            { student_id: studentIdStart + 27, day_of_week: 'MON', time_slot: '1 PM' },
            { student_id: studentIdStart + 27, day_of_week: 'MON', time_slot: '4 PM' },
            { student_id: studentIdStart + 27, day_of_week: 'TUE', time_slot: '8 AM' },
            { student_id: studentIdStart + 27, day_of_week: 'TUE', time_slot: '9 AM' },
            { student_id: studentIdStart + 27, day_of_week: 'TUE', time_slot: '12 PM' },
            { student_id: studentIdStart + 27, day_of_week: 'TUE', time_slot: '3 PM' },
            { student_id: studentIdStart + 27, day_of_week: 'TUE', time_slot: '4 PM' },
            { student_id: studentIdStart + 27, day_of_week: 'TUE', time_slot: '6 PM' },
            { student_id: studentIdStart + 27, day_of_week: 'TUE', time_slot: '8 PM' },
            { student_id: studentIdStart + 27, day_of_week: 'WED', time_slot: '8 AM' },
            { student_id: studentIdStart + 27, day_of_week: 'WED', time_slot: '11 AM' },
            { student_id: studentIdStart + 27, day_of_week: 'WED', time_slot: '1 PM' },
            { student_id: studentIdStart + 27, day_of_week: 'WED', time_slot: '2 PM' },
            { student_id: studentIdStart + 27, day_of_week: 'THU', time_slot: '8 AM' },
            { student_id: studentIdStart + 27, day_of_week: 'THU', time_slot: '9 AM' },
            { student_id: studentIdStart + 27, day_of_week: 'THU', time_slot: '12 PM' },
            { student_id: studentIdStart + 27, day_of_week: 'THU', time_slot: '6 PM' },
            { student_id: studentIdStart + 27, day_of_week: 'THU', time_slot: '8 PM' },
            { student_id: studentIdStart + 27, day_of_week: 'FRI', time_slot: '8 AM' },
            { student_id: studentIdStart + 27, day_of_week: 'FRI', time_slot: '11 AM' },
            { student_id: studentIdStart + 27, day_of_week: 'FRI', time_slot: '1 PM' },
            { student_id: studentIdStart + 27, day_of_week: 'FRI', time_slot: '2 PM' },
            { student_id: studentIdStart + 27, day_of_week: 'SAT', time_slot: '10 AM' },
            { student_id: studentIdStart + 27, day_of_week: 'SAT', time_slot: '4 PM' },
            { student_id: studentIdStart + 27, day_of_week: 'SAT', time_slot: '6 PM' },
            { student_id: studentIdStart + 27, day_of_week: 'SAT', time_slot: '8 PM' },
            { student_id: studentIdStart + 27, day_of_week: 'SUN', time_slot: '10 AM' },
            { student_id: studentIdStart + 27, day_of_week: 'SUN', time_slot: '4 PM' },
            { student_id: studentIdStart + 27, day_of_week: 'SUN', time_slot: '6 PM' },
            { student_id: studentIdStart + 27, day_of_week: 'SUN', time_slot: '8 PM' },

            // GROUP 8 - S29-S32
            // S29: MON 2-3PM, WED 11AM-1PM, FRI 11AM-1PM
            { student_id: studentIdStart + 28, day_of_week: 'MON', time_slot: '2 PM' },
            { student_id: studentIdStart + 28, day_of_week: 'MON', time_slot: '3 PM' },
            { student_id: studentIdStart + 28, day_of_week: 'WED', time_slot: '11 AM' },
            { student_id: studentIdStart + 28, day_of_week: 'WED', time_slot: '1 PM' },
            { student_id: studentIdStart + 28, day_of_week: 'FRI', time_slot: '11 AM' },
            { student_id: studentIdStart + 28, day_of_week: 'FRI', time_slot: '1 PM' },

            // S30: MON 5-7PM, TUE 12PM & 5-7PM, WED 2-7PM, THU 4-7PM, FRI 4-7PM
            { student_id: studentIdStart + 29, day_of_week: 'MON', time_slot: '5 PM' },
            { student_id: studentIdStart + 29, day_of_week: 'MON', time_slot: '7 PM' },
            { student_id: studentIdStart + 29, day_of_week: 'TUE', time_slot: '12 PM' },
            { student_id: studentIdStart + 29, day_of_week: 'TUE', time_slot: '5 PM' },
            { student_id: studentIdStart + 29, day_of_week: 'TUE', time_slot: '7 PM' },
            { student_id: studentIdStart + 29, day_of_week: 'WED', time_slot: '2 PM' },
            { student_id: studentIdStart + 29, day_of_week: 'WED', time_slot: '7 PM' },
            { student_id: studentIdStart + 29, day_of_week: 'THU', time_slot: '4 PM' },
            { student_id: studentIdStart + 29, day_of_week: 'THU', time_slot: '7 PM' },
            { student_id: studentIdStart + 29, day_of_week: 'FRI', time_slot: '4 PM' },
            { student_id: studentIdStart + 29, day_of_week: 'FRI', time_slot: '7 PM' },

            // S31: MON 3-8PM, TUE 3-6PM, WED 3-8PM, THU 3-6PM, FRI 3-8PM
            { student_id: studentIdStart + 30, day_of_week: 'MON', time_slot: '3 PM' },
            { student_id: studentIdStart + 30, day_of_week: 'MON', time_slot: '8 PM' },
            { student_id: studentIdStart + 30, day_of_week: 'TUE', time_slot: '3 PM' },
            { student_id: studentIdStart + 30, day_of_week: 'TUE', time_slot: '6 PM' },
            { student_id: studentIdStart + 30, day_of_week: 'WED', time_slot: '3 PM' },
            { student_id: studentIdStart + 30, day_of_week: 'WED', time_slot: '8 PM' },
            { student_id: studentIdStart + 30, day_of_week: 'THU', time_slot: '3 PM' },
            { student_id: studentIdStart + 30, day_of_week: 'THU', time_slot: '6 PM' },
            { student_id: studentIdStart + 30, day_of_week: 'FRI', time_slot: '3 PM' },
            { student_id: studentIdStart + 30, day_of_week: 'FRI', time_slot: '8 PM' },

            // S32: MON 11AM-8PM, TUE 8-11PM, WED 11AM-8PM, THU 8-11PM, FRI 11AM-9PM, SAT 8-9PM, SUN 8-9PM
            { student_id: studentIdStart + 31, day_of_week: 'MON', time_slot: '11 AM' },
            { student_id: studentIdStart + 31, day_of_week: 'MON', time_slot: '8 PM' },
            { student_id: studentIdStart + 31, day_of_week: 'TUE', time_slot: '8 PM' },
            { student_id: studentIdStart + 31, day_of_week: 'TUE', time_slot: '11 PM' },
            { student_id: studentIdStart + 31, day_of_week: 'WED', time_slot: '11 AM' },
            { student_id: studentIdStart + 31, day_of_week: 'WED', time_slot: '8 PM' },
            { student_id: studentIdStart + 31, day_of_week: 'THU', time_slot: '8 PM' },
            { student_id: studentIdStart + 31, day_of_week: 'THU', time_slot: '11 PM' },
            { student_id: studentIdStart + 31, day_of_week: 'FRI', time_slot: '11 AM' },
            { student_id: studentIdStart + 31, day_of_week: 'FRI', time_slot: '9 PM' },
            { student_id: studentIdStart + 31, day_of_week: 'SAT', time_slot: '8 PM' },
            { student_id: studentIdStart + 31, day_of_week: 'SAT', time_slot: '9 PM' },
            { student_id: studentIdStart + 31, day_of_week: 'SUN', time_slot: '8 PM' },
            { student_id: studentIdStart + 31, day_of_week: 'SUN', time_slot: '9 PM' },
        ];

        for (const availability of availabilityDataSurvey5) {
            await connection.query(
                `INSERT INTO availability (student_id, day_of_week, time_slot) 
         VALUES (?, ?, ?)`,
                [availability.student_id, availability.day_of_week, availability.time_slot]
            );
        }
        console.log(`✓ ${availabilityDataSurvey5.length} availability slots added for survey 5\n`);

        console.log('✅ Database seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log('   - Survey 1 (Female Only): 24 students');
        console.log('   - Survey 2 (Max Group 4): 23 students');
        console.log('   - Survey 3 (Min Group 2): 19 students');
        console.log('   - Survey 4 (Max Group 3): 20 students');
        console.log('   - Survey 5 (Group Demo): 32 students in 9 groups');
        console.log('   - Total: 118 students seeded');
        console.log(`   - Survey 1 availability slots: ${availabilityDataSurvey1.length}`);
        console.log(`   - Survey 2 availability slots: ${availabilityDataSurvey2.length}`);
        console.log(`   - Survey 3 availability slots: ${availabilityDataSurvey3.length}`);
        console.log(`   - Survey 4 availability slots: ${availabilityDataSurvey4.length}`);
        console.log(`   - Survey 5 availability slots: ${availabilityDataSurvey5.length}`);
        console.log(`   - Total availability slots: ${availabilityDataSurvey1.length + availabilityDataSurvey2.length + availabilityDataSurvey3.length + availabilityDataSurvey4.length + availabilityDataSurvey5.length}\n`);

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
