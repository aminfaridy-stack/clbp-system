import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import questionnaireRoutes from './routes/questionnaires.js';
import settingsRoutes from './routes/settings.js';
import reportsRoutes from './routes/reports.js';
import Setting from './models/Setting.js';

// Load env vars
dotenv.config();

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Seed initial settings
    await Setting.seedInitialSettings();

    const app = express();
    const port = process.env.PORT || 3001;

    app.use(express.json()); // for parsing JSON

    // API Routes
    app.use('/api/questionnaires', questionnaireRoutes);
    app.use('/api/settings', settingsRoutes);
    app.use('/api/reports', reportsRoutes);

    // Sample route for API (can be removed later)
    app.get('/api/data', (req, res) => {
      res.json({ message: 'Data from backend', data: [1, 2, 3] });
    });

    app.listen(port, () => {
      console.log(`Backend server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();