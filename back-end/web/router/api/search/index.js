var router = require('express').Router();

router.use('/', require('./searchController'));

module.exports = router;
