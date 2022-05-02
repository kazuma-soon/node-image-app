const express = require('express');
const router = express.Router();

const passport = require('passport');
const LocalStrategy = require('passport-local');

const cookieSession = require("cookie-session");

// -- pg
const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'node_image_app',
  port: 5432,
});
client.connect();

passport.use(new LocalStrategy(function verify(username, password, cb) {
	client
	  .query('SELECT * FROM users WHERE username = $1', [username])
	  .then(results => {
      if (results.rows.length === 0) {
				console.log('Results is empty. Login failed');
				return cb(null, false);
			}
			if (results.rows[0].password !== password) {
				console.log('Password wrong. Login failed');
        return cb(null, false);
			}
			console.log('LocalStrategy called!', results.rows[0]);
			return cb(null, results.rows[0]);
		})
	  .catch(e => {
      return cb(err);
		})
}));

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
		console.log('serializer called!', user);
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function(user, cb) {
	console.log('deserializer called!', user);
  process.nextTick(function() {
    return cb(null, user);
  });
});

router.use(
  cookieSession({
    name: "session",
    keys: ['keys'],
    maxAge: 24 * 60 * 60 * 1000, 
  })
);
router.use(passport.session());



router.get('/login', function(req, res, next) {
	console.log('/login get!', req.user);
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

module.exports = router;
