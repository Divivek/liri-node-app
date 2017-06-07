  var keys   = require("./key.js");
  var twit   = require('twit');
  var request= require('request');
  var fs     = require ("fs");
  var client = new twit(keys.twitterKeys);
  var Spotify= require('node-spotify-api');
  spotify    = new Spotify(keys.spotifyApi);
  
  var nodeArgv = process.argv;
  var command  = process.argv[2];
  //movie or song
  var x = "";
  
  //loop
  for (var i=3; i<nodeArgv.length; i++) {
  	 if(i>3 && i<nodeArgv.length){
  	   x = x + "+" + 'nodeArgv[i]';
  	 } else {
  	    x = x + nodeArgv[i];
	     }
  }

  //switch case
  switch(command){
	   case "my-tweets":
  	  	showTweets();
        break;

  	 case "spotify-this-song":
  	    if(x){
  	      spotifySearch(x);
  	    }else {
  	      spotifySearch("What do you mean");
  	    }
  	  	break;

	  	case "movie-this":
  	    if(x){
  	      omdbData(x)
  	    } else{
  	      omdbData("Mr. Nobody")
  	    }
  	 	  break;

		  case "do-what-it-says":
		    doThing();
		    break;

		  default:
		    console.log("{Please enter a command: my-tweets, spotify-this-song, movie-this, do-what-it-says}");
		  break;
	}
  
  	function showTweets() {
	   	var screenName = {screenName:"ProjectLiri"}
	    client.get('statuses/user_timeline', screenName, function(error,tweets,response ){
		    if (!error) {
		      for (var i = 0;i< tweets.length ; i++){
		 		  console.log(tweets[i].created_at + ": "+ tweets[i].text ); 
		 		  fs.appendFileSync('log.txt', "ProjectLiri: " + tweets[i].text);
		      }			
		 	  } else {
		      console.log('Error occurred');
		 	  }
	  })
	}

  function omdbData(movie){
    var omdbURL = 'http://www.omdbapi.com/?apikey=40e9cece&t=' + movie + '&plot=short&tomatoes=true';
     request(omdbURL,function (error, response, body){
       if(!error && response.statusCode == 200){
        var body = JSON.parse(body);
        
        console.log("Title: " + body.Title);
        console.log("Release Year: " + body.Year);
        console.log("IMdB Rating: " + body.imdbRating);
        console.log("Country: " + body.Country);
        console.log("Language: " + body.Language);
        console.log("Plot: " + body.Plot);
        console.log("Actors: " + body.Actors);
        console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
        console.log("Rotten Tomatoes URL: " + body.tomatoURL);

        fs.appendFileSync('log.txt', "Title: " + body.Title);
        fs.appendFileSync('log.txt', "Release Year: " + body.Year);
        fs.appendFileSync('log.txt', "IMdB Rating: " + body.imdbRating);
        fs.appendFileSync('log.txt', "Country: " + body.Country);
        fs.appendFileSync('log.txt', "Language: " + body.Language);
        fs.appendFileSync('log.txt', "Plot: " + body.Plot);
        fs.appendFileSync('log.txt', "Actors: " + body.Actors);
        fs.appendFileSync('log.txt', "Rotten Tomatoes Rating: " + body.tomatoRating);
        fs.appendFileSync('log.txt', "Rotten Tomatoes URL: " + body.tomatoURL);
        } 
     });
  }
    

  function spotifySearch(Song) {
    spotify.search({ type: 'track', query: Song })
      .then(function(data) {
        console.log(data);
			   for(var i = 0; i < data.tracks.items.length; i++){
		        var songData = data.tracks.items[i];
		        //artist
		        console.log("Artist: " + songData.artists[0].name);
		        //song name
		        console.log("Song: " + songData.name);
		        //spotify preview link
		        console.log("Preview URL: " + songData.preview_url);
		        //album name
		        console.log("Album: " + songData.album.name);
		        console.log("-----------------------");
	        
		           // adds text to log.txt
		        fs.appendFileSync('log.txt', songData.artists[0].name);
		        fs.appendFileSync('log.txt', songData.name);
		        fs.appendFileSync('log.txt', songData.preview_url);
		        fs.appendFileSync('log.txt', songData.album.name);
		        fs.appendFileSync('log.txt', "-----------------------");   	
        	}		

  })
  .catch(function(err) {
    console.log(error);
    });
	}
  function doThing(){
    fs.readFile('random.txt', "utf8", function(error, data){
    var txt = data.split(',');
    spotifySearch(txt[0]);
    });
  }
