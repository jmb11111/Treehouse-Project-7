const express = require('express');
const router = express.Router();

var Twit = require('twit');
var config = require('../config.js');

var T = new Twit(config);


let tweet = [];
let follower = [];
let followerDataArray;
let messageText;
let messageSenderPicture;
var d = new Date();
var n = d.getUTCHours();
console.log(n);


T.get('statuses/user_timeline', { screen_name: 'josh121592', count: 10 }, function (err, data, response) {
    if (!err) {
        twitterFeedData = data;
    } else {
        console.log(data);
    } for (let i = 0; i < twitterFeedData.length; i++) {
        tweet[i] = {
            text: twitterFeedData[i].text,
            name: twitterFeedData[i].user.name,
            screenName: twitterFeedData[i].user.screen_name,
            userpic: twitterFeedData[i].user.profile_image_url,
            retweetCount: twitterFeedData[i].retweet_count,
            favoriteCount: twitterFeedData[i].favorite_count,
            tweetLink: twitterFeedData[i].user.url,
            retweetLink: twitterFeedData[i].id_str,
            timeStamp: n - Number(twitterFeedData[i].created_at.slice(11, 13)) + 'h',
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
});

T.get('friends/list', { screen_name: 'josh121592', count: 70 }, function (err, followData, response) {
    if (!err) {
        followerDataArray = followData.users;
        // console.log(followerDataArray[1]);
    } else {
        console.log(followData);
    } for (let i = 0; i < followerDataArray.length; i++) {
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
});

T.get('direct_messages/events/list', function (err, dmData, response) {
    if (!err) {
        let senderID = dmData.events[0].message_create.sender_id;
        let messageID = dmData.events[0].id;
        T.get('direct_messages/events/show', { id: messageID }, function (err, dMessage, response) {
            if (!err) {
                messageText = dMessage.event.message_create.message_data.text;
                console.log(messageText);
            } else {
                console.log('dm events'+err);
            }
        }); 
            T.get('users/lookup', { user_id: senderID }, function (err, messageSender, response) {
                if (!err) {
                    console.log(messageSender[0].profile_image_url);
                    messageSenderPicture = messageSender[0].profile_image_url;
                } else {
                    console.log('userInfo'+err);
                }
            });
    } else {
        console.log(dmData);
    }
});


router.get('/', (req, res) => {
    dmMessageTextSent = messageText;
    following = followerDataArray.length;
    tweetText = tweet;
    followerInfo = follower;
    messageSenderPictureURL= messageSenderPicture;
    res.render('index');

});





module.exports = router;
