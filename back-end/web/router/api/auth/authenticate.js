var router = require('express').Router();
var User = require('../../../../models/User');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../../../../config/database');


require('../../../../config/passport')(passport);

router.post('/', function(req, res) {
  console.log('start auth process ..');
  console.log('params: ' + req.body.email);
  User.findOne({
    email: req.body.email
  }, function(err, user) {
    if (err) console.log('Error : ' + err);
    if (!user) {
      res.send({ success: false, message: 'Authentication failed. User not found.' });
    } else {
      //console.log('user finded !' + user);

      user.comparePassword(req.body.password, function(err, isMatch) {
        if (isMatch && err == null) {
          console.log('PWD match !');
          var token = jwt.sign(user, config.secret, {
            expiresIn: 10080 // secondes
          });
          res.json({ success: true, token: token});
        } else {
          res.send({ success: false, message: 'Authentication failed. Passwords did not match.' });
        }
      });
    }
  });
});

module.exports = router;
