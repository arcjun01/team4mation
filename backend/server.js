require("dotenv").config();

const express = require("express");
const cors = require("cors");
const teamRoutes = require("./routes/teams");

const app = express();

app.use("/teams", teamRoutes);

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
