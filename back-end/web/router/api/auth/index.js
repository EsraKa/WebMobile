var router = require('express').Router();
var passport = require('passport');

router.use('/authenticate', require('./authenticate'));
router.use('/facebook', require('./facebook'));

module.exports = router;
