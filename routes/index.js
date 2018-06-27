const express = require('express');
const router = express.Router();

var Twit = require('twit');

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

T.get('followers/list', { screen_name: 'josh121592', count: 70},  function (err, followData, response) {
   if(!err){ 
       
   
    followerDataArray=followData.users;
    console.log(followerDataArray[1]);
    
   }else{
       console.log(followData);
   }
    
  });



router.get('/', (req, res) => {
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
        timeStamp: n-Number(twitterFeedData[i].created_at.slice(11,13))+'h',
        retweet: '/retweet'+twitterFeedData[i].id_str,
        like:'/like'+twitterFeedData[i].id_str,
        retweetFunction: router.get('/retweet'+twitterFeedData[i].id_str, (req,res)=>{
            T.post('statuses/retweet/',{id: twitterFeedData[i].id_str},function(err,data,respons){
                console.log('retweeted');
            })
            res.redirect('/');
        }),
        likeFunction: router.get('/like'+twitterFeedData[i].id_str, (req,res)=>{
            T.post('favorites/create/',{id: twitterFeedData[i].id_str},function(err,data,respons){
                console.log('favorited');
            })
            res.redirect('/');
        })
    }};
    for (let i = 0; i < followerDataArray.length; i++) {
            follower[i]={
            profilePicUrl: followerDataArray[i].profile_image_url,
            name: followerDataArray[i].name,
            userName: followerDataArray[i].screen_name,
            unfollow: '/unfollow/'+followerDataArray[i].id_str,
            followStatus: followerDataArray[i].following,
            unfollowFunction: router.get('/unfollow/'+followerDataArray[i].id_str, (req,res)=>{
                T.post('friendships/destroy',{id: followerDataArray[i].id_str},function(err,data,respons){
                    console.log('unfollowed');
                })
                res.redirect('/');
            })
        } 

        };
    following= followerDataArray.length;
    tweetText=tweet;
    followerInfo= follower;
     res.render('index');
     
});





module.exports = router;
