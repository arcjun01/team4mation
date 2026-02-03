import express from 'express';

const express = require("express");
const router = express.Router();
const grouper = require("./grouper.js");

router.get("/", (req, res) => {
  const teams = grouper();
  console.log("hit")
  res.json({
    message: "Teams endpoint working",
    teams
  });
});

module.exports = router;