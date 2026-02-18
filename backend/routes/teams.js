const express = require("express");
const router = express.Router();
const grouper = require("./grouper.js");
const { pool } = require("../db.js"); 

// For instructor: This generates and shows the teams based on DB data
router.get("/", async (req, res) => {
    console.log("Instructor's view: Fetching students and generating teams...");

    try {
        const [rows] = await pool.execute("SELECT * FROM student_survey_entries");
        
        const teamSize = parseInt(req.query.teamSize) || 3;

        const teams = grouper(rows, teamSize);

        res.json({
            message: "Instructor View: Here are the current teams",
            studentCount: rows.length,
            teams: teams
        });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: "Failed to fetch students from database" });
    }
});

// For students: This just records the survey 
router.post("/", (req, res) => {
    const studentData = req.body;
    console.log("Data received from survey post:", studentData);
    res.json({
        message: "Student response recorded successfully",
    });
});

module.exports = router;