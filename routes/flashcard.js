const express = require('express');
const Flashcard = require('./../models/flashcard');
//const routeGuardMiddleware = require('./../middleware/route-guard');
//const uploadMiddleware = require('./../middleware/file-upload');

const router = new express.Router();

router.get('/create', (req, res, next) => {
    res.render('flashcards/create');
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