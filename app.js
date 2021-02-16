'use strict';

const path = require('path');
const express = require('express');

const hbs = require('hbs');
hbs.registerHelper('equal', require('handlebars-helper-equal'));

const createError = require('http-errors');
const connectMongo = require('connect-mongo');
const expressSession = require('express-session');
const logger = require('morgan');
const mongoose = require('mongoose');
const sassMiddleware = require('node-sass-middleware');
const serveFavicon = require('serve-favicon');
const basicAuthenticationDeserializer = require('./middleware/basic-authentication-deserializer.js');
const bindUserToViewLocals = require('./middleware/bind-user-to-view-locals.js');
const baseRouter = require('./routes/index');
const authenticationRouter = require('./routes/authentication');
const choicecardRouter = require('./routes/choicecard');
const commentsRouter = require('./routes/newComment');
const votesRouter = require('./routes/votes');

const app = express();

hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('dateFormat', require('handlebars-dateformat'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(serveFavicon(path.join(__dirname, 'public/images', 'favicon_1.ico')));
app.use(express.static(path.join(__dirname, 'public/images')));

app.use(
    sassMiddleware({
        src: path.join('styles'),
        dest: path.join(__dirname, 'public/styles'),
        prefix: '/styles',
        outputStyle: process.env.NODE_ENV === 'development' ? 'expanded' : 'compressed',
        force: process.env.NODE_ENV === 'development',
        sourceMap: process.env.NODE_ENV === 'development'
    })
);
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(
    expressSession({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 15 * 24 * 60 * 60 * 1000,
            httpOnly: true
        },
        store: new(connectMongo(expressSession))({
            mongooseConnection: mongoose.connection,
            ttl: 24 * 60 * 60
        })
    })
);
app.use(basicAuthenticationDeserializer);
app.use(bindUserToViewLocals);

app.use('/', baseRouter);
app.use('/authentication', authenticationRouter);
app.use('/choicecard', choicecardRouter);
app.use('/choicecard', votesRouter);
app.use('/', commentsRouter);

// Catch missing routes and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// Catch all error handler
app.use((error, req, res, next) => {
    // Set error information, with stack only available in development
    res.locals.message = error.message;
    res.locals.error = req.app.get('env') === 'development' ? error : {};
    res.status(error.status || 500);
    res.render('error');
});

module.exports = app;