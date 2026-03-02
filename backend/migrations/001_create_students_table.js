import { pool } from '../db.js';

export const up = async () => {
  const connection = await pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS students (
        student_id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        gender VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        gpa DOUBLE,
        availability_schedule VARCHAR(255)
      )
    `);
    console.log('✓ Students table created successfully');
  } finally {
    connection.release();
  }
};

export const down = async () => {
  const connection = await pool.getConnection();
  try {
    await connection.query('DROP TABLE IF EXISTS students');
    console.log('✓ Students table dropped successfully');
  } finally {
    connection.release();
  }
};
