require("dotenv").config();

const express = require("express");
const cors = require("cors");
const teamRoutes = require("./routes/teams");

const app = express();

app.use(cors());

app.use(express.json());

// Routes
app.use("/teams", teamRoutes);
//app.use("/api/survey", surveyRoutes);

console.log("Using database:", process.env.DB_NAME);


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});