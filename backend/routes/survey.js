import express from 'express';
import { pool } from '../db.js'; 

const router = express.Router();


router.post("/", async (req, res) => {
  const { gender } = req.body;

  try {
    const [result] = await pool.execute(
      "INSERT INTO survey_responses (gender) VALUES (?)",
      [gender]
    );

    console.log("New survey response saved with ID:", result.insertId);
    
    res.status(201).json({ 
      success: true, 
      message: "Survey submitted!", 
      id: result.insertId 
    });
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

export default router;