import express from 'express';
import { pool } from '../db.js';
import crypto from 'crypto';

const router = express.Router();

const algorithm = 'aes-256-cbc';
router.post("/", async (req, res) => {
  const { fullName, survey_id, gender, gpa, availability_schedule } = req.body;

  if (!fullName) {
    return res.status(400).json({ success: false, error: "Full name is required" });
  }

  const gpaNum = parseFloat(gpa ?? 2.0);
  if (isNaN(gpaNum) || gpaNum < 1.0 || gpaNum > 4.0) {
    return res.status(400).json({ success: false, error: "GPA must be between 1.0 and 4.0" });
  }

  if (!availability_schedule) {
    return res.status(400).json({ success: false, error: "Availability schedule is required" });
  }

  let connection;

  try {
    connection = await pool.getConnection();

    // Fetch the encryption_salt for this specific survey
    const [config] = await connection.execute(
        "SELECT encryption_salt FROM survey_configurations WHERE id = ?",
        [survey_id]
    );

    if (!config.length || !config[0].encryption_salt) {
        return res.status(400).json({ success: false, error: "Survey configuration or encryption salt not found" });
    }

    // Use the salt stored in the DB as the encryption key
    const currentSecretKey = Buffer.from(config[0].encryption_salt.substring(0, 32), 'utf8');

    console.log("--- Incoming Submission ---");
    console.log("Plain-text Name:", fullName);
    console.log("Target Survey ID:", survey_id);

    // Encrypt name with unique IV
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, currentSecretKey, iv);

    let encryptedName = cipher.update(fullName, "utf8", "hex");
    encryptedName += cipher.final("hex");
    const ivHex = iv.toString("hex");

    await connection.beginTransaction();

    // Insert survey submission
    const [result] = await connection.execute(
      "INSERT INTO student_survey_entries (encrypted_name, iv, gender, gpa, survey_id) VALUES (?, ?, ?, ?, ?)",
      [encryptedName, ivHex, gender, gpaNum, survey_id]
    );

    const studentId = result.insertId;
    console.log("New survey response saved with id:", studentId);

    // Parse availability (with safety)
    let availabilityData = {};
    try {
      availabilityData = JSON.parse(availability_schedule);
    } catch {
      return res.status(400).json({
        success: false,
        error: "Invalid availability schedule format"
      });
    }

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

    if (insertPromises.length > 0) {
      await Promise.all(insertPromises);
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Survey submitted!",
      student_id: studentId
    });

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error("Submission error:", error);

    res.status(500).json({
      success: false,
      message: "Error submitting survey"
    });

  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// Decryption endpoint
router.post("/reveal", async (req, res) => {
  const { decryptionKey, surveyId } = req.body;

  // Validate key length (must be 32 chars for aes-256)
  if (!decryptionKey || decryptionKey.length !== 32) {
    return res.status(401).json({ success: false, error: "Invalid Decryption Key Length" });
  }

  try {
    const [rows] = await pool.execute(
      "SELECT encrypted_name, iv, gender, gpa FROM student_survey_entries WHERE survey_id = ?",
      [surveyId]
    );

    // Convert the instructor's key into a Buffer
    const instructorKey = Buffer.from(decryptionKey, 'utf8');

    const decryptedResults = rows.map(row => {
      try {
        const decipher = crypto.createDecipheriv(
          algorithm,
          instructorKey,
          Buffer.from(row.iv, 'hex')
        );

        let decrypted = decipher.update(row.encrypted_name, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return {
          name: decrypted,
          gender: row.gender,
          gpa: row.gpa
        };
      } catch (decryptionError) {
        console.error("Row decryption failed:", decryptionError);
        return { name: "Invalid Key/Decryption Failed", gender: row.gender, gpa: row.gpa };
      }
    });

    console.log(`--- Decrypted Results for Survey ID: ${surveyId} ---`);
    console.table(decryptedResults);

    res.json({ success: true, names: decryptedResults });

  } catch (err) {
    console.error("Decryption Route Error:", err);
    res.status(500).json({ success: false, error: "Failed to decrypt names" });
  }
});

export default router;