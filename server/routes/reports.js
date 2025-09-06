import express from 'express';
import Questionnaire from '../models/Questionnaire.js';
import Question from '../models/Question.js';

// We would also import Patient and Assessment models if they existed.
// Since they don't, we will return mock data for now.

const router = express.Router();

// A helper function to convert JSON to CSV
const jsonToCsv = (jsonData) => {
  if (!jsonData || jsonData.length === 0) {
    return '';
  }
  const keys = Object.keys(jsonData[0]);
  const header = keys.join(',');
  const rows = jsonData.map(row => {
    return keys.map(key => {
      // Handle commas and quotes in data
      let value = row[key] === null || row[key] === undefined ? '' : String(row[key]);
      if (value.includes(',')) {
        value = `"${value}"`;
      }
      return value;
    }).join(',');
  });
  return [header, ...rows].join('\n');
};


// @desc    Get detailed data report
// @route   GET /api/reports/detailed-data
// @access  Private/Admin
router.get('/detailed-data', async (req, res) => {
  try {
    const questionnaires = await Questionnaire.find({}).populate('questions');

    const flattenedData = [];
    questionnaires.forEach(q => {
      q.questions.forEach(question => {
        flattenedData.push({
          questionnaire_id: q._id,
          questionnaire_title: q.title,
          question_id: question._id,
          question_text: question.text,
          question_type: question.questionType,
          question_options: question.options.join('; '), // Join options with a semicolon
        });
      });
    });

    const csvData = jsonToCsv(flattenedData);

    res.header('Content-Type', 'text/csv');
    res.attachment('questionnaire_data_report.csv');
    res.send(csvData);

  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
