import mongoose from 'mongoose';

const predictionModelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  modelType: {
    type: String,
    required: true,
    enum: ['DecisionTree', 'RandomForest', 'GradientBoosting', 'LogisticRegression', 'SVM']
  },
  parameters: {
    type: Map,
    of: String
  },
  status: {
    type: String,
    required: true,
    enum: ['training', 'completed', 'failed'],
    default: 'training'
  },
  performance: {
    accuracy: { type: Number },
    auc: { type: Number }
  },
  modelData: {
    type: Buffer
  },
  trainedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const PredictionModel = mongoose.model('PredictionModel', predictionModelSchema);

export default PredictionModel;
