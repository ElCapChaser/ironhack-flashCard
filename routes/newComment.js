const express = require('express');
const router = new express.Router();
const Comment = require('./../models/comment');

//Written as PROMISE CHAIN
// router.post('/flashcard/:id/new-comment', (req, res, next) => {
//   const data = req.body;
//   const id = req.params.id;
//   Comment.create({
//     content: data.comment,
//     flashcard: id,
//     creator: req.user._id
//   })
//     .then((comment) => {
//       res.redirect(`/flashcard/${id}`);
//     })
//     .catch((error) => {
//       next(error);
//     });
// });

//Written as ASYNC AWAIT

// router.post('/flashcard/:id/new-comment', async (req, res, next) => {
//   const data = req.body;
//   const id = req.params.id;
//   try {
//     const comment = await Comment.create({
//       content: data.comment,
//       flashcard: id,
//       creator: req.user._id
//     });
//     res.redirect(`/flashcard/${id}`);
//   } catch (error) {
//     next(error);
//   }
// });


router.post('/choicecard/:id/new-comment', async (req, res, next) => {
  const data = req.body;
  const id = req.params.id;
  try {
    const comment = await Comment.create({
      content: data.comment,
      choicecard: id,
      creator: req.user._id
    });
    res.redirect(`/choicecard/${id}`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
