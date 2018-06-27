const express = require('express');
const router = express.Router();

var Twit = require('twit');
let twitterFeedData = [];

var T = new Twit({
  consumer_key:         'fSUa8sb97bhxl1j1xZNtMAyDb',
  consumer_secret:      '6kZxAtsGogv1KqAYJ2bdkyEKXZPsdlZsQ7SaWLVmb5DDOxsb1b',
  access_token:         '18651378-lm8ONnfuYeX1c7n0cO0Jh2Gsih5CVFcMtPfQ6A8aL',
  access_token_secret:  'qiADuQmB4PLqR2QbpIQecy9s0UNhkdvjqTxc48f2X9VdL',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
});
let tweet =[];

//  get the list of user tweets
//
T.get('statuses/home_timeline', { screen_name: 'josh121592', count: 5},  function (err, data, response) {
    twitterFeedData = [data[0],data[1],data[2],data[3],data[4]];
    for (let i = 0; i < twitterFeedData.length; i++) {
        tweet[i] ={
        text : twitterFeedData[i].text,
        name: twitterFeedData[i].user.name,
        screenName : twitterFeedData[i].user.screen_name,
        userpic : twitterFeedData[i].user.profile_image_url,
        retweetCount: twitterFeedData[i].retweet_count,
        favoriteCount: twitterFeedData[i].favorite_count,
        tweetLink: twitterFeedData[i].user.url,
        retweetLink: twitterFeedData[i].id_str
    }   

        }

  })


router.get('/', (req, res) => {
   
tweetText=tweet;

     res.render('index');
     
});




router.get('/favorited0', (req,res) =>{
    T.post('favorites/create', { id: `${twitterFeedData[0].id_str}` }, function (err, data, response) {
        console.log('favorited')
      })
    return res.redirect('/')
    console.log(favoriteCount0)
});

module.exports = router;
