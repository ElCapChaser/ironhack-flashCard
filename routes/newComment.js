const express = require('express');
const router = new express.Router();
const Comment = require('./../models/comment');

router.post('/flashcard/:id/new-comment', (req, res, next) => {
  const data = req.body;
  const id = req.params.id;
  Comment.create({
    content: data.comment,
    flashcard: id,
    creator: req.user._id
  })
    .then((comment) => {
      res.send('hithere');
    })
    .catch((error) => {
      next(error);
    });
});

//temporary get for testing
router.get('/new-comment', (req, res, next) => {
  res.render('partials/comments.hbs');
});

module.exports = router;
