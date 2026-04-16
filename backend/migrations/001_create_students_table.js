import { pool } from '../db.js';

export const up = async () => {
  const connection = await pool.getConnection();
  try {
    // Create availability table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS availability (
        student_id INT(11) NOT NULL,
        day_of_week ENUM('MON','TUE','WED','THU','FRI','SAT','SUN') NOT NULL,
        time_slot VARCHAR(20) NOT NULL,
        PRIMARY KEY (student_id, day_of_week, time_slot)
      )
    `);
    console.log('✓ Availability table created successfully');

    // Create survey configurations table
    await connection.query(`
      DROP TABLE IF EXISTS survey_configurations
    `);
    await connection.query(`
      CREATE TABLE survey_configurations (
          id VARCHAR(255) PRIMARY KEY, 
          course_name VARCHAR(255),
          class_size INT,
          team_limit INT,        
          limit_type VARCHAR(20),
          use_gpa BOOLEAN,
          prev_course VARCHAR(255),
          encryption_salt VARCHAR(255),
          status VARCHAR(20) DEFAULT 'open',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Survey configurations table created successfully');

    // Create student survey entries table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS student_survey_entries (
        student_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        encrypted_name VARCHAR(255),
        iv VARCHAR(255),
        gender VARCHAR(50),
        gpa DOUBLE,
        commitment VARCHAR(50),
        survey_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Student survey entries table created successfully');

  } finally {
    connection.release();
  }
};

export const down = async () => {
  const connection = await pool.getConnection();
  try {
    await connection.query('DROP TABLE IF EXISTS student_survey_entries');
    await connection.query('DROP TABLE IF EXISTS survey_configurations');
    await connection.query('DROP TABLE IF EXISTS availability');
    console.log('✓ Tables dropped successfully');
  } finally {
    connection.release();
  }
};