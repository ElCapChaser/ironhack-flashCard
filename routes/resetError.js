const express = require('express');
const router = new express.Router();
const ErrorVotes = require('./../models/errorvotes');
const Choicecard = require('./../models/choicecard');

router.post('/:id/reset-errors', async (req, res, next) => {
  const id = req.params.id;
  try {
    const errorVotes = await ErrorVotes.deleteMany(
      {
        choicecard: id
      },
      { errorVote: false }
    );
    console.log(errorVotes);
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
