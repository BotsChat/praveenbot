const express = require('express');
const bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/movies";
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

/* For Facebook Validation */
app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'praveenkumar') {
    res.status(200).send(req.query['hub.challenge']);
  } else {
    res.status(403).end();
  }
});
/* Handling all messenges */
app.post('/webhook', (req, res) => {
  console.log(req.body);
  if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message && event.message.text) {
          sendMessage(event);
        }
      });
    });
    res.status(200).end();
  }
});

///////////////// WEbhook for api.ai ///////////////////////////
app.post('/ai', (req, res) => {
  console.log('ai');
  console.log(req.body);


  ////////////////// Movie_name_search///////////////////////////////////////////////////
  if (req.body.result.action === 'movie_query.namebase') {
    console.log('movie_name_search')
    let mov_name = req.body.result.parameters['Name_list_movie'];
    console.log(mov_name)
    //req.body.entry.forEach((entry) => {
      //entry.messaging.forEach((event) => {
        //if (event.message && event.message.text) {
          
          MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var query = { Movie_Name: mov_name };
          
          //console.log('query', query)
          
          db.collection("movie_list_test_year_removed").find(query).toArray(function(err, result) {
            if (err) throw err;
           // console.log('result ',result);
          

            db.close();
             //console.log('REsultT',result)
             
             if (result.length == 0) {
              var ermsg = 'Oh No!! My database currently limited to only 1000 movies'
              sendTextMessage(req.body,ermsg);
            }
            
            else if  (result.length > 0){
              //console.log('REsult',result)
              sendMessage(req.body,result);
            }
            

            });
            console.log('EVENTT',req.body)
           
          });
res.status(200).end();
   }

/////////////// Genre Query ???????????


   else if (req.body.result.action === 'genre_query') {
    console.log('genre_search_list')
    //let mov_name = req.body.result.parameters['Name_list_movie'];
    let genre = req.body.result.parameters['Name_list_genre'];
    //console.log(mov_name)
    //req.body.entry.forEach((entry) => {
      //entry.messaging.forEach((event) => {
        //if (event.message && event.message.text) {
          
          MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var query = { mgenre:  new RegExp('.*' + genre + '.*', 'i')};
          
          console.log('genrequery', query)
          
          db.collection("movie_list_test_year_removed").find(query, [ { $sample: { size: 10 } } ],{Movie_Name: true, mgenre : true , rating_no:true,imdb_movie_poster:true,imurl : true, star_json:true}).limit(10).toArray(function(err, result) {
            if (err) throw err;
           // console.log('result ',result);
          

            db.close();
             //console.log('REsultT',result)
             
             if (result.length == 0) {
              var ermsg = 'Oh No!! My database currently limited to only 1000 movies'
              sendTextMessage(req.body,ermsg);
            }
            
            else if  (result.length > 0){
              //console.log('REsult',result)



              ////////////////////////////////
              sendMessage(req.body,result);
              ////////////////////////////////
            }
            

            });
            console.log('EVENTT',req.body)
           
          });
res.status(200).end();

}


///////////// Language query ///////////////////////

else if (req.body.result.action === 'language_query') {
    console.log('language_search_list')
    //let mov_name = req.body.result.parameters['Name_list_movie'];
    let language = req.body.result.parameters['movie_lang'];
    //console.log(mov_name)
    //req.body.entry.forEach((entry) => {
      //entry.messaging.forEach((event) => {
        //if (event.message && event.message.text) {
          
          MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var query = { language:  new RegExp('.*' + language + '.*', 'i')};
          
          console.log('genrequery', query)
          
          db.collection("movie_list_test_year_removed").find(query,{Movie_Name: true, mgenre : true , rating_no:true,imdb_movie_poster:true,imurl : true, star_json:true}).limit(10).toArray(function(err, result) {
            if (err) throw err;
           // console.log('result ',result);
          

            db.close();
             //console.log('REsultT',result)
             
             if (result.length == 0) {
              var ermsg = 'Oh No!! My database currently limited to only 1000 hindi movies'
              sendTextMessage(req.body,ermsg);
            }
            
            else if  (result.length > 0){
              //console.log('REsult',result)



              ////////////////////////////////
              sendMessage(req.body,result);
              ////////////////////////////////
            }
            

            });
            console.log('EVENTT',req.body)
           
          });
res.status(200).end();

}

//// Cast_query ///////////////////////

   else if(req.body.result.action === 'cast_search.namebase') {
    console.log('cast_search')
    let mov_name = req.body.result.parameters['Name_list_movie'];
    let cast_name = req.body.result.parameters['Name_list_cast'];
    console.log(mov_name)
    //req.body.entry.forEach((entry) => {
      //entry.messaging.forEach((event) => {
        //if (event.message && event.message.text) {
          
          MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var query = { star_json: cast_name };
          
          console.log('query', query)
          
          db.collection("movie_list_test_year_removed").find(query,{'star_json': true}).toArray(function(err, result) {
            if (err) throw err;
           // console.log('result ',result);
          

            db.close();
             console.log('REsultT',result)
             
             if (result.length == 0) {
              var ermsg = 'Oops my database is currently very small buddy!! Let me send all my spiders to get the data!';
              sendTextMessage(req.body,ermsg);
            }
            
            else if  (result.length > 0){
              console.log('REsult',result)


              ////////////////////////////////
              sendcastMessage(req.body,result);
              /////////////////////////////////

            }
            

            });
            console.log('EVENTT',req.body)
           
          });
res.status(200).end();

   }
   else{
    console.log('fallback')
    var msg = 'Sorry my db is small rigth now! My spiders are getting ready to crawl data'
    sendTextMessage(req.body,msg)
   }

 });
    
    



///// SendTextMEssge() function //////////////////////////


function sendTextMessage(event,msg) {
  let sender = event.originalRequest.data.sender.id;
   request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: 'EAACtNnuuHdYBALmEonAuU0fUZAVPZB4sQ6PmQsNbP3AA8mAUtgRHB9rKLqdS1WrgiD4cYIoQoIuylfcwuiIQpsO5g4FKEyMoRKzVyX09ngvrVHcMt3Tnq0d2yWFUK1FhljDi2FZAI0lZB3B7fgseBZBOKFwRV2szlJsMyKVZCXKgZDZD'},
    method: 'POST',
    json: {
      recipient: {id: sender},
                  /////////////////////////////// MEssage Block ////////////////////////////////////
      message: {text : msg}
    }
  });
 }






/////////////////////// send genre messga /////////////////////////

const request = require('request');

const apiaiApp = require('apiai')('b9a186dba6754188a5c8a486c0bd7bc9');
function sendgenreMessage(event,result) {
  let sender = event.originalRequest.data.sender.id;

 //let genre_name = event.result.parameters.Name_list_genre
  //let parameters = event.result.parameters;
  //console.log('sendmessage_result',result)
  
  //console.log('resu',event.result.parameters.Name_list_movie)
 

  console.log('genreresult',result)
  console.log('genreresultlength',result.length)
  mov_name = result[0].Movie_Name
  ratings =result[0].rating_no
  poster = result[0].imdb_movie_poster
  stars = result[0].star_json
  poster = result[0].imdb_movie_poster
  mov_link = result[0].imurl
  console.log(ratings,'p',poster,'star',stars,'molin',mov_link)
  //////////////////////  templete for genrebase mov list//////////////////////////////

var movie_list_genrebase = [
        {
            "title": mov_name,
            "subtitle": "Imdb_rating " + ratings,
            "image_url": poster,
            "buttons": [
              {
                "title": "View_details",
                "type": "web_url",
                "url": mov_link
              },
              {
                "title": "Show similar",
                "type": "web_url",
                "url": "http://www.imdb.com/"}
            ]
          }
  ]


// Looping the causole list of movies or generic cards 

 for(var i = 1; i < result.length;i++){

  movie_list_genrebase.push(
        {
            "title": result[i].Movie_Name,
            "subtitle": "Imdb_ratings " + result[i].rating_no,
            "image_url": result[0].poster,
            "buttons": [
              {
                "title": "View_details",
                "type": "web_url",
                "url": result[i].imurl
              },
              {
                "title": "Show similar",
                "type": "web_url",
                "url": "http://www.imdb.com/"}
            ]
          }
  )
        
}
   request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: 'EAACtNnuuHdYBALmEonAuU0fUZAVPZB4sQ6PmQsNbP3AA8mAUtgRHB9rKLqdS1WrgiD4cYIoQoIuylfcwuiIQpsO5g4FKEyMoRKzVyX09ngvrVHcMt3Tnq0d2yWFUK1FhljDi2FZAI0lZB3B7fgseBZBOKFwRV2szlJsMyKVZCXKgZDZD'},
    method: 'POST',
    json: {
      recipient: {id: sender},
                  /////////////////////////////// MEssage Block ////////////////////////////////////
        "message": {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        //"top_element_style": "compact",
        "elements": movie_list_genrebase
      }
    }
  }
  }
 });
 }




///// SendMEssge() function //////////////////////////
//const request = require('request');

//const apiaiApp = require('apiai')('b9a186dba6754188a5c8a486c0bd7bc9');

function sendMessage(event,result) {
  let sender = event.originalRequest.data.sender.id;
  let mov_name = event.result.parameters.Name_list_movie
  let parameters = event.result.parameters;
  ratings =result[0].rating_no
  poster = result[0].imdb_movie_poster
  stars = result[0].star_json
  poster = result[0].imdb_movie_poster
  mov_link = result[0].imurl
  mov_name = result[0].Movie_Name
  console.log(ratings,'p',poster,'star',stars,'molin',mov_link,mov_name,'length',result.length)
    //////////// Query the database with the params value //////////////////
//template list to show the user///////////////////////////////////////////////////////
var movie_list = [
        {
            "title": mov_name,
            "subtitle": "Imdb_rating " + ratings,
            "image_url": poster,
            "buttons": [
              {
                "title": "View_details",
                "type": "web_url",
                "url": "http://www.imdb.com//title/"+mov_link
              },
              {
                "title": "Show similar",
                "type": "web_url",
                "url": "http://www.imdb.com/"}
            ]
          }
  ]
// Looping the causole list of movies or generic cards 
 for(var i = 1; i < result.length;i++){
    ratings =result[i].rating_no
  poster = result[i].imdb_movie_poster
  stars = result[i].star_json
  poster = result[i].imdb_movie_poster
  mov_link = result[i].imurl
  m = result[i].Movie_Name
  console.log(ratings,'poster',poster,'star',stars,'movlink',mov_link,'mov_name',m)
  movie_list.push(
        {
            "title": result[i].Movie_Name,
            "subtitle": "Imdb_ratings " + result[i].rating_no,
            "image_url": result[i].imdb_movie_poster,
            "buttons": [
              {
                "title": "View_details",
                "type": "web_url",
                "url": "http://www.imdb.com//title/"+result[i].imurl
              },
              {
                "title": "Show similar",
                "type": "web_url",
                "url": "http://www.imdb.com/"}
            ]
          }
  )
        
}
console.log('out',movie_list)
       //////// Posting the fb with the computed results 
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: 'EAACtNnuuHdYBALmEonAuU0fUZAVPZB4sQ6PmQsNbP3AA8mAUtgRHB9rKLqdS1WrgiD4cYIoQoIuylfcwuiIQpsO5g4FKEyMoRKzVyX09ngvrVHcMt3Tnq0d2yWFUK1FhljDi2FZAI0lZB3B7fgseBZBOKFwRV2szlJsMyKVZCXKgZDZD'},
    method: 'POST',
    json: {
      recipient: {id: sender},
                  /////////////////////////////// MEssage Block ////////////////////////////////////
      "message": {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        //"top_element_style": "compact",
        "elements": movie_list
      }
    }
  }
      //////////////////////////////////////////////////////// End of MEssage Block ////////////////////////////////////
      }
    }, (error, response) => {
      if (error) {
          console.log('Error sending message: ', error);
      } else if (response.body.error) {
          console.log('Error: ', response.body.error);
      }
 
 });
};


