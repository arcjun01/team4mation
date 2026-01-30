import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import surveyRoutes from './routes/survey.js';
import teamRoutes from './routes/teams.js'; 

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/teams", teamRoutes);
app.use("/api/survey", surveyRoutes); 

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});