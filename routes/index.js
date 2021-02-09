'use strict';

const express = require('express');
const router = new express.Router();
const routeGuard = require('./../middleware/route-guard');
const Flashcard = require('./../models/flashcard');

router.get('/', (req, res, next) => {
    res.render('home', { title: 'Iron Flashcards!' });
});

router.get('/private', routeGuard, (req, res, next) => {
    res.render('private');
});

// GET - /randomflashcard - Random Card - Displaying a random practice card
router.get('/random', (req, res, next) => {
    let total;
    Flashcard.countDocuments({}, function(err, count) {
        console.log('Number of flashcards:', count);
        if (count < 1) {
            res.render('error', {
                message: 'There are no flashcards in the database'
            });
            return;
        }
        total = Number(count);
        let rand = Math.floor(Math.random() * total);
        Flashcard.findOne()
            .skip(rand)
            .then((randomCard) => {
                console.log(randomCard);
                res.redirect(`/flashcard/${randomCard._id}`);
            })
            .catch((error) => {
                next(error);
            });
    });
});
// GET - /browseflashcard - Selection form - Displaying form with filters for topic, difficulty & module

router.get('/browse', (req, res, next) => {
    Flashcard.find()
        .then((flashcards) => {
            if (flashcards.length < 1) {
                res.render('error', {
                    message: 'There are no flashcards in the database'
                });
                return;
            }
            res.render('browse', { flashcards: flashcards });
        })
        .catch((error) => {
            next(error);
        });
});

router.post('/browse', (req, res, next) => {
    const topic = req.body.topic;
    Flashcard.find({
            topic: topic
        })
        .then((flashcards) => {
            res.render('browse', { flashcards: flashcards });
        })
        .catch((error) => {
            next(error);
        });
});
// POST - /browseflashcard - Browse Cards - Displaying all card titels filtered by topic, difficulty & module

module.exports = router;