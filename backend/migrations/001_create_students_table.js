import { pool } from '../db.js';

export const up = async () => {
  const connection = await pool.getConnection();
  try {
    // Create students table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS students (
        student_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255),
        gender VARCHAR(50),
        gpa DOUBLE,
        commitment VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Students table created successfully');

    // Create availability table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS availability (
        student_id INT(11) NOT NULL,
        day_of_week ENUM('MON','TUE','WED','THU','FRI','SAT','SUN') NOT NULL,
        time_slot VARCHAR(20) NOT NULL,
        PRIMARY KEY (student_id, day_of_week, time_slot),
        FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Availability table created successfully');

  } finally {
    connection.release();
  }
};

export const down = async () => {
  const connection = await pool.getConnection();
  try {
    await connection.query('DROP TABLE IF EXISTS availability');
    await connection.query('DROP TABLE IF EXISTS students');
    console.log('✓ Tables dropped successfully');
  } finally {
    connection.release();
  }
};