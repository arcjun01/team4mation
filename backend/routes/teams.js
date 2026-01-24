const express = require("express");
const router = express.Router();


router.get("/", (req, res) => {
  res.json({
    message: "Teams endpoint working",
    teams: []
  });
});

module.exports = router;
