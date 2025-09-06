import express from 'express';
import Assessment from '../models/Assessment.js';

const router = express.Router();

// @desc    Get assessments by patient ID
// @route   GET /api/assessments/patient/:patientId
// @access  Private
router.get('/patient/:patientId', async (req, res) => {
  try {
    const assessments = await Assessment.find({ patientId: req.params.patientId })
      .populate({
        path: 'questionnaireId',
        select: 'title description questions',
        populate: {
          path: 'questions',
          model: 'Question',
        },
      })
      .populate({
        path: 'responses.questionId',
        model: 'Question',
        select: 'text',
      })
      .sort({ createdAt: -1 });

    if (!assessments) {
      return res.status(404).json({ message: 'No assessments found for this patient' });
    }

    res.json(assessments);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
