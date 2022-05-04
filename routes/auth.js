const express = require('express');
const router = express.Router();

const passport = require('passport');
// const LocalStrategy = require('passport-local');

// const cookieSession = require("cookie-session");

// -- pg
const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'node_image_app',
  port: 5432,
});
client.connect();

// //　ログインストラテジー
// passport.use(new LocalStrategy(function verify(username, password, cb) {
//   client
//     .query('SELECT * FROM users WHERE username = $1', [username])
//     .then(results => {
//       if (results.rows.length === 0) {
//         console.log('Results is empty. Login failed');
//         return cb(null, false);
//       }
//       if (results.rows[0].password !== password) {
//         console.log('Password wrong. Login failed');
//         return cb(null, false);
//       }
//       console.log('LocalStrategy called!', results.rows[0]);
//       return cb(null, results.rows[0]);
//       })
//       .catch(e => {
//         return cb(err);
//       })
// }));
// 
// // サインアップストラテジー
// passport.use('local-signup', new LocalStrategy(function verify(username, password, cb) {
//   console.log('here local-signup', username, password)
//   client
//     .query('SELECT * FROM users WHERE username = $1', [username])
//     .then(results => {
//       if (results.rows.length > 0) {
//         console.log('username is already taken!');
//         return cb(null, false);
//       }
//       else {
//         client
//           .query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
//                  [username, password])
//           .then(results => {
//             console.log('signup strategy clear!', results.rows[0]);
//             return cb(null, results.rows[0]);
//           })
//           .catch(e => { 
//             console.error(e);
//             return cb(null, false)
//           })
//       }
//     })
//     .catch(e => {
//       console.error(e);
//       res.render('signup.ejs');
//     })
// }))
// // --
// 
// passport.serializeUser(function(user, cb) {
//   process.nextTick(function() {
//                 console.log('serializer called!', user);
//     cb(null, { id: user.id, username: user.username });
//   });
// });
// 
// passport.deserializeUser(function(user, cb) {
//         console.log('deserializer called!', user);
//   process.nextTick(function() {
//     return cb(null, user);
//   });
// });
// 
// router.use(
//   cookieSession({
//     name: "session",
//     keys: ['keys'],
//     maxAge: 24 * 60 * 60 * 1000, 
//   })
// );
// router.use(passport.session());



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

// router.post('/signup', function(req, res, next) {
//      const username = req.body.username;
//      const password = req.body.password;
//      const password_confirmation = req.body.password_confirmation;
//      client
//        .query('SELECT * FROM users WHERE username = $1', [username])
//        .then(results => {
//                      if (results.rows.length > 0) {
//                              res.redirect('/signup');
//                              console.log('username is already taken!');
//                      }
// 
//                      else if (username === '' || password === '' || password_confirmation === '') {
//              console.error('form can not be blank!');
//              res.render('signup.js');
//      }
//      else if (password !== password_confirmation) {
//         console.log('password and password_confirmation must be same!')
//              res.render('signup.ejs');
//      }
//      else {
//         client
//                .query('INSERT INTO users (username, password) VALUES ($1, $2)',
//                             [username, password])
//                .then(results => {
//                              passport.authenticate('local'), function(req, res) {
//               res.redirect('/images');
//             }
//                      })
//                .catch(e => {
//                              console.error('Something wrong!');
//                      })
//      }
//   })
//      .catch(e => {
//              console.error(e);
//              res.render('signup.ejs');
//      })
// })



module.exports = router;
