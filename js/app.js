const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
var Twit = require('twit');

var T = new Twit({
  consumer_key:         'fSUa8sb97bhxl1j1xZNtMAyDb',
  consumer_secret:      '6kZxAtsGogv1KqAYJ2bdkyEKXZPsdlZsQ7SaWLVmb5DDOxsb1b',
  access_token:         '18651378-lm8ONnfuYeX1c7n0cO0Jh2Gsih5CVFcMtPfQ6A8aL',
  access_token_secret:  'qiADuQmB4PLqR2QbpIQecy9s0UNhkdvjqTxc48f2X9VdL',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
});
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());
app.use('/static', express.static('public'));

app.set('view engine', 'pug');

const mainRoutes = require('../routes');

app.use(mainRoutes);


app.listen(3000, () => {
    console.log('The application is running on localhost:3000!')
});