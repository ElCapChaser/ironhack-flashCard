'use strict';

const express = require('express');
const router = new express.Router();
const routeGuard = require('./../middleware/route-guard');
const Flashcard = require('./../models/flashcard');
const Choicecard = require('./../models/choicecard');

router.get('/', (req, res, next) => {
    res.render('home', { title: 'Iron Flashcards' });
});

router.get('/private', routeGuard, (req, res, next) => {
    res.render('private');
});

/////////////////////////////////////////////////////////////
////////////// BROWSE AND RANDOM FLASHCARDS
////////////////////////////////////////////////////////////

// GET - /randomflashcard - Random Card - Displaying a random practice card
router.get('/randomflashcard', (req, res, next) => {
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

router.get('/browsefalshcards', (req, res, next) => {
    let isflashcard = true;
    Flashcard.find()
        .then((flashcards) => {
            if (flashcards.length < 1) {
                res.render('error', {
                    message: 'There are no flashcards in the database'
                });
                return;
            }
            res.render('browse', {
                cardtype: 'Flashcards',
                flashcards: flashcards,
                isflashcard: isflashcard
            });
        })
        .catch((error) => {
            next(error);
        });
});

router.post('/browsefalshcards', (req, res, next) => {
    let isflashcard = true;
    const topic = req.body.topic;
    Flashcard.find({
            topic: topic
        })
        .then((flashcards) => {
            res.render('browse', {
                cardtype: 'Flashcards',
                flashcards: flashcards,
                isflashcard: isflashcard
            });
        })
        .catch((error) => {
            next(error);
        });
});

///////////////////////////////////////////////////////////////////////////////////
/////////////////// BROWSE AND RANDOM CHOICECARD //////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

// random choicecard
router.get('/randomchoicecard', (req, res, next) => {
    let total;
    Choicecard.countDocuments({}, function(err, count) {
        console.log('Number of choicecards:', count);
        if (count < 1) {
            res.render('error', {
                message: 'There are no choicecards in the database'
            });
            return;
        }
        total = Number(count);
        let rand = Math.floor(Math.random() * total);
        Choicecard.findOne()
            .skip(rand)
            .then((randomCard) => {
                console.log(randomCard);
                res.redirect(`/choicecard/${randomCard._id}`);
            })
            .catch((error) => {
                next(error);
            });
    });
});

//browse form
router.get('/browsechoicecards', (req, res, next) => {
    let isflashcard = false;
    Choicecard.find()
        .then((choicecards) => {
            if (choicecards.length < 1) {
                res.render('error', {
                    message: 'There are no choicecards in the database'
                });
                return;
            }
            res.render('browse', {
                cardtype: 'Choicecards',
                flashcards: choicecards,
                isflashcard: isflashcard
            });
        })
        .catch((error) => {
            next(error);
        });
});

//browse results
router.post('/browsechoicecards', (req, res, next) => {
    let isflashcard = false;
    const topic = req.body.topic;
    Choicecard.find({
            topic: topic
        })
        .then((choicecards) => {
            res.render('browse', {
                cardtype: 'Choicecards',
                flashcards: choicecards,
                isflashcard: isflashcard
            });
        })
        .catch((error) => {
            next(error);
        });
});

module.exports = router;