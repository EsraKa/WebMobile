var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

module.exports.genderMock = ['M', 'W'];
module.exports.interestMock = ['Cinema', 'Shopping', 'Party', 'Trip'];

var userSchema = new Schema({
    firstname: {
        type: String, required: false
    },
    lastname: {
        type: String, required: false
    },
    birthDate: {
        type: Date, required: false
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: this.genderMock,
        required: false
    },
    interests:
        [{
            type: String,
            enum: this.interestMock,
            required: false
        }]
    ,
    description: {
        type: String,
        required: false
    },
    isClient: {
        type: Boolean,
        required: true,
        default: true
    },
    isMate:  {
        type: Boolean,
        required: true,
        default: false
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false}
    ,
    facebookId: {
        type: String
    },
    access_token: {
        type: String
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    }
});

userSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

userSchema.methods.comparePassword = function(pw, cb) {
    bcrypt.compare(pw, this.password, function(err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};


module.exports = mongoose.model('User', userSchema);

