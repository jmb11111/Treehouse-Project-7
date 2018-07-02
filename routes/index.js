const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var Twit = require('twit');
var config = require('../config.js');

var T = new Twit(config);
let tweet = [];
let follower = [];
let followerDataArray;

let messageSenderPicture;
var d = new Date();
var n = d.getUTCHours();
let currentUserID;

let directMessagesArray;

let currentUserPic;
let pic =[];
let dms =[];

T.get('users/lookup', { screen_name: "josh121592" }, function (err, currentUser, response) {
    if (!err) {
        // console.log(currentUser[0].id_str);
        // console.log(currentUser[0].profile_image_url);
        currentUserID = currentUser[0].id_str;
        currentUserPic = currentUser[0].profile_image_url;
        T.get('direct_messages/events/list', { id: currentUserID }, function (err, dmData, response) {
            if (!err) {
                directMessagesArray = dmData.events;
                
                
                    directMessagesArray.forEach(dm =>{
                        dms.push(dm);
                        console.log(dms.length);
                        
                        for (let index = 0; index < dms.length; index++) {
           
                            T.get('users/lookup', { user_id: dms[index].message_create.sender_id }, function (err, messageInfo, response) {
                            
                             dms.forEach(dm => {
                                  messageInfo.forEach(picUrl => {
                                     dm.pic=picUrl.profile_image_url; 
                                     
                                                        
                                 })   
                             })   
                             });
                        }
                    });
       
  
      
            }
        });
       
    } else {
        console.log('userInfo' + err);
    }
    
});


T.get('statuses/home_timeline', { screen_name: currentUserID, count: 10 }, function (err, data, response) {
    if (!err) {
        twitterFeedData = data;
        for (let i = 0; i < twitterFeedData.length; i++) {
            tweet[i] = {
                text: twitterFeedData[i].text,
                name: twitterFeedData[i].user.name,
                screenName: twitterFeedData[i].user.screen_name,
                userpic: twitterFeedData[i].user.profile_image_url,
                retweetCount: twitterFeedData[i].retweet_count,
                favoriteCount: twitterFeedData[i].favorite_count,
                tweetLink: twitterFeedData[i].user.url,
                retweetLink: twitterFeedData[i].id_str,
                timeStamp: twitterFeedData[i].created_at.slice(0, 19),
                retweet: '/retweet' + twitterFeedData[i].id_str,
                like: '/like' + twitterFeedData[i].id_str,
                retweetFunction: router.get('/retweet' + twitterFeedData[i].id_str, (req, res) => {
                    T.post('statuses/retweet/', { id: twitterFeedData[i].id_str }, function (err, data, respons) {
                        console.log('retweeted');
                    })
                    res.redirect('/');
                }),
                likeFunction: router.get('/like' + twitterFeedData[i].id_str, (req, res) => {
                    T.post('favorites/create/', { id: twitterFeedData[i].id_str }, function (err, data, respons) {
                        console.log('favorited');
                    })
                    res.redirect('/');
                })
            }
        };
    } else {
        console.log(data);
    }
});

T.get('followers/list', { screen_name: currentUserID, count: 70 }, function (err, followData, response) {
    if (!err) {
        followerDataArray = followData.users;
        for (let i = 0; i < followerDataArray.length; i++) {
            follower[i] = {
                profilePicUrl: followerDataArray[i].profile_image_url,
                name: followerDataArray[i].name,
                userName: followerDataArray[i].screen_name,
                userNameT: `@${followerDataArray[i].screen_name}`,
                unfollow: '/unfollow/' + followerDataArray[i].id_str,
                follow: '/follow/' + followerDataArray[i].id_str,
                followStatus: followerDataArray[i].following,
                followFunction: router.get('/follow/' + followerDataArray[i].id_str, (req, res) => {
                    T.post('friendships/create', { id: followerDataArray[i].id_str }, function (err, data, respons) {
                        console.log('followed');
                    })
                    res.redirect('/');
                }),
                unfollowFunction: router.get('/unfollow/' + followerDataArray[i].id_str, (req, res) => {
                    T.post('friendships/destroy', { id: followerDataArray[i].id_str }, function (err, data, respons) {
                        console.log('unfollowed');
                    })
                    res.redirect('/');
                })
            }

        };
    } else {
        console.log(followData);
    }
});





router.get('/', (req, res) => {
    console.log(dms);
    
    profileImg = currentUserPic;
    userID = currentUserID;
    directMessages = dms;
    following = followerDataArray.length;
    tweetText = tweet;
    followerInfo = follower;
    messageSenderPictureURL = messageSenderPicture;
    res.render('index');

});
router.post('/', function (req, res) {

    console.log(req.body);
    T.post('statuses/update', { status: req.body.tweet }, function (err, data, response) {
        if (!err) {
            console.log('tweeted')
            res.render('index');
        } else {
            console.log("unable to post");

        }
    })

});




module.exports = router;
