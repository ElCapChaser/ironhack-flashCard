const express = require('express');
const Choicecard = require('./../models/choicecard');
const Response = require('./../models/response');
const Comment = require('./../models/comment');
const User = require('./../models/user');
const Reminder = require('./../models/reminder');
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
            // check if there is a user signed in to avoid error
            if (req.user) {
                if (
                    choicecard.creator._id &&
                    req.user._id.equals(choicecard.creator._id)
                ) {
                    isCreator = true;
                }
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
            //aux varaibles
            let topic;
            let theCard;
            Choicecard.findById(req.params.id).then((choicecard) => {
                        topic = choicecard.topic;
                        theCard = choicecard;
                        let topic;
                        Choicecard.findById(req.params.id).then((choicecard) => {
                            topic = choicecard.topic;

                            //find correct answer to display to user later
                            let correctAnswer;
                            for (let ans of choicecard.answers) {
                                if (ans.correct) {
                                    correctAnswer = ans.message;
                                    break;
                                }
                            }
                            // check if user has answered this card before
                            Response.find({ user: req.user._id, card: req.params.id })
                                .then((existingResponse) => {
                                    if (existingResponse.length > 0) {
                                        // if value is not null
                                        return Response.findByIdAndUpdate(existingResponse[0]._id, {
                                            correct: req.body.answer
                                        });
                                    } else {
                                        //if user has not answered this card before
                                        return Response.create({
                                            correct: req.body.answer,
                                            user: req.user,
                                            card: choicecard
                                        });
                                    }
                                    // check if user has answered this card before
                                    Response.find({ user: req.user._id, card: req.params.id })
                                        .then((existingResponse) => {
                                            if (existingResponse.length > 0) {
                                                // if value is not null
                                                return Response.findByIdAndUpdate(existingResponse[0]._id, {
                                                    correct: req.body.answer
                                                });
                                            } else {
                                                //if user has not answered this card before
                                                return Response.create({
                                                    correct: req.body.answer,
                                                    user: req.user,
                                                    card: choicecard
                                                });
                                            }
                                        })
                                        .then(() => {
                                            //see if there is a reminder for this card for this user
                                            return Reminder.find({ user: req.user, card: theCard });
                                        })
                                        .then((reminder) => {
                                            console.log(reminder);
                                            let isReminder;
                                            if (reminder.length > 0) {
                                                isReminder = true;
                                            }

                                            let correct;
                                            if (req.body.answer === 'true') {
                                                correct = true;

                                                User.findByIdAndUpdate(
                                                    req.user._id, {
                                                        $inc: {
                                                            correctAnswerStreak: 1
                                                        }
                                                    }, { new: true }
                                                ).then((user) => {
                                                    res.render('choicecards/feedback', {
                                                        user: user,
                                                        correct: correct,
                                                        id: req.params.id,
                                                        topic: topic,
                                                        correctAnswer: correctAnswer,
                                                        cardId: theCard._id,
                                                        isReminder: isReminder
                                                    });
                                                });
                                            } else {
                                                correct = false;
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
                                                            correct: correct,
                                                            id: req.params.id,
                                                            topic: topic,
                                                            correctAnswer: correctAnswer,
                                                            cardId: theCard
                                                        });
                                                    })
                                                    .catch((error) => {
                                                        next(error);
                                                    });
                                            }
                                        })
                                        .then(() => {
                                            let correct;
                                            if (req.body.answer === 'true') {
                                                correct = true;

                                                User.findByIdAndUpdate(
                                                        req.user._id, {
                                                            $inc: {
                                                                correctAnswerStreak: 1
                                                            }
                                                        }, { new: true }
                                                    )
                                                    .then((user) => {
                                                        if (user.correctAnswerStreak > user.highscore) {
                                                            return User.findByIdAndUpdate(
                                                                req.user._id, { highscore: user.correctAnswerStreak }, { new: true }
                                                            );
                                                        } else {
                                                            return User.findById(req.user._id);
                                                        }
                                                    })
                                                    .then((user) => {
                                                        res.render('choicecards/feedback', {
                                                            user: user,
                                                            correct: correct,
                                                            id: req.params.id,
                                                            topic: topic,
                                                            correctAnswer: correctAnswer
                                                        });
                                                    })
                                                    .catch((error) => next(error));
                                            } else {
                                                correct = false;
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
                                                            correct: correct,
                                                            id: req.params.id,
                                                            topic: topic,
                                                            correctAnswer: correctAnswer
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
                                let correctAnswer; //aux varaiable

                                if (req.user && choicecard.creator) {
                                    if (req.user._id.equals(choicecard.creator._id)) {
                                        //find which answer is correct
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
                                        return;
                                    } else {
                                        res.render('error', {
                                            message: 'You do not have permission to edit this card!'
                                        });
                                    }
                                } else {
                                    console.log('err');
                                    res.render('error', {
                                        message: 'You do not have permission to edit this card!'
                                    });
                                }
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
                                    if (req.user && choicecard.creator) {
                                        if (req.user._id.equals(choicecard.creator._id)) {
                                            res.render('choicecards/confirm-deletion', {
                                                choicecard: choicecard
                                            });
                                            return;
                                        }
                                    } else {
                                        res.render('error', {
                                            message: 'You do not have permission to delete this card!'
                                        });
                                    }
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

                        ///////////////////////////////////////////////////////////////////////////////////
                        //////////// REMIND ME FUNCTION //////////////////////////////////////////////////
                        //////////////////////////////////////////////////////////////////////////////////

                        router.post('/remind/:id', (req, res, next) => {
                            const id = req.params.id;
                            Choicecard.findById(id)
                                .then((choicecard) => {
                                    return Reminder.find({ user: req.user._id, card: id }).then(
                                        (reminders) => {
                                            if (reminders.length < 1) {
                                                return Reminder.create({
                                                    user: req.user,
                                                    card: choicecard
                                                });
                                            } else {
                                                res.redirect('/browsechoicecards');
                                                return;
                                            }
                                        }
                                    );
                                })
                                .then(() => {
                                    res.redirect('/browsechoicecards');
                                })
                                .catch((error) => {
                                    next(error);
                                });
                        });

                        router.post('/removeReminder/:id', (req, res, next) => {
                            const id = req.params.id;
                            Choicecard.findById(id)
                                .then((card) => {
                                    return Reminder.findOneAndDelete({ card: card });
                                })
                                .then(() => {
                                    console.log('deleted');
                                    res.redirect('/private/reminders');
                                })
                                .catch((error) => {
                                    next(error);
                                });
                        });

                        module.exports = router;