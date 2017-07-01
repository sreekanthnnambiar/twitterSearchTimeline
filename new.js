async.eachLimit(coll_urls,10,function(domain, callback){
     getWebsiteLinks(domain,batch_timestamp,callback);
   },function(eachlimit_finish_err){
     if(eachlimit_finish_err){
       append_data('crawl_error.txt','\r\n eachlimit crawl finish error'+ JSON.stringify(eachlimit_finish_err) +' ' +JSON.stringify(domain) );
     }else {
       append_data('crawl_error.txt','\r\n eachlimit crawl finish successfull');
     }
     scrape_new_urls(batch_timestamp);
   });

   function getWebsiteLinks(crawlUrl,batch_timestamp,callback){
 var begin_batch = "BEGIN BATCH ";
 var apply_batch = " APPLY BATCH";
 var db_query = "";
 request('http://www.webestools.com/page/js/ajax/linksExtractor.js?url=http://'+crawlUrl, {timeout:20000}, function (error, response, body) {
   if(!error){
     try {
       var outputLinks = JSON.parse(body).internal;
       var internalLinks = [];

       if(!(outputLinks === undefined)){
         var db_query = "BEGIN BATCH ";
         for(var i=0; i<outputLinks.length;i++){
             if(!isSocialLink(outputLinks[i]['link'])){
               var http_count = (outputLinks[i]['link'].match(/http/g) || []).length;
               if(http_count > 1){
                 var dup_http_start_position = outputLinks[i]['link'].indexOf('http',2)
                 outputLinks[i]['link'] = outputLinks[i]['link'].substring(dup_http_start_position)
               }

               if(internalLinks.indexOf(outputLinks[i]['link']) == -1 && http_count < 3 && stringContainswords(outputLinks[i]['link'])){
                 internalLinks.push(outputLinks[i]['link']);
                 db_query += "INSERT INTO scraper_links (link_id,link_name,checked,timestamp,html, main_link, batch_timestamp) VALUES (uuid()" +",'"+outputLinks[i]['link'] +"','0',toUnixTimestamp(now()), '', '"+crawlUrl+"',"+batch_timestamp+");"
               }
             }
         }

         db_query+=" INSERT INTO scraper_links (link_id,link_name,checked,timestamp,html, main_link, batch_timestamp) VALUES (uuid()" +",'http://"+crawlUrl +"','0', toUnixTimestamp(now()),'','"+crawlUrl+"',"+batch_timestamp+"); APPLY BATCH;"
         //save crawled links in database

         cassandra_client.execute(db_query, function (err, result) {
           if(err){
             append_data('cassandra_execution.txt','\r\n Could not execute query for '+ crawlUrl);
           }
         })
       }
     } catch (e) {
       append_data('exceptions.txt','\r\n Error while looping '+ crawlUrl + ' '+ e.message);
       var loop_error_db_query = " INSERT INTO error_scraper_links (id,link_name,error,checked,timestamp) VALUES (uuid()" +",'http://"+crawlUrl +"','"+e.message+"','0',toUnixTimestamp(now()));";
       cassandra_client.execute(loop_error_db_query, function (err, result) {
         if(err){