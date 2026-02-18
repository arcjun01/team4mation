const express = require('express');
const { pool } = require('../db.js');

const router = express.Router();

router.post("/", async (req, res) => {
  const { gender } = req.body;

  if (!gender) {
    return res.status(400).json({ success: false, error: "Gender is required" });
  }

  try {
    // Correct table name
    const [result] = await pool.execute(
      "INSERT INTO student_survey_entries (gender) VALUES (?)",
      [gender]
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

module.exports = router;