const express = require('express');
const router = express.Router();

const passport = require('passport');

// -- pg
const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'node_image_app',
  port: 5432,
});
client.connect();

// router
router.get('/login', function(req, res, next) {
  res.render('login.ejs');
});

router.post('/login/password', passport.authenticate('local', {
  successRedirect: '/images',
  failureRedirect: '/login'
}));

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/login');
});

router.get('/signup', function(req, res, next) {
  res.render('signup.ejs');
})

router.post('/signup', passport.authenticate('local-signup',{
  successRedirect: '/images',
  failureRedirect: '/signup',
}))


module.exports = router;
