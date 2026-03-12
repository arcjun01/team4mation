const express = require('express');
const router = express.Router();
const { pool } = require('../db.js');


router.post("/save-setup", async (req, res) => {
  const { uniqueId, courseName, classSize, minSize, maxSize, useGpa, prevCourse } = req.body;
  
  try {
    await pool.execute(
      "INSERT INTO survey_configurations (id, course_name, class_size, min_size, max_size, use_gpa, prev_course) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [uniqueId, courseName, classSize, minSize, maxSize, useGpa, prevCourse || null]
    );
    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;