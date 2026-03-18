import express from "express";
import { grouper } from "./grouper.js";
import { pool } from "../db.js";

const router = express.Router();

router.get("/form", async (req, res) => {
    //const { surveyId } = req.params;
    const teamSize = parseInt(req.query.teamSize) || 3;

    try {
        const [studentRows] = await pool.execute("SELECT * FROM students");
        const [availabilityRows] = await pool.execute("SELECT * FROM availability");

        const teams = grouper(studentRows, availabilityRows, teamSize);

        res.json({
            teams: teams,
            studentCount: studentRows.length,
            teamSize: teamSize
        });

    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: "Failed to generate teams" });
    }
});

// For instructor: This generates and shows the teams based on DB data and survey config
router.get("/:surveyId", async (req, res) => {
    const { surveyId } = req.params;

    try {
        // 1. Fetch survey configuration
        const [configRows] = await pool.execute(
            "SELECT * FROM survey_configurations WHERE id = ?", 
            [surveyId]
        );

        if (configRows.length === 0) {
            return res.status(404).json({ error: "Survey configuration not found" });
        }

        const settings = configRows[0];

        // 2. Fetch students for this survey
        const [studentRows] = await pool.execute(
            "SELECT * FROM student_survey_entries WHERE survey_id = ?", 
            [surveyId]
        );

        // 3. Fetch availability data for all students
        const [availabilityRows] = await pool.execute(
            "SELECT * FROM availability"
        );

        // 4. Pass students, availability data, team_limit, and limit_type to grouper
        const teams = grouper(studentRows, availabilityRows, settings.team_limit, settings.limit_type); 

        res.json({
            message: `Teams generated for course: ${settings.course_name}`,
            studentCount: studentRows.length,
            config: {
                teamLimit: settings.team_limit,
                limitType: settings.limit_type
            },
            teams: teams
        });

    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: "Failed to generate teams" });
    }
});

export default router;