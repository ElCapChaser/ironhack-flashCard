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
      res.redirect(`/flashcard/${id}`);
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
