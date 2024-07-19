const mongoose = require('mongoose');

const mcqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  correctAnswerIndex: {
    type: Number,
    required: true
  }
});

const moduleSchema = new mongoose.Schema({
  file: {
    type: String,
    required: true
  },
  mcqs: [mcqSchema]
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  modules: [moduleSchema]
});

module.exports = mongoose.model('Course', courseSchema);
