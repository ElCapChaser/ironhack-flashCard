'use strict';

const mongoose = require('mongoose');

const votesSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },
    choicecard: {
      type: mongoose.Types.ObjectId,
      ref: 'Choicecard'
    },
    vote: {
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

const Votes = mongoose.model('Votes', votesSchema);
module.exports = Votes;
