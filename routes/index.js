var express = require('express');
var router = express.Router();
var fs = require('fs'),
    app     = express();
var http = require('http');
var server = http.createServer(app);
var request=require('request');
var async = require('async');


var kafka = require('kafka-node')
var Producer = kafka.Producer
var client = new kafka.Client("localhost:2181/")

var twitterTopic = "twitter";
    KeyedMessage = kafka.KeyedMessage,
    producer = new Producer(client),
    km = new KeyedMessage('key', 'message'),
    countryProducerReady = false;



var Twit=require('twit');//we can get this package details from www.npmjs.com
var T = new Twit({
  consumer_key:         'q7jSHVoUPF655tBLSF4MMKKn6',
  consumer_secret:      'S6pxJm4EFXYSbTb6ctpyrecOvgDnE5VGa7sDrdtFuCVboXEw0E',
  access_token:         '877811802767216640-VYY3roSg2Ld5SCugt2GNiKnunUZ0Nbh',
  access_token_secret:  '6NZXPADZbQPsgYmJ7ufG6CkbaKh1SsiVRaTkYFiOyPoXp',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})


var tweetArray=[];


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });

});
router.get('/tweets', function(req, res, next) {
  res.render('tweets');

});

router.post('/', function(req, res, next) {	

  var key=req.body.title;
  console.log(key);
getTweet(key,res);
});

function getTweet(ky,res1){

	var params={
    screen_name:ky,
    count:20
}

T.get("statuses/user_timeline",params,gotData);

function gotData(err,data,response){

  //console.log(data);

  var averageDelay = 9000;  // in miliseconds
var spreadInDelay = 2000; // in miliseconds
var delay = averageDelay + (Math.random() -0.5) * spreadInDelay;

    
    var tweets=data;

   var statusId=[];
   GetNextData(data,0,function(){
     console.log("Finished");
   }
   )}

    function GetNextData(tweets,index,succes)
    {
        if(tweets.length==index)
        {
          succes();
          return;
        }

        var userMentionArray=[];
        usersMentionsLength=tweets[index].entities.user_mentions.length;
        if(usersMentionsLength!=0)
        {
          for(k=0;k<usersMentionsLength;k++)
          {
            var um=tweets[index].entities.user_mentions[k].name
            userMentionArray.push(um);
          }
          for(var i=0;i<usersMentionsLength;i++)
          {
              console.log("users mentioned are"+userMentionArray[i])
          }
          
        }
        var statusId=tweets[index].id_str;

       getretweetedUserIdsByStatusId(statusId,function(data){
         
         var dataToKafka={};
         
         
         //console.log(tweets[index].text);
         var usrs=[];
         for(m=0;m<data.length;m++)
          {
            usrs.push(data[m].name);
          }
          dataToKafka.statuss=tweets[index].text;
          dataToKafka.retweetwdUsers=usrs;
          console.log(dataToKafka);
          console.log("-------");
          doKafka(dataToKafka,function(payloads){
            producer.send(payloads, function (err, loadeddata) {
          console.log(loadeddata);
          console.log(payloads);
          console.log("");
          });

          });


          function doKafka(dataToKafka,addData)
          {
             KeyedMessage = kafka.KeyedMessage,
          twitterKM = new KeyedMessage(dataToKafka.code, JSON.stringify(dataToKafka)),
          payloads = [
                      { topic: twitterTopic, messages: twitterKM, partition: 0 },
                     ];
          
          addData(payloads);
          }   
         index++;
        GetNextData(tweets,index,succes)
       },function(){
         Console.log("failed")
         index++;
        GetNextData(tweets,index,succes)

       });

    }
    function getretweetedUserIdsByStatusId(stId,succes,fail)
    {
      
      var uids;
      T.get('statuses/retweeters/ids', {id:stId,count:20 },
      function(error, userIds, response)
      {
        if (!error) 
        { 
          getNextUserdata(userIds,0,function(result){
            succes(result);
          })
          
        }
        else 
        {console.log(error.message);
          succes();
        }

      });
    }
    function getNextUserdata(userIds,index,sucss,users)
    {
      if(!users)
          users=[];
      if(userIds.ids.length==index)
      {
        sucss(users);
      }
            
        //write here apii and increment index
        usrId=userIds.ids[index];
      
        getUserDetailssByUserId(usrId,function(data){
      
          
          users.push(data);
         index++;
        getNextUserdata(userIds,index,sucss,users)
       },function(){
        
         index++;
        getNextUserdata(userIds,index,sucss,users)
       });

       function getUserDetailssByUserId(uId,succes,fail)
       {
        T.get('users/show', {user_id:uId},
        function(error, users, response)
        {
        if (!error) 
        { 
          succes(users);
          
        }
        else 
        {//console.log(error.message+" user id "+uId);
         
          fail();
        }

      });
    }
        
          
    }
  
 
	
}


module.exports = router;
