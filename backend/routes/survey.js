import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.post("/", async (req, res) => {
  const { gender, gpa } = req.body;

  if (!gender) {
    return res.status(400).json({ success: false, error: "Gender is required" });
  }

  const gpaNum = parseFloat(gpa ?? 2.0);
  if (isNaN(gpaNum) || gpaNum < 1.0 || gpaNum > 4.0) {
    return res.status(400).json({ success: false, error: "GPA must be a number between 1.0 and 4.0" });
  }

  try {
    // Correct table name
    const [result] = await pool.execute(
      "INSERT INTO student_survey_entries (gender, gpa) VALUES (?, ?)",
      [gender, gpaNum]
    );

    console.log("New survey response saved with student_id:", result.insertId);

    res.status(201).json({
      success: true,
      message: "Survey submitted!",
      student_id: result.insertId // return the generated student_id
    });
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

export default router;