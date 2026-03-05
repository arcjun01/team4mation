import express from "express";
import grouper from "./grouper.js";
import { pool } from "../db.js";

const router = express.Router();

// For instructor: This generates and shows the teams based on DB data and survey config
router.get("/:surveyId", async (req, res) => {
    const { surveyId } = req.params;
    console.log(`Instructor's view: Fetching data for Survey ID: ${surveyId}`);

    try {
        // 1. Get the settings for THIS specific survey from the new table
        const [configRows] = await pool.execute(
            "SELECT * FROM survey_configurations WHERE id = ?", 
            [surveyId]
        );

        // Check if the survey exists
        if (configRows.length === 0) {
            return res.status(404).json({ error: "Survey configuration not found" });
        }

        const settings = configRows[0];

        // 2. Get students who responded to surveys
        // Note: Currently pulls all students. Your team will eventually filter by survey_id.
        const [studentRows] = await pool.execute("SELECT * FROM student_survey_entries");

        // 3. Pass real DB settings (max_size) into the grouper
        // We use settings.max_size which comes from your InstructorSetup form
        const teams = grouper(studentRows, settings.max_size); 

        res.json({
            message: `Teams generated for course: ${settings.course_name}`,
            studentCount: studentRows.length,
            config: {
                maxSize: settings.max_size,
                minSize: settings.min_size,
                useGpa: settings.use_gpa
            },
            teams: teams
        });
        
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: "Failed to generate teams from database data" });
    }
});

// For students: This just records the survey 
router.post("/", (req, res) => {
  const studentData = req.body;
  console.log("Data received from survey:", studentData);

  const teams = grouper();

  res.status(201).json({ message: "Student response recorded successfully" });
});

export default router;