import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import questionnaireRoutes from './routes/questionnaires.js';
import settingsRoutes from './routes/settings.js';
import reportsRoutes from './routes/reports.js';
import userRoutes from './routes/users.js';
import predictRoutes from './routes/predict.js';
import dataRoutes from './routes/data.js';
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
    app.use('/api/users', userRoutes);
    app.use('/api/predict', predictRoutes);
    app.use('/api/data', dataRoutes);

    app.listen(port, () => {
      console.log(`Backend server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();