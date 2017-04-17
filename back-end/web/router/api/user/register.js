var router = require('express').Router();
var User = require('../../../../models/User');
var _ = require('lodash');

// PATH: api/user/register
router.post('/', function(req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var birthdate = req.body.birthDate;
    var username = req.body.username;
    var description = req.body.description;
    var gender = req.body.gender;
    var email = req.body.email;
    var password = req.body.password;
    var isMate = false;
    var interestTab = req.body.interests;

    if(req.body.isMate === 'MATE')
        isMate = true;



    if(!username || !email || !password) {
        res.json({ success: false, message: 'Please enter email, password and username.' });
    }
    else {

        User.findOne({email: email})
            .exec(function (err, user) {
                if (err)
                    return res.json({ success: false, message: err});

                if (_.isNull(user) || _.isEmpty(user)) {
                    var newUser = new User({
                        firstname: firstname,
                        lastname: lastname,
                        birthDate: birthdate,
                        gender: gender,
                        interests: interestTab,
                        description: description,
                        username: username,
                        email: email,
                        password: password,
                        isMate: isMate
                    });

                    newUser.save(function(err) {
                        if (err) {
                            return res.json({ success: false, message: err});
                        }
                        res.json({ success: true, message: 'Successfully created new user.' });
                    });
                }
                else {
                    return res.json({ success: false, message: 'That email address already exists.'});
                }
            });

    }
});

module.exports = router;