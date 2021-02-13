'use strict';

const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
    // answer: {
    //     type: String,
    //     trim: true,
    //     max: 140,
    //     required: true
    // },
    correct: {
        type: Boolean,
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    card: {
        type: mongoose.Types.ObjectId,
        ref: 'Choicecard'
    },
    //calculate the individual difficulty of this question for this user
    diff: {
        type: Number,
        min: 0,
        max: 6
    }
}, {
    timestamps: {
        createdAt: 'creationDate',
        updatedAt: 'updateDate'
    }
});

const Response = mongoose.model('Response', responseSchema);
module.exports = Response;