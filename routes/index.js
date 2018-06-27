const express = require('express');
const router = express.Router();

var Twit = require('twit');
let twitterFeedData 

var T = new Twit({
  consumer_key:         'fSUa8sb97bhxl1j1xZNtMAyDb',
  consumer_secret:      '6kZxAtsGogv1KqAYJ2bdkyEKXZPsdlZsQ7SaWLVmb5DDOxsb1b',
  access_token:         '18651378-lm8ONnfuYeX1c7n0cO0Jh2Gsih5CVFcMtPfQ6A8aL',
  access_token_secret:  'qiADuQmB4PLqR2QbpIQecy9s0UNhkdvjqTxc48f2X9VdL',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
});
let tweet =[];
let follower =[];
var d = new Date();
var n = d.getUTCHours();
console.log(n);
//  get the list of user tweets
//
T.get('statuses/home_timeline', { screen_name: 'josh121592', count: 10},  function (err, data, response) {
   if (!err) {
    twitterFeedData = data;
   }else{
       console.log(data);
       
   }
   
  
  });

T.get('friends/list', { screen_name: 'josh121592', count: 70},  function (err, followData, response) {
   if(!err){ 
       
       
    followerDataArray=followData.users;
   
   }else{
       console.log(followData);
   }
    
  });



router.get('/', (req, res) => {
    console.log(followerDataArray.length);
    for (let i = 0; i < twitterFeedData.length; i++) {
    tweet[i] ={
        text: twitterFeedData[i].text,
        name: twitterFeedData[i].user.name,
        screenName : twitterFeedData[i].user.screen_name,
        userpic : twitterFeedData[i].user.profile_image_url,
        retweetCount: twitterFeedData[i].retweet_count,
        favoriteCount: twitterFeedData[i].favorite_count,
        tweetLink: twitterFeedData[i].user.url,
        retweetLink: twitterFeedData[i].id_str,
        timeStamp: n-Number(twitterFeedData[i].created_at.slice(11,13))+'h'
    }};
    for (let i = 0; i < followerDataArray.length; i++) {
            follower[i]={
            profilePicUrl: followerDataArray[i].profile_image_url,
            name: followerDataArray[i].name,
            userName: followerDataArray[i].screen_name
        } 

        };
    following= followerDataArray.length;
    tweetText=tweet;
    followerInfo= follower;
     res.render('index');
     
});





module.exports = router;
