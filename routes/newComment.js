const express = require('express');
const router = new express.Router();

router.post('/new-comment', (req, res, next) => {
  const data = req.body;
  console.log(data);
});

//temporary get for testing
router.get('/new-comment', (req, res, next) => {
  res.render('partials/comments.hbs');
});

module.exports = router;
