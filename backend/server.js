import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./db.js";
import teamRoutes from "./routes/teams.js";
import surveyRoutes from "./routes/survey.js";
import configRoutes from "./routes/config.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- Static File Logic ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve the Vite build folder from the frontend directory
app.use(express.static("/frontend/dist"));
// --------------------------

// Routes
app.use("/api/teams", teamRoutes);
app.use("/api/survey", surveyRoutes);
app.use("/api/config", configRoutes);
app.use("/api/surveys", teamRoutes);

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

        const [submissions] = await pool.execute(
            "SELECT COUNT(*) as count FROM student_survey_entries WHERE survey_id = ?",
            [surveyId]
        );

        const classSize = config[0].class_size || 0;
        const status = config[0].status || 'open';
        const submissionCount = submissions[0].count || 0;
        const pending = Math.max(0, classSize - submissionCount);

        res.json({
            classSize,
            submissions: submissionCount,
            pending,
            status,
            studentList: []
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
            "SELECT course_name, use_gpa, prev_course, limit_type, team_limit FROM survey_configurations WHERE id = ?",
            [surveyId]
        );

        if (config.length === 0) {
            return res.status(404).json({ error: "Survey configuration not found" });
        }

        res.json({
            courseName: config[0].course_name,
            useGpa: config[0].use_gpa === 1,
            prevCourse: config[0].prev_course,
            limitType: config[0].limit_type,
            maxSize: config[0].team_limit
        });
    } catch (err) {
        console.error("Config Fetch Error:", err.message);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
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

// Purge Survey Data Endpoint
app.delete("/api/survey/purge/:id", async (req, res) => {
    const { id } = req.params;
    try {
        // Deletes all student entries to protect privacy
        const [studentResult] = await pool.execute(
            "DELETE FROM student_survey_entries WHERE survey_id = ?",
            [id]
        );
        
        // Deletes the survey configuration so it leaves the DB entirely
        const [configResult] = await pool.execute(
            "DELETE FROM survey_configurations WHERE id = ?",
            [id]
        );
        
        console.log(`Purge success: ${studentResult.affectedRows} entries and config for survey ${id} removed.`);
        res.json({ success: true, message: "Survey data and configuration successfully purged from the database." });
    } catch (err) {
        console.error("Purge Error:", err.message);
        res.status(500).json({ error: "Database error during purge", details: err.message });
    }
});


app.get("/{*path}", (req, res) => {
   res.sendFile("/frontend/dist/index.html");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
    console.log(`Endpoint ready: http://localhost:${PORT}/api/config/save-setup`);
});
