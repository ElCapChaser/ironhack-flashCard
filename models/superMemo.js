const mongoose = require('mongoose');

const superMemoSchema = new mongoose.Schema(
  {
    difficulty: {
      type: Number,
      min: 1,
      max: 5
    },
    eF: {
      type: Number,
      min: 1.3,
    },
    repetition: {
      type: Number
    },
    user: {
      type: mongoose.Types.ObjectId,
      refers: 'User'
    },
    card: {
      type: mongoose.Types.ObjectId,
      ref: 'Choicecard'
    }
  },
  {
    timestamps: {
      createdAt: 'creationDate',
      updatedAt: 'updateDate'
    }
  }
);

const Comment = mongoose.model('SuperMemo', superMemoSchema);
module.exports = SuperMemo;
