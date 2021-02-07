const express = require('express');
const Flashcard = require('./../models/flashcard');
//const routeGuardMiddleware = require('./../middleware/route-guard');
//const uploadMiddleware = require('./../middleware/file-upload');

const router = new express.Router();

// create a new flashcard
router.get('/create', (req, res, next) => {
    res.render('flashcards/create');
});

router.post('/create', (req, res, next) => {
    console.log(req);
    const data = req.body;

    //   let image;
    //   if (req.file) {
    //     image = req.file.path;
    //   }
    console.log(data);

    Flashcard.create({
            questionTitle: data.title,
            questionDescription: data.description,
            solution: data.solution,
            topic: data.topic,
            module: data.module,
            difficulty: data.difficulty
                //creator: req.user._id
                // creator: req.session.userId
        })
        .then((flashcard) => {
            res.redirect(`/flashcard/${flashcard._id}`);
        })
        .catch((error) => {
            next(error);
        });
});

router.get('/:id', (req, res, next) => {
    Flashcard.findById(req.params.id)
        .then((flashcard) => {
            res.render('flashcards/single', {
                flashcard: flashcard
            });
        })
        .catch((error) => {
            next(error);
        });
});

module.exports = router;