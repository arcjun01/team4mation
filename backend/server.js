import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import teamRoutes from "./routes/teams.js";
import surveyRoutes from "./routes/survey.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/teams", teamRoutes);
app.use("/api/survey", surveyRoutes);

// Survey Stats Endpoint
app.get("/api/survey/stats/:surveyId", async (req, res) => {
    const { surveyId } = req.params;
    try {
        const [config] = await pool.execute(
            "SELECT class_size, status FROM survey_configurations WHERE id = ?",
            [surveyId]
        );

        if (config.length === 0) {
            return res.status(404).json({ error: "Survey configuration not found" });
        }

        const [students] = await pool.execute(
            "SELECT full_name FROM students LIMIT ?",
            [config[0].class_size || 100]
        );

        const classSize = config[0].class_size || 0;
        const status = config[0].status || 'open';
        const submissions = students.length;
        const pending = Math.max(0, classSize - submissions);

        res.json({
            classSize,
            submissions,
            pending,
            status,
            studentList: students ? students.map(s => s.full_name) : []
        });
    } catch (err) {
        console.error("Stats Error:", err.message);
        res.status(500).json({ error: "Database error", studentList: [] });
    }
});

// Get Survey Configuration Endpoint
app.get("/api/config/:surveyId", async (req, res) => {
    const { surveyId } = req.params;
    try {
        const [config] = await pool.execute(
            "SELECT course_name, use_gpa, prev_course FROM survey_configurations WHERE id = ?",
            [surveyId]
        );

        if (config.length === 0) {
            return res.status(404).json({ error: "Survey configuration not found" });
        }

        res.json({
            courseName: config[0].course_name,
            useGpa: config[0].use_gpa === 1,
            prevCourse: config[0].prev_course
        });
    } catch (err) {
        console.error("Config Fetch Error:", err.message);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});

// Config Save Endpoint
app.post("/api/config/save-setup", async (req, res) => {
    console.log("POST request received at /api/config/save-setup");

    const { uniqueId, courseName, classSize, minSize, maxSize, useGpa, prevCourse, encryptionSalt } = req.body;

    try {
        await pool.execute(
            "INSERT INTO survey_configurations (id, course_name, class_size, min_size, max_size, use_gpa, prev_course, encryption_salt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [uniqueId, courseName, classSize, minSize, maxSize, useGpa, prevCourse || null, encryptionSalt || null]
        );
        console.log("Success: Saved to DB");
        res.status(201).json({ success: true });
    } catch (err) {
        console.error("Database Error:", err.message);
        res.status(500).json({ error: "DB Error", details: err.message });
    }
});

// Close Survey Endpoint
app.patch("/api/survey/close/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.execute(
            "UPDATE survey_configurations SET status = 'closed' WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Survey not found" });
        }

        res.json({ success: true, message: "Survey successfully closed" });
    } catch (err) {
        console.error("Database Error:", err.message);
        res.status(500).json({ error: "DB Error", details: err.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
    console.log(`Endpoint ready: http://localhost:${PORT}/api/config/save-setup`);
});