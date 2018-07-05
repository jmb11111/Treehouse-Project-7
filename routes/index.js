const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Twit = require('twit');
const config = require('../config.js');
const T = new Twit(config);

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


let tweet = [];
let follower = [];
let followerDataArray;
let messageSender= '';
let currentUserID = '';
let currentUserUsername;
let directMessagesArray;
let currentUserName;
let currentUserPic= '';
let dms =[];
let messageSenderArray=[];
let currentUserBackground;
let pageHeaderBackground;
//gets current user info based on user screen name supplied from config file
T.get('account/settings', function (err, currentUser, response) {
    if (!err) {

        currentUserUsername = currentUser.screen_name;
        console.log(currentUserUsername)
        T.get('users/lookup', { screen_name: currentUserUsername }, function (err, currentUser, response) {

            currentUserBackground = currentUser[0].profile_banner_url;
            currentUserID = currentUser[0].id_str;
            currentUserPic = currentUser[0].profile_image_url;
            currentUserName =currentUser[0].name;
        });
   
        //gets direct messages from current user
        T.get('direct_messages/events/list', { id: currentUserID }, function (err, dmData, response) {
            if (!err) {
                directMessagesArray = dmData.events;
                
                
                    directMessagesArray.forEach(dm =>{
                        dms.push(dm);
                       
                        for (let index = 0; index < dms.length; index++) {
                            //gets info on user who sent messages and adds picture, and date created
                            T.get('users/lookup', { user_id: dms[index].message_create.sender_id }, function (err, messageInfo, response) {
                            
                               
                                     
                             dms.forEach(dm => {
                                  dm.date = new Date(parseInt(dm.created_timestamp));
                                  messageInfo.forEach(picUrl => {
                                  dm.pic=picUrl.profile_image_url; 
                                  messageSenderArray.push(picUrl.name);                      
                                 })   


                             })   
                             });
                        }
                    });
                   
      
            }else{
                console.log(err.message);
            }
        });
       
    } else {
        console.log('userInfo' + err);
    }
    
});


//gets 10 most recent tweets from the current user

T.get('statuses/user_timeline', { screen_name: currentUserID, count: 10 }, function (err, data, response) {
    if (!err) {
        twitterFeedData = data;
        // sets object properties of each tweet to populate pug template
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
                //adds functionality to retweet button
                retweetFunction: router.get('/retweet' + twitterFeedData[i].id_str, (req, res) => {
                    T.post('statuses/retweet/', { id: twitterFeedData[i].id_str }, function (err, data, respons) {
                        console.log('retweeted');
                    })
                    res.redirect('/');
                }),
                // adds functionality to like button
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
// gets current friend list of user
T.get('friends/list', { screen_name: currentUserID, count: 70 }, function (err, followData, response) {
    if (!err) {
        followerDataArray = followData.users;
        followerDataArray.forEach(follower => {
            
        });
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

// gets name of DM sender conversation
messageSender = messageSenderArray.find(function(senderName){
                                    
    return senderName !== currentUserName;
  });
  router.get('/error',(req, res)=>{
    res.render('error');
})

// loads page
router.get('/', (req, res) => {
    if(messageSender !== '' && currentUserPic !== '' && currentUserID !== '' && dms !== [] && followerDataArray.length !== 0 && tweet !== [] && follower !== [] ){
    UserName =currentUserUsername;
    Sender = messageSender;
    profileImg = currentUserPic;
    userID = currentUserID;
    directMessages = dms;
    following = followerDataArray.length;
    tweetText = tweet;
    followerInfo = follower;
    backgroundImage =currentUserBackground;
    res.render('index');
    }
    else{
        res.redirect('/error')
    }
});
//adds functionality to tweet box in bottom
router.post('/', function (req, res) {

    
    T.post('statuses/update', { status: req.body.tweet }, function (err, data, response) {
        if (!err) {
            console.log(req.body.tweet);
            
            console.log('tweeted');
            

            res.render('index');
        } else {
            console.log("unable to post");

        }
    })

});




module.exports = router;
