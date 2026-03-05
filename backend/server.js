require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { pool } = require("./db.js"); 

const app = express();
app.use(cors());
app.use(express.json());

// Add this to server.js
app.get("/api/survey/stats/:surveyId", async (req, res) => {
    const { surveyId } = req.params;
    try {
        // 1. Fetch Configuration
        const [config] = await pool.execute(
            "SELECT class_size FROM survey_configurations WHERE id = ?", 
            [surveyId]
        );

        if (config.length === 0) {
            return res.status(404).json({ error: "Survey configuration not found" });
        }

        // 2. Fetch Students (Wrapped in a try-catch to identify if the survey_id column is missing)
        let students = [];
        try {
            const [studentRows] = await pool.execute(
                "SELECT name FROM student_survey_entries WHERE survey_id = ?", 
                [surveyId]
            );
            students = studentRows;
        } catch (dbErr) {
            console.error("Column missing or Table error:", dbErr.message);
            // Fallback so the front-end doesn't crash even if DB isn't perfect yet
            students = []; 
        }

        const classSize = config[0].class_size || 0;
        const submissions = students.length;
        const pending = Math.max(0, classSize - submissions);

        res.json({
            classSize,
            submissions,
            pending,
            // Safety: ensure map only runs if students exists
            studentList: students ? students.map(s => s.name) : []
        });

    } catch (err) {
        console.error("General Stats Error:", err.message);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});

app.post("/api/config/save-setup", async (req, res) => {
    console.log("POST request received at /api/config/save-setup");
    const { uniqueId, courseName, classSize, minSize, maxSize, useGpa, prevCourse } = req.body;

    try {
        await pool.execute(
            "INSERT INTO survey_configurations (id, course_name, class_size, min_size, max_size, use_gpa, prev_course) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [uniqueId, courseName, classSize, minSize, maxSize, useGpa, prevCourse || null]
        );
        console.log("Success: Saved to DB");
        res.status(201).json({ success: true });
    } catch (err) {
        console.error("Database Error:", err.message);
        res.status(500).json({ error: "DB Error", details: err.message });
    }
});


const teamRoutes = require("./routes/teams");
const surveyRoutes = require("./routes/survey");
app.use("/teams", teamRoutes);
app.use("/api/survey", surveyRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
    console.log(`Endpoint ready: http://localhost:${PORT}/api/config/save-setup`);
});