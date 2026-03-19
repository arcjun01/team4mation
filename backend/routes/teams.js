import express from "express";
import { grouper } from "./grouper.js";
import { pool } from "../db.js";

const router = express.Router();

// Endpoint to fetch all open surveys
router.get("/open", async (req, res) => {
    try {
        const [surveys] = await pool.execute(
            "SELECT id, course_name, class_size, team_limit, limit_type, status FROM survey_configurations WHERE status = 'open' ORDER BY created_at DESC"
        );
        
        res.json({
            surveys: surveys || [],
            count: surveys.length
        });
    } catch (err) {
        console.error("Error fetching open surveys:", err);
        res.status(500).json({ error: "Failed to fetch surveys" });
    }
});

// Endpoint to fetch all students and their availability for a survey (no decryption needed)
router.get("/:surveyId/submissions", async (req, res) => {
    const { surveyId } = req.params;

    try {
        // Fetch all students for this survey
        const [students] = await pool.execute(
            "SELECT student_id, gender, gpa, commitment FROM student_survey_entries WHERE survey_id = ? ORDER BY student_id ASC",
            [surveyId]
        );

        console.log(`\n📋 Fetching submissions for survey ${surveyId}:`);
        console.log(`   Students found: ${students.length}`);
        if (students.length > 0) {
            console.log(`   First 3 student IDs:`, students.slice(0, 3).map(s => (`${s.student_id} (type: ${typeof s.student_id})`)));
        }

        if (students.length === 0) {
            return res.json({
                students: [],
                availabilityMap: {},
                count: 0
            });
        }

        // Fetch availability data for all students in this survey
        const [availability] = await pool.execute(
            "SELECT a.* FROM availability a INNER JOIN student_survey_entries se ON a.student_id = se.student_id WHERE se.survey_id = ? ORDER BY a.student_id ASC",
            [surveyId]
        );

        console.log(`   Availability slots found: ${availability.length}`);
        if (availability.length > 0) {
            console.log(`   First 3 availability student IDs:`, availability.slice(0, 3).map(a => (`${a.student_id} (type: ${typeof a.student_id})`)));
        }

        // Build availability map
        const availabilityMap = {};
        for (const slot of availability) {
            const key = slot.student_id;
            if (!availabilityMap[key]) {
                availabilityMap[key] = [];
            }
            availabilityMap[key].push(`${slot.day_of_week}-${slot.time_slot}`);
        }

        res.json({
            students: students,
            availabilityMap: availabilityMap,
            count: students.length
        });
    } catch (err) {
        console.error("Error fetching submissions:", err);
        res.status(500).json({ error: "Failed to fetch submissions" });
    }
});

// Debug endpoint to check availability data and student entries
router.get("/debug/data", async (req, res) => {
    try {
        const [students] = await pool.execute("SELECT student_id, gender, gpa, survey_id FROM student_survey_entries LIMIT 5");
        const [availability] = await pool.execute("SELECT * FROM availability LIMIT 10");
        
        res.json({
            students: {
                count: students.length,
                data: students
            },
            availability: {
                count: availability.length,
                data: availability
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Debug endpoint to populate test availability data
router.post("/debug/seed-availability", async (req, res) => {
    try {
        // Get all students with survey entries
        const [students] = await pool.execute(
            "SELECT DISTINCT se.student_id FROM student_survey_entries se"
        );

        if (students.length === 0) {
            return res.json({ message: "No student survey entries found" });
        }

        // Sample availability data
        const sampleSlots = [
            { day: "MON", time: "9 AM" },
            { day: "MON", time: "1 PM" },
            { day: "TUE", time: "10 AM" },
            { day: "TUE", time: "2 PM" },
            { day: "WED", time: "9 AM" },
            { day: "THU", time: "11 AM" },
            { day: "FRI", time: "10 AM" }
        ];

        let inserted = 0;
        for (const student of students) {
            const studentId = student.student_id;
            // Assign random subset of slots to each student
            const numSlots = Math.floor(Math.random() * 4) + 2;
            const selectedSlots = sampleSlots.sort(() => 0.5 - Math.random()).slice(0, numSlots);
            
            for (const slot of selectedSlots) {
                await pool.execute(
                    "INSERT IGNORE INTO availability (student_id, day_of_week, time_slot) VALUES (?, ?, ?)",
                    [studentId, slot.day, slot.time]
                );
                inserted++;
            }
        }

        res.json({
            message: "Test availability data seeded",
            studentsProcessed: students.length,
            recordsInserted: inserted
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

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

// Debug endpoint to check availability data in DB
router.get("/debug/availability/:surveyId", async (req, res) => {
    const { surveyId } = req.params;
    try {
        // Get students for this survey
        const [students] = await pool.execute(
            "SELECT student_id FROM student_survey_entries WHERE survey_id = ? LIMIT 10",
            [surveyId]
        );

        // Get availability for these students
        const [availability] = await pool.execute(
            "SELECT * FROM availability a INNER JOIN student_survey_entries se ON a.student_id = se.student_id WHERE se.survey_id = ? LIMIT 20",
            [surveyId]
        );

        // Check if ANY availability exists for these student IDs
        let allAvailability = [];
        if (students.length > 0) {
            const studentIds = students.map(s => s.student_id);
            const [check] = await pool.execute(
                `SELECT * FROM availability WHERE student_id IN (${studentIds.join(',')}) LIMIT 30`
            );
            allAvailability = check;
        }

        res.json({
            surveyId,
            studentCount: students.length,
            studentIds: students.map(s => s.student_id),
            availabilityViaJoin: {
                count: availability.length,
                sample: availability.slice(0, 5)
            },
            allAvailabilityForStudents: {
                count: allAvailability.length,
                sample: allAvailability.slice(0, 5)
            }
        });
    } catch (err) {
        console.error("Debug error:", err);
        res.status(500).json({ error: err.message });
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

        // 3. Fetch availability data only for students in this survey
        const [availabilityRows] = await pool.execute(
            "SELECT a.* FROM availability a INNER JOIN student_survey_entries se ON a.student_id = se.student_id WHERE se.survey_id = ?",
            [surveyId]
        );

        console.log(`\n=== AVAILABILITY DEBUG for Survey ${surveyId} ===`);
        console.log(`Total students in survey: ${studentRows.length}`);
        console.log(`Total availability records found: ${availabilityRows.length}`);
        if (availabilityRows.length === 0) {
            console.log("⚠️  WARNING: No availability data found for this survey!");
            console.log("Checking if availability table has any data for these student IDs...");
            const studentIds = studentRows.map(s => s.student_id);
            console.log(`Student IDs in survey: ${studentIds.slice(0, 5).join(', ')}${studentIds.length > 5 ? '...' : ''}`);
        }

        // 4. Pass settings to grouper
        // We pass team_limit and limit_type so the algorithm knows the instructor's choice
        const teams = grouper(studentRows, availabilityRows, settings.team_limit, settings.limit_type); 

        // Build availability map for frontend
        const availabilityMap = {};
        for (const availability of availabilityRows) {
            const key = availability.student_id;
            if (!availabilityMap[key]) {
                availabilityMap[key] = [];
            }
            availabilityMap[key].push(`${availability.day_of_week}-${availability.time_slot}`);
        }

        console.log(`Availability map keys: ${Object.keys(availabilityMap).slice(0, 5).join(', ')}${Object.keys(availabilityMap).length > 5 ? '...' : ''}`);
        console.log(`=== END DEBUG ===\n`);

        res.json({
            message: `Teams generated for course: ${settings.course_name}`,
            studentCount: studentRows.length,
            config: {
                teamLimit: settings.team_limit,
                limitType: settings.limit_type
            },
            teams: teams,
            availabilityMap: availabilityMap
        });

    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: "Failed to generate teams" });
    }
});

export default router;