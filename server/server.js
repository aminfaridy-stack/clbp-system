import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import questionnaireRoutes from './routes/questionnaires.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json()); // for parsing JSON

// Sample route for API
app.get('/api/data', (req, res) => {
  res.json({ message: 'Data from backend', data: [1, 2, 3] });
});

app.use('/api/questionnaires', questionnaireRoutes);

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});