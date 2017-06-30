var express = require('express');
var router = express.Router();
var fs = require('fs'),
    app     = express();
var http = require('http');
var server = http.createServer(app);
var request=require('request');


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

   
    
    for(var i=0;i<tweets.length;i++){
      var tweetData={};
        
       
      var hts=[];
         var htLength=tweets[i].entities.hashtags.length;
         if(htLength!=0)
         {
           for(var j=0;j<htLength;j++)
           {
              var htValue=tweets[i].entities.hashtags[j].text;
              hts.push(htValue);
           }
          
         }
         else{
           hts.push("none");
         }

          var userMentionArray=[];
        usersMentionsLength=tweets[i].entities.user_mentions.length;
        if(usersMentionsLength!=0)
        {
          for(k=0;k<usersMentionsLength;k++)
          {
            var um=tweets[i].entities.user_mentions[k].name
            userMentionArray.push(um);
          }
        }
        else
        {
          userMentionArray.push("no user mentions");
        }

        //var statusId=tweets[i].id_str;

       // setInterval(getretweetedUserIdsByStatusId, delay,statusId);
        //var retweeteduserIds=getretweetedUserIdsByStatusId(statusId);
        //getretweetedUserIdsByStatusId(statusId);



        var params2={
                id:tweets[j].id_str,
                count:10
                    }

        T.get('statuses/retweeters/ids',params2, function(error, userID, response){
        if (!error) {
          console.log(userID.ids+"statusID "+params2.id); // return the tweets to the API user
              } else {
            console.error('An error occurred!'+error); //error handling
        }
        });



        console.log("");



        tweetData.createdAt=tweets[i].created_at;
        tweetData.tweet=tweets[i].text;
        tweetData.hashtags=hts;
        tweetData.userMentions=userMentionArray;
        

		tweetArray.push(tweetData)
    }
   

//	console.log(tweetArray);
res1.render('tweets',{tweetItems:tweetArray});

  
 }
	
}

function getretweetedUserIdsByStatusId(stId)
{
  
  var uids;
  T.get('statuses/retweeters/ids', {id:stId,count:10 },gotData2);

  function gotData2(error, userIds, response)
  {
    uids= userIds;
  if (!error) {

    console.log(userIds.ids+"  for the status"+stId);// return the tweets to the API user
    
    
  } else {
   console.error('An error occurred!'+error); //error handling
   return error;
  }
  
}
console.log(uids);
//console.log(uids)
//return uids;
}


module.exports = router;
