import express from 'express';

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Teams endpoint working",
    teams: []
  });
});

export default router;