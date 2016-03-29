// The variable users has all the users for which the code will check he status.
var users = ["freecodecamp", "storbeck", "terakilobyte", "habathcx","RobotCaleb",
"thomasballinger","noobs2ninjas","beohoff", "comster404", "brunofin", "esl_sc2",
"ogamingsc2", "cretetion", "test_channel", "sheevergaming", "tr7k"];

// The array results will store information about all users after a response is received.
var results = [];

// The loop generates an api url for each user and calls getInfo function with the generated url.
for (var i = 0; i < users.length; i++) {
	var user = users[i];
	var twitchUrl = "https://api.twitch.tv/kraken/streams/" + user + "?callback=?";
	getInfo(twitchUrl, i);
}

/* This function requests information about each user and the results are saved and appended
to users class depending on the status. i is passed as an argument because the code will keep
running before the response is received, so it keeps track of which user's data we're working with. */
function getInfo(url, i) {

	$.getJSON(url, function(data) {
	  /* If the user is streaming, the following executes. The results array will be used to filter
	  the results later. */
	  if (data.stream) {
	  	results.push({"user": users[i], 
	  				"status": "Online: " + data["stream"]["channel"]["status"],
	  				"link": data["stream"]["channel"]["url"],
	  				"photo": data["stream"]["channel"]["logo"]});
	  	$(".users").append("<div class='user'><img class='photo' src=" + data["stream"]["channel"]["logo"] +
	  						"><a class='link' target='blank' href=" + data["stream"]["channel"]["url"] +
	  						">" + users[i] + "</a>" + "Online: " + data["stream"]["channel"]["status"] +
	  						"</div>");
	  /* If the account is closed, the following executes. */
	  } else if (data.error) {
	  	results.push({"user": users[i], 
	  				"status": "Account closed",
	  				"link": ""});
	  	$(".users").append("<div class='user'><div class='no-photo'>NA</div>" + users[i] + " Account closed</div>"); 
	  } else {
	  	/* If the user exists but doesn't stream, the following executes. */
	  	results.push({"user": users[i], 
	  				"status": "Offline",
	  				"link": "https://secure.twitch.tv/" + users[i]});
	  	$(".users").append("<div class='user'><div class='no-photo'>NA</div>" + 
	  						"<a class='link' target='blank' href='https://secure.twitch.tv/" + users[i] +
	  						"'>" + users[i] + "</a>" + "Offline</div>");
	  }
	});
}

