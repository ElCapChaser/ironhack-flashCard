'use strict';

const express = require('express');
const router = new express.Router();
const routeGuard = require('./../middleware/route-guard');
const Choicecard = require('./../models/choicecard');

router.get('/', (req, res, next) => {
    res.render('home', { title: 'Iron Flashcards' });
});

router.get('/private', routeGuard, (req, res, next) => {
    //get id of currently logged in user:
    const id = req.user._id;
    console.log(id);
    Choicecard.find({ creator: req.user }).then((cards) => {
        console.log(cards);
        res.render('private', {
            cards: cards
        });
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