const express = require('express');
const router = express.Router();

var Twit = require('twit');
let twitterTest = {};
var T = new Twit({
  consumer_key:         'fSUa8sb97bhxl1j1xZNtMAyDb',
  consumer_secret:      '6kZxAtsGogv1KqAYJ2bdkyEKXZPsdlZsQ7SaWLVmb5DDOxsb1b',
  access_token:         '18651378-lm8ONnfuYeX1c7n0cO0Jh2Gsih5CVFcMtPfQ6A8aL',
  access_token_secret:  'qiADuQmB4PLqR2QbpIQecy9s0UNhkdvjqTxc48f2X9VdL',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
});

//  get the list of user tweets
//
T.get('statuses/user_timeline', { screen_name: 'josh121592', count: 10},  function (err, data, response) {
    twitterTest = [data[0].text,data[1].text,data[2].text,data[3].text,data[4].text,data[5].text];
  })



router.get('/', (req, res) => {
     res.render('index');
     console.log(twitterTest);
});


module.exports = router;
