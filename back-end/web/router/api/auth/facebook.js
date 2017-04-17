var router = require('express').Router();
var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../../../../models/User');

var dotenv = require('dotenv');

dotenv.config();

  //facebook auth setup
  options = {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:8000/api/auth/facebook/callback'
  };

  passport.use(
    new FacebookStrategy(
      options,
      function(accessToken, refreshToken, profile, done) {
        console.log(accessToken, refreshToken, profile)
        User.find(
          { facebookId: profile.id },
          function (err, result) {
            if(result) {

              result.access_token = accessToken;
              result.save(function(err, doc) {
                done(err, doc);
              });
            } else {
              done(err, result);
            }

            console.log(err, result)
          }
        );
      }
    )
  );


  //token auth setup
  passport.use(
    new BearerStrategy(
      function(token, done) {
        User.findOne({ access_token: token },
          function(err, user) {
            if(err) {
              return done(err)
            }
            if(!user) {
              return done(null, false)
            }

            return done(null, user, { scope: 'all' })
          }
        );
      }
    )
  );

router.get(
  'facebook',
  passport.authenticate('facebook', { session: false, scope: [] })
);

router.get('facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: "/" }),
  function(req, res) {
    res.redirect("/profile?access_token=" + req.user.access_token);
  }
);

router.get(
  '/profile',
  passport.authenticate('bearer', { session: false }),
  function(req, res) {
    res.send("LOGGED IN as " + req.user.facebookId + " - <a href=\"/logout\">Log out</a>");
  }
);

module.exports = router;

