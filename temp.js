console.log(statusId)

var result=[];

var userIdCol=async.eachLimit(statusId,1,function(stId, callback){


  
T.get('statuses/retweeters/ids', {id:stId,count:10 },function(error, userIds, response){
         // console.log(statusId);
         if (!error) {


          console.log(userIds.ids+"  for the status"+ stId);
        //   var userIdArray=[];
        //   for(var k=0;k<10;k++)
        //   {
        //     userIdArray.push(userIds.ids[k]);
        //   }
        //   callback(userIdArray);
        //  console.log(userIdArray);
              
                
                    T.get('users/show', {user_id:userIds.ids[j],statusId:stId}, function(error, user, response){
            console.log(userIds.ids[j]);
          if (!error) {
           console.log(user.name+"for user id "+userIds.ids[j]+" and status id"+stId);
           result.push(user);
            
              } else {
           console.error(userIds.ids[j]+'An error occurred in getting user details!'+error); //error handling
              }

              
            });
              
              
          
        } else {
           console.error('An error occurred '); //error handling
         }
      });

              //getWebsiteLinks(domain,batch_timestamp,callback);
            });
            
            
            


//  T.get('statuses/retweeters/ids', {id:statusId,count:10 },function gotData2(error, userIds, response){
//          // console.log(statusId);
//          if (!error) {

//           console.log(userIds.ids+"  for the status"+ statusId);// return the tweets to the API user
    
//           T.get('users/show', {user_id:userIds.ids[3] }, function(error, user, response){
// //            console.log(user);
//           if (!error) {
//            console.log(user.name+"for user id "+userIds.ids[3]); // return the tweets to the API user
//               } else {
//            console.error('An error occurred in getting user details!'+error); //error handling
//           }
//           });

    
//   } else {
//    console.error('An error occurred in getting user Id!'+userIds.ids[3]+error); //error handling
   
//   }
  
// });




//	console.log(tweetArray);
//res1.render('tweets',{tweetItems:tweetArray});