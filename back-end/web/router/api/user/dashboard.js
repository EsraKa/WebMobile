var router = require('express').Router();
var User = require('../../../../models/User');


router.get('/' , function(req, res) {
  res.send('It worked!');
});

module.exports = router;
