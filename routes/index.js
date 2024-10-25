var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var csrf = require('csurf');
var csrfProtection = csrf();
router.use(csrfProtection);



router.get('/signup', function signUp(req, res, next) {

    var messages = req.flash('error');
    res.render('signup', {
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    });
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/signup',
    failureRedirect: '/signup',
    failureFlash: true,
}));

/*
  Displays login page to the user
 */

router.get('/', function viewLoginPage(req, res, next) {
    var messages = req.flash('error');

    res.render('login', {
        title: 'Log In',
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    });
});

/*
  Logs user out from the application by clearing its session.
 */

router.get('/logout', isLoggedIn, function logoutUser(req, res, next) {

    req.logout();
    res.redirect('/');
});


router.get('/dummy', function (req, res, next) {
    var userChunks = [];
    var chunkSize = 3;
    //find is asynchronous function
    User.find({type: 'employee'}, function (err, docs) {
        for (var i = 0; i < docs.length; i++) {
            userChunks.push(docs[i]);
        }
        res.render('dummy', {title: 'Dummy', users: userChunks});
    });

});

/*
  Checks which type of user has logged in to the system
 */

router.get('/check-type', function checkTypeOfLoggedInUser(req, res, next) {
    req.session.user = req.user;
    if (req.user.type == "project_manager") {
        res.redirect('/manager/');
    }
    else if (req.user.type == "accounts_manager") {
        res.redirect('/manager/');
    }
    else if (req.user.type == "employee") {
        res.redirect('/employee/');
    }
    else {
        res.redirect('/admin/');
    }

});

/*
  Authenticates user login request and on success redirects user to his/her home page
 */

router.post('/login', passport.authenticate('local.signin', {
    successRedirect: '/check-type',
    failureRedirect: '/',
    failureFlash: true

}));

module.exports = router;

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
