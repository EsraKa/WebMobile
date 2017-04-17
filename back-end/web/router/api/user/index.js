var router = require('express').Router();

router.use('/', require('./UserController'));

module.exports = router;
