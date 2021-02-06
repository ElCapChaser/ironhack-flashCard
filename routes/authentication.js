'use strict';
const uploadMiddleware = require('./../middleware/file-upload');
const { Router } = require('express');

const bcryptjs = require('bcryptjs');
const User = require('./../models/user');

const router = new Router();

router.get('/sign-up', (req, res, next) => {
  res.render('sign-up');
});

router.post(
  '/sign-up',
  uploadMiddleware.single('profilePicture'),
  (req, res, next) => {
    //Store the profile picture path if entered, otherwise leave undefined
    console.log(req.file);
    const picture = req.file ? req.file.path : undefined;
    console.log(picture);
    console.log(req.body);
    const { name, email, password, fullTime, startDate } = req.body;
    bcryptjs
      .hash(password, 10)
      .then((hash) => {
        return User.create({
          name,
          email,
          passwordHashAndSalt: hash,
          profilePicture: picture,
          fullTime,
          startDate
        });
      })
      .then((user) => {
        req.session.userId = user._id;
        res.redirect('/private');
      })
      .catch((error) => {
        next(error);
      });
  }
);

router.get('/sign-in', (req, res, next) => {
  res.render('sign-in');
});

router.post('/sign-in', (req, res, next) => {
  let user;
  const { email, password } = req.body;
  User.findOne({ email })
    .then((document) => {
      if (!document) {
        return Promise.reject(new Error("There's no user with that email."));
      } else {
        user = document;
        return bcryptjs.compare(password, user.passwordHashAndSalt);
      }
    })
    .then((result) => {
      if (result) {
        req.session.userId = user._id;
        res.redirect('/private');
      } else {
        return Promise.reject(new Error('Wrong password.'));
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/sign-out', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
