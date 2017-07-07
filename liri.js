//node package dependencies
var request = require('request');
var twitter = require('twitter');
var spotify = require('node-spotify-api');
var fs = require('fs');

//twitter api keys imported from a secure file
var keys = require("./keys.js");
//grabbing the user input for which "function" they want to run
var inputString = process.argv[2];

//defining keys for the twitter API
var client = new twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
});

 
var spotify = new spotify({
  id: 'ddcdca62295e40c7b8739ffec96511aa',
  secret: '82c94f173e2149e9a521d28cdc750e77'
});


switch (inputString) {

    case "help":
        console.log("Liri is a bot that can connect to your twitter, spoitfy, and the OMBD database. Try typing node liri.js my-tweets, node liri.js spotify-this-song, node liri.js movie-this, or node liri.js do-what-it-says.");
        break;

        //=========================================

    case "my-tweets":
        getTweets();
        break;

        //=========================================

    case "spotify-this-song":
    	var songName = "";
        getSong();
        break;

        //=========================================

    case "movie-this":
        var title = "";
        defineMovie();
        break;

        //=========================================

    case "do-what-it-says":
        doIt();
        break;
} //end of switch case function

//=========================================
//fuctions defined
//=========================================

function getTweets() {
    var params = {
        screen_name: 'chancetherapper',
        count: 20
    };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log('%j \n', tweets[i].text);
            }
        }
    });
} //end of get Tweets

//=========================================
function getSong() {
    if (process.argv.length < 4) {
        songName = "Ace of Base - The Sign";
        runSong();
    } else {
        songName = process.argv[3];
        runSong();
    }
} //end of getSong

function runSong() {

    spotify.search({ type: 'track', query: songName }, function(err, data) {

        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }

        console.log(data.tracks.items[0].album.artists[0].name);
        console.log(data.tracks.items[0].name);
        console.log(data.tracks.items[0].preview_url);
        console.log(data.tracks.items[0].album.name);

    });//end of spotify.search
} //end of runSong

//=========================================

function defineMovie(){
	if (process.argv.length < 4) {
        title = "Mr. Nobody";
        getMovie();
    } else {
        title = process.argv[3];
        getMovie();
    }
}//end of defineMovie
function getMovie() {
    request("http://www.omdbapi.com/?apikey=40e9cece&t=" + title + "&y=&plot=short&r=json", function(error, response, body) {

        if (!error && response.statusCode === 200) {

            console.log("---------------------")
            console.log("The movie's title is: " + JSON.parse(body).Title);
            console.log("---------------------")
            console.log("It was released in: " + JSON.parse(body).Year);
            console.log("---------------------")
            console.log("The movie's IMBD rating is: " + JSON.parse(body).imdbRating);
            console.log("---------------------")
            console.log("The movie was produced in: " + JSON.parse(body).Country);
            console.log("---------------------")
            console.log("The movie's main language is: " + JSON.parse(body).Language);
            console.log("---------------------")
            console.log("The movie's plot is: " + JSON.parse(body).Plot);
            console.log("---------------------")
            console.log("The movie's actors incude: " + JSON.parse(body).Actors);
            console.log("---------------------")
            console.log("The movie's Rotten Tomatos rating is: " + JSON.parse(body).Ratings[1].Value);
        }
    }); //end of request
} //end of getMovie

//=========================================

function doIt(){
	fs.readFile("random.txt", "utf8", function(error, data){
		var myArr = data.split(",")
		songName = myArr[1] 
		runSong();
	})//end of readFile 
}//end of doit