const express = require('express');
const { pool } = require('../db.js');
const crypto = require('crypto');

const router = express.Router();

const algorithm = 'aes-256-cbc';
// This is the finalized 32-character key
const secretKey = Buffer.from('vperysecretkey32charcheckdigital', 'utf8');

router.post("/", async (req, res) => {
  const { fullName, survey_id } = req.body;
  const gender = req.body.gender || "Not Provided";
  const gpaNum = parseFloat(req.body.gpa || 0.0);

  // Generate a unique IV for EVERY submission to ensure security
  const iv = crypto.randomBytes(16);

  if (!fullName) {
    return res.status(400).json({ success: false, error: "Full name is required" });
  }

  try {
    console.log("--- Incoming Submission ---");
    console.log("Plain-text Name:", fullName);
    console.log("Target Survey ID:", survey_id);

    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encryptedName = cipher.update(fullName, 'utf8', 'hex');
    encryptedName += cipher.final('hex');
    const ivHex = iv.toString('hex');

    const [result] = await pool.execute(
      "INSERT INTO student_survey_entries (encrypted_name, iv, gender, gpa, survey_id) VALUES (?, ?, ?, ?, ?)",
      [encryptedName, ivHex, gender, gpaNum, survey_id]
    );

    console.log("New survey response saved with id:", result.insertId);

    res.status(201).json({
      success: true,
      message: "Survey submitted!",
      student_id: result.insertId 
    });
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

router.post("/reveal", async (req, res) => {
  // Destructuring updated to match your frontend: decryptionKey and surveyId
  const { decryptionKey, surveyId } = req.body;

  // Updated to match your current 32-character key
  if (decryptionKey !== 'vperysecretkey32charcheckdigital') {
    return res.status(401).json({ success: false, error: "Invalid Decryption Key" });
  }

  try {
    // Filter by surveyId so instructors only see their specific students
    const [rows] = await pool.execute(
      "SELECT encrypted_name, iv, gender, gpa FROM student_survey_entries WHERE survey_id = ?", 
      [surveyId]
    );

    const decryptedResults = rows.map(row => {
      try {
        const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(row.iv, 'hex'));
        let decrypted = decipher.update(row.encrypted_name, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return {
          name: decrypted,
          gender: row.gender,
          gpa: row.gpa
        };
      } catch (decryptionError) {
        console.error("Row decryption failed:", decryptionError);
        return { name: "Error Decrypting", gender: row.gender, gpa: row.gpa };
      }
    });

    // Logging the results to the terminal for verification
    console.log(`--- Decrypted Results for Survey ID: ${surveyId} ---`);
    console.table(decryptedResults);

    res.json({ success: true, names: decryptedResults });
  } catch (err) {
    console.error("Decryption Route Error:", err);
    res.status(500).json({ success: false, error: "Failed to decrypt names" });
  }
});

module.exports = router;