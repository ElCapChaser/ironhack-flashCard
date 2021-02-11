const express = require('express');
const Choicecard = require('./../models/choicecard');
const Response = require('./../models/response');
const Flashcard = require('./../models/flashcard');
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
            difficulty: data.difficulty
                //creator: req.user._id
                // creator: req.session.userId
        })
        .then((choicecard) => {
            res.redirect(`/choicecard/${choicecard._id}`);
        })
        .catch((error) => {
            next(error);
        });
});

//display a single choicecard
router.get('/:id', (req, res, next) => {
    if (req.query) {
        console.log(req.query);
    }
    Choicecard.findById(req.params.id)
        .then((choicecard) => {
            res.render('choicecards/single', {
                choicecard: choicecard
            });
        })
        .catch((error) => {
            next(error);
        });
});

// check if correct Answer was given to choicecard:
router.post('/:id', (req, res, next) => {
    console.log(req.body);
    Choicecard.findById(req.params.id).then((choicecard) => {
        //console.log(choicecard);
        console.log(req.user._id);
        // check if user has answered this card before
        // NEED HELP WITH THIS QUERY
        Response.find({ user: req.user._id, card: req.params.id })
            .then((existingResponse) => {
                console.log('existing response');
                console.log(existingResponse);
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
                } else {
                    feedbackMsg = "Sorry, that wasn't right, please try again! ";
                }
                res.render('choicecards/feedback', {
                    feedbackMsg: feedbackMsg,
                    id: req.params.id
                });
            })
            .catch((error) => {
                next(error);
            });
    });
});

//update choicecard
router.get('/:id/update', (req, res, next) => {
    const id = req.params.id;
    Choicecard.findById(id)
        .then((choicecard) => {
            res.render('choicecards/update', { choicecard: choicecard });
        })
        .catch((error) => {
            next(error);
        });
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

//upvote choicecard
router.post('/:id/upvote', (req, res, next) => {
    const id = req.params.id;
    Choicecard.findByIdAndUpdate(id, {
            $inc: {
                upvotes: 1
            }
        })
        .then(() => {
            res.redirect(`/choicecard/${id}`);
        })
        .catch((error) => {
            next(error);
        });
});

//errrorvote choicecard
router.post('/:id/errorvote', (req, res, next) => {
    const id = req.params.id;
    Choicecard.findByIdAndUpdate(id, {
            $inc: {
                errorvotes: 1
            }
        })
        .then(() => {
            res.redirect(`/choicecard/${id}`);
        })
        .catch((error) => {
            next(error);
        });
});

module.exports = router;