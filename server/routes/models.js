import express from 'express';
import { spawn } from 'child_process';
import PredictionModel from '../models/PredictionModel.js';

const router = express.Router();

// @desc    Train a new model
// @route   POST /api/models/train
// @access  Private/Admin
router.post('/train', async (req, res) => {
  const { name, modelType, parameters } = req.body;

  try {
    // Create a new model document to track the training process
    const newModel = new PredictionModel({
      name,
      modelType,
      parameters: parameters || {},
      status: 'training',
    });
    const savedModel = await newModel.save();

    // Spawn the Python training script
    const pythonProcess = spawn('python', [
      'server/scripts/train.py',
      savedModel._id.toString(),
      JSON.stringify({ modelType, ...parameters }),
    ]);

    pythonProcess.stderr.on('data', (data) => {
      // Log python errors for debugging
      console.error(`Python script error: ${data}`);
    });

    // We don't need to wait for the script to finish here.
    // The script will update the database on its own.

    // Respond immediately to the client
    res.status(202).json({
      message: 'Model training started.',
      model: savedModel,
    });

  } catch (error) {
    res.status(400).json({ message: 'Failed to start model training.', error: error.message });
  }
});

// @desc    Get all trained models
// @route   GET /api/models
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    const models = await PredictionModel.find({}).sort({ createdAt: -1 });
    res.json(models);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get a single model by ID
// @route   GET /api/models/:id
// @access  Private/Admin
router.get('/:id', async (req, res) => {
  try {
    const model = await PredictionModel.findById(req.params.id);
    if (model) {
      res.json(model);
    } else {
      res.status(404).json({ message: 'Model not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Delete a model
// @route   DELETE /api/models/:id
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
  try {
    const model = await PredictionModel.findById(req.params.id);
    if (model) {
      await model.deleteOne();
      res.json({ message: 'Model removed' });
    } else {
      res.status(404).json({ message: 'Model not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
