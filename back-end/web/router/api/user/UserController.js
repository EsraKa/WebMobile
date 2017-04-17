var router = require('express').Router();
var User = require('../../../../models/User');
var _ = require('lodash');
var bcrypt = require('bcrypt');


// PATH GET /api/user/
router.get('/', function (req, res){
    User.find({}).then(function (users) { // findOne pour une seule username
        res.json(users);
    })
});

// PATH GET api/user/:userId/getUserById
router.get('/:userId/getUserById', function (req, res){
    console.log('get user by id:'+req.params.userId);

    if(req.params.userId.length >= 12) {
        // Code necessary to consume the User API and respond
        User.findById(req.params.userId)
            .exec(function (err, user) {
                if (err)
                    return next(err);
                if (_.isNull(user) || _.isEmpty(user)) {
                    res.set('Content-Type', 'application/json');
                    res.status(200).json({
                            errorMessage: 'User not found',
                            errorCode: 'E_USER_NOT_FOUND'
                        } || {}, null, 2);
                }
                else {
                    res.set('Content-Type', 'application/json');
                    res.status(200).end(JSON.stringify(user || {}, null, 2));
                }
            });
    }
    else
    {
        res.set('Content-Type', 'application/json');
        res.status(200).json({
                errorMessage: 'Not in objectId',
                errorCode: 'E_NOT_ID'
            } || {}, null, 2);
    }
});

// PATH GET /api/user/:username/getUserByUsername
router.get('/:username/getUserByUsername', function (req, res){
    User.findOne({username: req.params.username})
        .exec(function (err, user) {
            if (err)
                return next(err);

            if (_.isNull(user) || _.isEmpty(user)) {
                res.set('Content-Type', 'application/json');
                res.status(200).json({
                        errorMessage: 'User not found',
                        errorCode: 'E_USER_NOT_FOUND'
                    } || {}, null, 2);
            }
            else {
                res.set('Content-Type', 'application/json');
                res.status(200).end(JSON.stringify(user || {}, null, 2));
            }
        });
});

// PATH POST api/users/{userId}/updateUser
router.post('/:userId/updateUser',function (req, res, next) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var birthdate = req.body.birthdate;
    var username = req.body.username;
    var description = req.body.description;
    var gender = req.body.gender;
    var email = req.body.email;
    var isMate = false;
    var interestTab = req.body.interests;

    if(req.body.isMate === 'MATE')
        isMate = true;

    User.findOneAndUpdate(
        {_id: req.params.userId},
        {
            $set: {
                firstname: firstname,
                lastname: lastname,
                birthDate: birthdate,
                gender: gender,
                interests: interestTab,
                description: description,
                username: username,
                email: email,
                isMate: isMate
            }
        },
        {new: true}, //means we want the DB to return the updated document instead of the old one
        function (err, updatedUser) {
            if (err)
                return next(err);
            else {
                res.set('Content-Type', 'application/json');
                res.status(200).end(JSON.stringify(updatedUser || {}, null, 2));
            }
        });
});

// PATH POST api/users/{userId}/updatePassword
router.post('/:userId/updatePassword',function (req, res, next) {

    var userOldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;
    var newPasswordConfirmation = req.body.confirmNewPassword;

    User.findById(
        req.params.userId,
        function (err, userFinded) {
            if (err)
                return next(err);

            // test for a matching password
            userFinded.comparePassword(userOldPassword, function (err, isMatch) {
                if (err) return next(err);

                // check if the password was a match
                if (isMatch) {
                    //logger.debug('It\'s a match !');
                    if (newPassword === newPasswordConfirmation) {
                        bcrypt.genSalt(10, function (err, salt) {
                            if (err) {
                                return next(err);
                            }
                            bcrypt.hash(newPassword, salt, function (err, hash) {
                                if (err) {
                                    return next(err);
                                }

                                userFinded.update({
                                    $set: {password: hash}
                                }, function (err, raw) {
                                    if (err) return next(err);
                                    res.set('Content-Type', 'application/json');
                                    res.status(200).end(JSON.stringify({
                                            successMessage: 'password successfully modified',
                                            successCode: 'PWD_UPDATED'
                                        } || {}, null, 2));
                                });
                            });
                        });
                    }
                    else {
                        res.set('Content-Type', 'application/json');
                        res.status(401).end(JSON.stringify({
                            errorMessage: 'New passwords aren\'t the same',
                            errorCode: 'E_NEW_PWD_NOT_EQUAL'
                        }, null, 2));
                    }
                }
                else {//no match
                    res.set('Content-Type', 'application/json');
                    res.status(401).end(JSON.stringify({
                        errorMessage: 'Bad old password',
                        errorCode: 'E_BAD_OLD_PWD'
                    }, null, 2));
                }
            });
        });
});

// PATH POST api/users/{userId}/updatePassword
router.post('/:userId/deleteUser',function (req, res, next) {

    User.findOneAndUpdate(
        {_id: req.params.userId},
        {
            $set: {
                active: false
            }
        },
        {new: true}, //means we want the DB to return the updated document instead of the old one
        function (err, updatedUser) {
            if (err) {
                return next(err);
            }
            else {
                res.set('Content-Type', 'application/json');
                res.status(200).end(JSON.stringify(updatedUser || {}, null, 2));
            }
        });
});

module.exports = router;