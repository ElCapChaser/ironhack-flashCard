'use strict';

const express = require('express');
const { ObjectId } = require('mongodb');
const router = new express.Router();
const routeGuard = require('./../middleware/route-guard');
const Choicecard = require('./../models/choicecard');
const Response = require('./../models/response');
const Reminder = require('./../models/reminder');

router.get('/', (req, res, next) => {
    res.render('home', { title: 'Iron Flashcards' });
});

router.get('/private', routeGuard, (req, res, next) => {
    //get id of currently logged in user:
    const id = req.user._id;
    Choicecard.find({ creator: req.user }).then((cards) => {
        res.render('private', {
            cards: cards
        });
    });
});

////////////////////////////////////////////////////////////////////////////////////
////////////////////////// User's Reminders ///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

router.get('/private/reminders', routeGuard, (req, res, next) => {
    Reminder.find({ user: req.user })
        .populate('card')
        .then((reminders) => {
            console.log(reminders);
            res.render('reminders', {
                reminders: reminders
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
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    Choicecard.find()
        .skip(skip)
        .limit(limit)
        .then((choicecards) => {
            if (choicecards.length < 1) {
                res.render('error', {
                    message: 'There are no choicecards in the database'
                });
                return;
            }
            res.render('browse', {
                flashcards: choicecards,
                previousPage: page - 1,
                nextPage: choicecards.length ? page + 1 : 0
            });
        })
        .catch((error) => {
            next(error);
        });
});

//browse results
router.post('/browsechoicecards', (req, res, next) => {
    const topic = req.body.topic;

    Choicecard.find({
        topic: topic
    })

    .then((choicecards) => {
            res.render('browse', {
                flashcards: choicecards
            });
        })
        .catch((error) => {
            next(error);
        });
});

//browse next
router.post('/browsenext/:topic', (req, res, next) => {
    const topic = req.params.topic;
    Choicecard.findOne({
            topic: topic
        })
        .then((card) => {
            Response.find({ user: req.user._id, card: card._id }).then((resp) => {
                console.log(resp);
                if (resp[0].correct) {
                    console.log('correct response');
                    res.render('error', {
                        message: 'Well Done. You have answered all cards to this topic correctly!'
                    });
                    return;
                } else {
                    res.redirect(`/choicecard/${card._id}`);
                }
            });
        })
        .catch((error) => {
            next(error);
        });
});

module.exports = router;