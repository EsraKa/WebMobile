var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');
var mongoose = require('mongoose');
var path = require('path');
var cors = require('cors');

mongoose.Promise = Promise;

var config = require('./config/database');
mongoose.connect(config.database);
console.log('Connected to database');

var app = express();
var port= process.env.PORT || 8000;


app.use(cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use(express.static(__dirname + 'public'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'))
});

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.use(morgan('dev'));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./web'));

app.listen(port, function () {
  console.log('App is running on port ' + port + '.' );
});
