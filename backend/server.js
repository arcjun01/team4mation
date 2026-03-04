require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { pool } = require("./db.js"); 

const app = express();
app.use(cors());
app.use(express.json());


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