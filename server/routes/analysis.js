import express from 'express';
import { spawn } from 'child_process';

const router = express.Router();

// @desc    Analyze a data file
// @route   POST /api/analysis
// @access  Private/Admin
router.post('/', (req, res) => {
  const { filePath } = req.body;

  if (!filePath) {
    return res.status(400).json({ message: 'No file path provided.' });
  }

  const pythonProcess = spawn('python', ['server/scripts/analyze.py', filePath]);

  let output = '';
  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  let errorOutput = '';
  pythonProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).json({ message: 'Failed to analyze data.', error: errorOutput });
    }
    try {
      const results = JSON.parse(output);
      res.json(results);
    } catch (e) {
      res.status(500).json({ message: 'Failed to parse analysis results.', error: output });
    }
  });
});

export default router;
