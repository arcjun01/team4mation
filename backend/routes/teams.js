const express = require("express");
const router = express.Router();
const grouper = require("./grouper.js");

router.post("/", (req, res) => {
  const studentData = req.body; 
  console.log("Data received from survey:", studentData);

  const teams = grouper();
  
  res.json({
    message: "Teams endpoint working",
    teams
  });
});

module.exports = router;