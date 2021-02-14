const express = require('express');
const Choicecard = require('./../models/choicecard');
const Response = require('./../models/response');
const Comment = require('./../models/comment');
const User = require('./../models/user');
const nodemailer = require('./../nodemailer');

//const routeGuardMiddleware = require('./../middleware/route-guard');

const router = new express.Router();

// create a new choicecard
router.get('/create', (req, res, next) => {
    res.render('choicecards/create');
});

router.post('/create', (req, res, next) => {
    const data = req.body;
    // must somehow shuffle answeres
    const answers = [
        { message: data.correctAnswer, correct: true },
        { message: data.answer2, correct: false },
        { message: data.answer3, correct: false },
        { message: data.answer4, correct: false }
    ];

    console.log(data);
    Choicecard.create({
            questionTitle: data.title,
            questionDescription: data.description,
            answers: answers,
            topic: data.topic,
            module: data.module,
            difficulty: data.difficulty,
            creator: req.user._id
                // creator: req.session.userId
        })
        .then((choicecard) => {
            res.redirect(`/choicecard/${choicecard._id}`);
        })
        .catch((error) => {
            next(error);
        });
});

//display a single choicecard and its comments

router.get('/:id', (req, res, next) => {
    let isCreator = false;
    let choicecard; //aux variable
    const id = req.params.id;
    Choicecard.findById(id)
        .then((card) => {
            choicecard = card;
            // shuffle answers
            for (let i = choicecard.answers.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * i);
                [choicecard.answers[j], choicecard.answers[i]] = [
                    choicecard.answers[i],
                    choicecard.answers[j]
                ];
            }
            //Checking if the authenticated user is also owner of the choicecard
            // and if choicecard has a creator to avoid error
            if (choicecard.creator && req.user._id.equals(choicecard.creator._id)) {
                isCreator = true;
            }
            //lookup all comments matching to the choicecard ID and populating the creator
            return Comment.find({ choicecard: id })
                .sort({ updateDate: -1 })
                .populate('creator', 'name');
        })
        .then((comment) => {
            res.render('choicecards/single', {
                choicecard: choicecard,
                isCreator: isCreator,
                comment: comment
            });
        })
        .catch((error) => {
            next(error);
        });
});

// check if correct Answer was given to choicecard:
router.post('/:id', (req, res, next) => {
    Choicecard.findById(req.params.id).then((choicecard) => {
        console.log(req.user._id);
        // check if user has answered this card before
        Response.find({ user: req.user._id, card: req.params.id })
            .then((existingResponse) => {
                if (existingResponse.length > 0) {
                    // if value is not null
                    console.log('user already answered this card - ');
                    return Response.findByIdAndUpdate(existingResponse[0]._id, {
                        correct: req.body.answer
                    });
                } else {
                    //if user has not answered this card before
                    console.log('creating new response');
                    return Response.create({
                        correct: req.body.answer,
                        user: req.user,
                        card: choicecard
                    });
                }
            })
            .then((response) => {
                console.log(response);
                let feedbackMsg;
                if (req.body.answer === 'true') {
                    feedbackMsg = 'That is correct! Great Job!';
                    console.log(req.user._id);
                    User.findByIdAndUpdate(
                        req.user._id, {
                            $inc: {
                                correctAnswerStreak: 1
                            }
                        }, { new: true }
                    ).then((user) => {
                        res.render('choicecards/feedback', {
                            user: user,
                            feedbackMsg: feedbackMsg,
                            id: req.params.id
                        });
                    });
                } else {
                    feedbackMsg = "Sorry, that wasn't right, please try again! ";
                    const highscore = req.user.correctAnswerStreak;
                    User.findByIdAndUpdate(
                            req.user._id, {
                                correctAnswerStreak: 0,
                                highscore: highscore
                            }, { new: true }
                        )
                        .then((user) => {
                            res.render('choicecards/feedback', {
                                user: user,
                                feedbackMsg: feedbackMsg,
                                id: req.params.id
                            });
                        })
                        .catch((error) => {
                            next(error);
                        });
                }
            });
    });
});

//update choicecard -- ASYNC AWAIT
router.get('/:id/update', async(req, res, next) => {
    try {
        const id = req.params.id;
        const choicecard = await Choicecard.findById(id);
        let correctAnswer;
        for (let ans of choicecard.answers) {
            if (ans.correct) {
                correctAnswer = ans.message;
                break;
            }
        }
        res.render('choicecards/feedback', {
            feedbackMsg: feedbackMsg,
            id: req.params.id
        });
    } catch (error) {
        next(error);
    }
});

//update choicecard -- ASYNC AWAIT
router.get('/:id/update', async(req, res, next) => {
    try {
        const id = req.params.id;
        const choicecard = await Choicecard.findById(id);
        let correctAnswer;
        for (let ans of choicecard.answers) {
            if (ans.correct) {
                correctAnswer = ans.message;
                break;
            }
        }
        res.render('choicecards/update', {
            choicecard: choicecard,
            correctAnswer: correctAnswer
        });
    } catch (error) {
        next(error);
    }
});

router.post('/:id/update', (req, res, next) => {
    const id = req.params.id;
    const data = req.body;

    Choicecard.findByIdAndUpdate(id, {
            questionTitle: data.title,
            questionDescription: data.description,
            //answers
            solution: data.solution,
            topic: data.topic,
            module: data.module,
            difficulty: data.difficulty
        })
        .then((choicecard) => {
            res.redirect(`/choicecard/${choicecard._id}`);
        })
        .catch((error) => {
            next(error);
        });
});

//delete choicecard
router.get('/:id/delete', (req, res, next) => {
    const id = req.params.id;
    Choicecard.findById(id)
        .then((choicecard) => {
            res.render('choicecards/confirm-deletion', { choicecard: choicecard });
        })
        .catch((error) => {
            next(error);
        });
});

router.post('/:id/delete', (req, res, next) => {
    const id = req.params.id;
    Choicecard.findByIdAndDelete(id)
        .then(() => {
            res.redirect('/');
        })
        .catch((error) => {
            next(error);
        });
});

module.exports = router;