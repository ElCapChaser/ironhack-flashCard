const express = require('express');
const Flashcard = require('./../models/flashcard');
//const routeGuardMiddleware = require('./../middleware/route-guard');
const uploadMiddleware = require('./../middleware/file-upload');

const router = new express.Router();

// create a new flashcard
router.get('/create', (req, res, next) => {
    res.render('flashcards/create');
});

router.post(
    '/create',
    uploadMiddleware.fields([
        { name: 'questionImage', maxCount: 1 },
        { name: 'solutionImage', maxCount: 1 }
    ]),
    (req, res, next) => {
        const data = req.body;
        let questionImage;
        let solutionImage;
        if (req.files) {
            questionImage = req.files['questionImage'] ?
                req.files['questionImage'][0].path :
                undefined;
            solutionImage = req.files['solutionImage'] ?
                req.files['solutionImage'][0].path :
                undefined;
        }

        Flashcard.create({
                questionTitle: data.title,
                questionDescription: data.description,
                questionImage: questionImage,
                solutionImage: solutionImage,
                solution: data.solution,
                topic: data.topic,
                module: data.module,
                difficulty: data.difficulty,
                creator: req.user._id
                    // creator: req.session.userId
            })
            .then((flashcard) => {
                res.redirect(`/flashcard/${flashcard._id}`);
            })
            .catch((error) => {
                next(error);
            });
    }
);

//display a single flashcard

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

//update flashcard
router.get('/:id/update', (req, res, next) => {
    const id = req.params.id;
    Flashcard.findById(id)
        .then((flashcard) => {
            res.render('flashcards/update', { flashcard: flashcard });
        })
        .catch((error) => {
            next(error);
        });
});

router.post(
    '/:id/update',
    uploadMiddleware.fields([
        { name: 'questionImage', maxCount: 1 },
        { name: 'solutionImage', maxCount: 1 }
    ]),
    (req, res, next) => {
        const id = req.params.id;
        const data = req.body;
        console.log(data);
        let questionImage;
        let solutionImage;
        if (req.files) {
            questionImage = req.files['questionImage'] ?
                req.files['questionImage'][0].path :
                undefined;
            solutionImage = req.files['solutionImage'] ?
                req.files['solutionImage'][0].path :
                undefined;
        }
        Flashcard.findByIdAndUpdate(id, {
                questionTitle: data.title,
                questionDescription: data.description,
                questionImage: questionImage,
                solutionImage: solutionImage,
                solution: data.solution,
                topic: data.topic,
                module: data.module,
                difficulty: data.difficulty
            })
            .then((flashcard) => {
                res.redirect(`/flashcard/${flashcard._id}`);
            })
            .catch((error) => {
                next(error);
            });
    }
);

//delete flashcard
router.get('/:id/delete', (req, res, next) => {
    const id = req.params.id;
    Flashcard.findById(id)
        .then((flashcard) => {
            res.render('flashcards/confirm-deletion', { flashcard: flashcard });
        })
        .catch((error) => {
            next(error);
        });
});

router.post('/:id/delete', (req, res, next) => {
    const id = req.params.id;
    Flashcard.findByIdAndDelete(id)
        .then(() => {
            res.redirect('/');
        })
        .catch((error) => {
            next(error);
        });
});

//upvote flashcard
router.post('/:id/upvote', (req, res, next) => {
    const id = req.params.id;
    Flashcard.findByIdAndUpdate(id, {
            $inc: {
                upvotes: 1
            }
        })
        .then(() => {
            res.redirect(`/flashcard/${id}`);
        })
        .catch((error) => {
            next(error);
        });
});

//errrorvote flashcard
router.post('/:id/errorvote', (req, res, next) => {
    const id = req.params.id;
    Flashcard.findByIdAndUpdate(id, {
            $inc: {
                errorvotes: 1
            }
        })
        .then(() => {
            res.redirect(`/flashcard/${id}`);
        })
        .catch((error) => {
            next(error);
        });
});

module.exports = router;