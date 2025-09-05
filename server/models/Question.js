import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  questionType: {
    type: String,
    required: true,
    enum: ['text', 'multiple-choice', 'checkboxes', 'dropdown'],
    default: 'text',
  },
  options: {
    type: [String],
    // Options are required only for specific question types
    required: function() {
      return ['multiple-choice', 'checkboxes', 'dropdown'].includes(this.questionType);
    },
  },
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);

export default Question;
