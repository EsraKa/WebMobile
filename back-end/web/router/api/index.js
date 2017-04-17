 var router = require('express').Router();
var config = require('../../../config/database');
var passport = require('passport');
var authentication = require('./../../middlewares/authentication');



require('../../../config/passport')(passport);


//partie publique du site

router.use('/auth', require('./auth'));
router.use('/user/register', require('./user/register'));

//partie privée
router.use('/user', authentication.auth, require('./user'));
router.use('/search', authentication.auth, require('./search'));
// router.use('/profile', authentication.auth, require('./profile'));


router.get(
  '/auth/facebook',
  passport.authenticate('facebook', { session: false, scope: [] })
);

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: "/" }),
  function(req, res) {
    res.redirect("/profile?access_token=" + req.user.access_token);
  }
);



router.get(
  '/',
  function(req, res) {
    res.send('<a href="/auth/facebook">Log in</a>');
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
