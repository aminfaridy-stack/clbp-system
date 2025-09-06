import express from 'express';

const router = express.Router();

// Mock data for different train-test splits
const modelPerformanceData = {
  '80:20': { accuracy: 0.94, f1: 0.88, auc: 0.96, precision: 0.91, recall: 0.85 },
  '70:30': { accuracy: 0.92, f1: 0.86, auc: 0.94, precision: 0.89, recall: 0.83 },
  '60:40': { accuracy: 0.89, f1: 0.83, auc: 0.91, precision: 0.86, recall: 0.80 },
};

// @desc    Get data for charts
// @route   GET /api/data
// @access  Private/Admin
router.get('/', (req, res) => {
  const { split = '80:20' } = req.query; // Default to 80:20 split

  const data = modelPerformanceData[split];

  if (data) {
    res.json(data);
  } else {
    // Return default data if the split is invalid
    res.status(400).json({ message: 'Invalid split ratio. Use 80:20, 70:30, or 60:40.' });
  }
});

export default router;
