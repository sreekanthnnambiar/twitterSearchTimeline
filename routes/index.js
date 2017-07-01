var express = require('express');
var router = express.Router();
var fs = require('fs'),
    app     = express();
var http = require('http');
var server = http.createServer(app);
var request=require('request');
var async = require('async');


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
    count:5
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
   )

    function GetNextData(tweets,index,succes)
    {
        if(tweets.length==index)
        {
          succes();
          return;
        }
            
        //  var hts=[];
        //  var htLength=tweets[index].entities.hashtags.length;
        //  if(htLength!=0)
        //  {//
        //    for(var j=0;j<htLength;j++)
        //    {
        //       var htValue=tweets[index].entities.hashtags[j].text;
        //       hts.push(htValue);
        //    }
          
        //  }
         

        var userMentionArray=[];
        usersMentionsLength=tweets[index].entities.user_mentions.length;
        if(usersMentionsLength!=0)
        {
          for(k=0;k<usersMentionsLength;k++)
          {
            var um=tweets[index].entities.user_mentions[k].name
            userMentionArray.push(um);
          }
        }
        var statusId=tweets[index].id_str;

       getretweetedUserIdsByStatusId(statusId,function(data){
         
         console.log(tweets[index].text);
         for(m=0;m<data.length;m++)
          {
           console.log(data[m].name);
          }
          console.log("-------");
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
      T.get('statuses/retweeters/ids', {id:stId,count:10 },
      function(error, userIds, response)
      {
        if (!error) 
        { 
          getNextUserdata(userIds,0,function(result){
            succes(result);
          })
          
        }
        else 
        {
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
        usrId=userIds.ids[index];//error verunnu
      
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
        {
         
          fail();
        }

      });
    }
        
          
    }
  
 }
	
}


module.exports = router;
