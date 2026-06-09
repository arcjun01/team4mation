import express from 'express';
const router = express.Router();
import { pool } from '../db.js';

router.post("/save-setup", async (req, res) => {
  const { 
    uniqueId, courseName, description, classSize, teamLimit, 
    limitType, useGpa, prevCourse, encryptionSalt, availabilityOptional,
    instructorEmail
  } = req.body;

  try {
    await pool.execute(
      `INSERT INTO survey_configurations 
      (id, course_name, description, class_size, team_limit, limit_type, use_gpa, prev_course, encryption_salt, availability_optional, instructor_email) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uniqueId ?? null,
        courseName ?? null,
        description ?? null,
        classSize ?? null,
        teamLimit ?? null,
        limitType ?? "Maximum",
        useGpa ?? 0,
        prevCourse ?? null,
        encryptionSalt ?? null,
        availabilityOptional ?? 0,
        instructorEmail ?? null,
      ]
    );

    res.status(201).json({ success: true });
  } catch (err) {
    console.error("Database Error:", err.message);
    res.status(500).json({ error: "DB Error", details: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM survey_configurations WHERE id = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Config not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Database Error:", err.message);
    res.status(500).json({ error: "DB Error", details: err.message });
  }
});

router.patch("/close/:id", async (req, res) => {
  const { id } = req.params;
  try{
    await pool.execute(
      `UPDATE survey_configurations SET status = 'closed' WHERE id = ? `,
      [id]
    );
    res.json({ success: true, message: "Survey closed Successfully"})
  } catch (err){
    console.error("Database Error: ", err.message);
    res.status(500).json({ error: "DB Error", details: err.message })
  }
});

export default router; 
