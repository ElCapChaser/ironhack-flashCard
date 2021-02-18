'use strict';

const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    card: {
        type: mongoose.Types.ObjectId,
        ref: 'Choicecard'
    }
}, {
    timestamps: {
        createdAt: 'creationDate',
        updatedAt: 'updateDate'
    }
});

const Reminder = mongoose.model('Reminder', reminderSchema);
module.exports = Reminder;