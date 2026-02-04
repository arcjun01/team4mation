// import express from 'express';

const express = require("express");
const router = express.Router();
const grouper = require("./grouper.js");

// For instructor
router.get("/", (req, res) => {
  console.log("Intructor's view after generating teams");

  const teams = grouper();

  res.json({
    message: "Instructor View: Here are the current teams",
    teams: teams
  })
})

// For students
router.post("/", (req, res) => {
  const studentData = req.body;
  console.log("Data received from survey:", studentData);

  const teams = grouper();

  res.json({
    message: "Student response recorded successfully",
  });
});

module.exports = router;