var router = require('express').Router();
var User = require('../../../../models/User');
var _ = require('lodash');

router.post('/searchMateByLikeName', function (req, res, next){
    var gender;
    var interests;

    if(req.body.gender.length > 0)
        gender = req.body.gender;
    else
        gender = User.schema.path("gender").enumValues;

    if(req.body.interests.length > 0)
        interests = req.body.interests;
    else
        interests = User.schema.path("interests").caster.enumValues;

    User.find(
        {
            $or: [
                {username: new RegExp('^.*' + req.body.findString + '.*$', "i")},
                {lastname: new RegExp('^.*' + req.body.findString + '.*$', "i")},
                {firstname: new RegExp('^.*' + req.body.findString + '.*$', "i")}
            ],
            gender: gender,
            interests: {$in: interests},
            isMate: true,

        })
        .exec(function (err, users) {
            if (err)
                return next(err);


            if (_.isNull(users) || _.isEmpty(users)) {
                res.set('Content-Type', 'application/json');
                res.status(200).json({
                        errorMessage: 'User not found',
                        errorCode: 'E_USER_NOT_FOUND'
                    } || {}, null, 2);
            }
            else {
                res.set('Content-Type', 'application/json');
                res.status(200).end(JSON.stringify(users || {}, null, 2));
            }
        });
});

module.exports = router;