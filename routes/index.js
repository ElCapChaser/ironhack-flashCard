'use strict';

const express = require('express');
const router = new express.Router();
const routeGuard = require('./../middleware/route-guard');

router.get('/', (req, res, next) => {
    res.render('home', { title: 'Iron Flashcards!' });
});

router.get('/private', routeGuard, (req, res, next) => {
    res.render('private');
});

module.exports = router;