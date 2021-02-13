'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        required: true
    },
    passwordHashAndSalt: {
        type: String,
        required: true
    },
    fullTime: {
        type: Boolean,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    profilePicture: {
        type: String
    },
    correctAnswerStreak: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('User', schema);