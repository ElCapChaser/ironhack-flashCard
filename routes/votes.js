const express = require('express');
const router = new express.Router();
const Choicecard = require('./../models/choicecard');
const nodemailer = require('./../nodemailer');
const Votes = require('./../models/votes');
const ErrorVotes = require('./../models/errorvotes');

//upvote choicecard
//does a vote from this user on this card exist? Update it's status
//no vote exists, create a new one

router.post('/:id/upvote', async (req, res, next) => {
  try {
    const id = req.params.id;
    //check if a vote already exists on this choicecard from the user. If no, create new vote.
    //If yes, toggle the value from true to false.
    const voteCheck = await Votes.find({
      choicecard: id,
      creator: req.user._id
    });
    if (voteCheck.length === 0) {
      const vote = await Votes.create({
        choicecard: id,
        user: req.user._id,
        vote: true,
        creator: req.user._id
      });
      res.redirect(`/choicecard/${id}`);
    } else {
      const message = "You've already voted";
      console.log(message);
      res.redirect(`/choicecard/${id}`);
      // res.render(`choicecards/${id}`, { message });
    }
    //Update total votes count
    const totalVotesPerCard = await Votes.countDocuments({
      choicecard: id,
      vote: true
    });
    const updateCount = await Choicecard.findByIdAndUpdate(id, {
      upvotes: totalVotesPerCard
    });
  } catch (error) {
    next(error);
  }
});

//errrorvote choicecard
router.post('/:id/errorvote', async (req, res, next) => {
  const id = req.params.id;
  try {
    const id = req.params.id;
    //check if a vote already exists on this choicecard from the user. If no, create new vote.
    //If yes, toggle the value from true to false.
    const voteCheck = await ErrorVotes.find({
      choicecard: id,
      creator: req.user._id
    });
    if (voteCheck.length === 0) {
      const vote = await ErrorVotes.create({
        choicecard: id,
        user: req.user._id,
        errorVote: true,
        creator: req.user._id
      });
      // res.redirect(`/choicecard/${id}`);
    } else {
      const message = "You've already error voted";
      console.log(message);
      res.redirect(`/choicecard/${id}`);
      return;
      // res.render(`choicecards/${id}`, { message });
    }
    //Update total votes count
    const totalVotesPerCard = await ErrorVotes.countDocuments({
      choicecard: id,
      errorVote: true
    });
    const updateCount = await Choicecard.findByIdAndUpdate(id, {
      errorvotes: totalVotesPerCard
    }).populate('creator');
    console.log(updateCount);
    if (updateCount.errorvotes >= 3) {
      nodemailer.errorEmail(updateCount.creator.email);
    }
    res.redirect(`/choicecard/${id}`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
