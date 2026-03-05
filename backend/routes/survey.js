const express = require('express');
const { pool } = require('../db.js');

const router = express.Router();

router.post("/", async (req, res) => {
  const { gender, gpa, availability_schedule } = req.body;

  if (!gender) {
    return res.status(400).json({ success: false, error: "Gender is required" });
  }

  const gpaNum = parseFloat(gpa ?? 2.0);
  if (isNaN(gpaNum) || gpaNum < 1.0 || gpaNum > 4.0) {
    return res.status(400).json({ success: false, error: "GPA must be 1.0–4.0" });
  }

  if (!availability_schedule) {
    return res.status(400).json({ success: false, error: "Availability schedule is required" });
  }

  const connection = await pool.getConnection();
  try {
    // Begin transaction
    await connection.beginTransaction();

    // Insert student record
    const [result] = await connection.execute(
      "INSERT INTO students (gender, gpa) VALUES (?, ?)",
      [gender, gpaNum]
    );

    const studentId = result.insertId;
    console.log("Inserted student ID:", studentId);

    // Parse availability schedule and insert into availability table
    const availabilityData = JSON.parse(availability_schedule);
    const insertPromises = [];

    for (const [key, isSelected] of Object.entries(availabilityData)) {
      if (isSelected) {
        const [dayOfWeek, timeSlot] = key.split("-");
        insertPromises.push(
          connection.execute(
            "INSERT INTO availability (student_id, day_of_week, time_slot) VALUES (?, ?, ?)",
            [studentId, dayOfWeek, timeSlot]
          )
        );
      }
    }

    // Execute all availability inserts
    if (insertPromises.length > 0) {
      await Promise.all(insertPromises);
    }

    // Commit transaction
    await connection.commit();

    res.status(201).json({
      success: true,
      student_id: studentId
    });

  } catch (err) {
    // Rollback on error
    await connection.rollback();
    console.error("Database Error:", err);
    res.status(500).json({ success: false, error: "Database error" });
  } finally {
    connection.release();
  }
});

module.exports = router;