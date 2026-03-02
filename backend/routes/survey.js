const express = require("express");
const { pool } = require("../db");

const router = express.Router();

router.post("/", async (req, res) => {
  const { gender, gpa } = req.body;

  if (!gender) {
    return res.status(400).json({ success: false, error: "Gender is required" });
  }

  const gpaNum = parseFloat(gpa ?? 2.0);
  if (isNaN(gpaNum) || gpaNum < 1.0 || gpaNum > 4.0) {
    return res.status(400).json({ success: false, error: "GPA must be 1.0–4.0" });
  }

  try {
    const [result] = await pool.execute(
      "INSERT INTO student_survey_entries (gender, gpa) VALUES (?, ?)",
      [gender, gpaNum]
    );

    console.log("Inserted ID:", result.insertId);

    res.status(201).json({
      success: true,
      student_id: result.insertId
    });

  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

module.exports = router;