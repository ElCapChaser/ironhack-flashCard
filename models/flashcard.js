'use strict';

const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema(
  {
    questionTitle: {
      type: String,
      trim: true,
      max: 50,
      required: true
    },
    questionDescription: {
      type: String,
      trim: true,
      max: 140
    },
    questionImage: {
      type: String
    },
    solution: {
      type: String,
      trim: true,
      max: 140,
      required: true
    },
    solutionImage: {
      type: String
    },
    // For multiple choice set-up
    // answers: [{
    //     message: String,
    //     correct: Boolean
    // }],
    topic: {
      type: String,
      required: true,
      enum: [
        'Javascript - Basic Logic',
        'Javascript - Object Oriented Programming',
        'Javascript - Syntax',
        'HTML',
        'CSS',
        'Node',
        'Node - Express',
        'MongoDB - Queries',
        'Templating',
        'Deployment',
        'Git'
      ]
    },
    module: {
      type: String,
      enum: ['Module 1', 'Module 2', 'Module 3']
    },
    difficulty: {
      type: Number,
      required: true,
      min: 0,
      max: 10
    },
    upvotes: {
      type: Number,
      default: 0,
      min: 0
    },
    errorvotes: {
      type: Number,
      default: 0,
      min: 0
    },
    creator: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: {
      createdAt: 'creationDate',
      updatedAt: 'updateDate'
    }
  }
);

const Flashcard = mongoose.model('Flashcard', flashcardSchema);
module.exports = Flashcard;
