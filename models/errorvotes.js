'use strict';

const mongoose = require('mongoose');

const errrorVotesSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },
    choicecard: {
      type: mongoose.Types.ObjectId,
      ref: 'Choicecard'
    },
    errorVote: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: {
      createdAt: 'creationDate',
      updatedAt: 'updateDate'
    }
  }
);

const ErrorVotes = mongoose.model('ErrorVotes', errrorVotesSchema);
module.exports = ErrorVotes;
