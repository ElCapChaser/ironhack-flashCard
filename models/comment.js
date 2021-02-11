'use strict';

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      trim: true,
      max: 140,
      required: true
    },
    creator: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },
    choicecard: {
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

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
