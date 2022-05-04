const passport = require("passport");
const LocalStrategy = require("passport-local");
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

module.exports = function(app) {

  //　ログインストラテジー
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

  // サインアップストラテジー
  passport.use('local-signup', new LocalStrategy(function verify(username, password, cb) {
    console.log('here local-signup', username, password)
    client
      .query('SELECT * FROM users WHERE username = $1', [username])
      .then(results => {
        if (results.rows.length > 0) {
          console.log('username is already taken!');
          return cb(null, false);
        }
        else {
          client
            .query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
                   [username, password])
            .then(results => {
              console.log('signup strategy clear!', results.rows[0]);
              return cb(null, results.rows[0]);
            })
            .catch(e => {
              console.error(e);
              return cb(null, false)
            })
        }
      })
      .catch(e => {
        console.error(e);
        res.render('signup.ejs');
      })
  }))
  // --
  
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

  app.use(
    cookieSession({
      name: "session",
      keys: ['keys'],
      maxAge: 24 * 60 * 60 * 1000,
    })
  );
  app.use(passport.session());
  
}
