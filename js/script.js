// The click events handlers need to be inside .ready function to work properly.
$(document).ready(function(){
	/* when the "Online" button is clicked, the code shows online users only */
	$("#show-online").click(function() {
		/* The users class is emptied. */
		$(".users").html("");
		/* The loop checks for each user in results, if the user isn't offline and
		if the user's account is not closed, the info are appended to the page. */
		for (var i = 0; i < results.length; i++){
			if (results[i].status != "Account closed" && results[i].status != "Offline"){
				online(results[i].photo, results[i].link, results[i].user, results[i].status);
			}
		}
	})
	/* when the "Offline" button is clicked, the code shows offline users and the
	users with closed accounts */
	$("#show-offline").click(function() {
		/* The users class is emptied. */
		$(".users").html("");
		/* The loop checks the status of each user */
		for (var i = 0; i < results.length; i++){
			/* If the account is closed, the closed function is called to append user's info */
			if (results[i].status == "Account closed"){
				closed(results[i].user);
			/* If the user is offline, offline function is called to append user's info */
			} else if (results[i].status == "Offline") {
				offline(results[i].user);
			}
		}		
	})
	/* When All button is clicked, all users are displayed on the page. */
	$("#show-all").click(function() {
		/* The users class is emptied. */
		$(".users").html("");
		for (var i = 0; i < results.length; i++){
			/* If the account is closed, the closed function is called to append user's info */
			if (results[i].status == "Account closed"){
				closed(results[i].user);
			/* If the user is offline, offline function is called to append user's info */
			} else if (results[i].status == "Offline") {
				offline(results[i].user);
			} else {
				online(results[i].photo, results[i].link, results[i].user, results[i].status);
			}			
		}	
	})
})

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
	  	/* A call to the function online to append the user's info if the user is online */
	  	online(data["stream"]["channel"]["logo"], data["stream"]["channel"]["url"],
	  			users[i], data["stream"]["channel"]["status"]);
	  /* If the account is closed, the following executes. */
	  } else if (data.error) {
	  	results.push({"user": users[i], 
	  				"status": "Account closed",
	  				"link": ""});
	  	/* A call to the function closed to append the user's info if the user's account is closed */
	  	closed(users[i]);
	  } else {
	  	/* If the user exists but doesn't stream, the following executes. */
	  	results.push({"user": users[i], 
	  				"status": "Offline",
	  				"link": "https://secure.twitch.tv/" + users[i]});
	  	/* A call to the function offline to append the user's info if the user is offline */
	  	offline(users[i]);
	  }
	});
}

/* This function appends the user's info when the user is online. */
function online(img, url, user, status){
	$(".users").append("<div class='user'><img class='photo' src=" + img +
	  					"><a class='link' target='blank' href=" + url +">" + user + 
	  					"</a>" + "Online: " + status + "</div>");
}

/* This function appends the user's info when the user's account is closed'. */
function closed(user){
	$(".users").append("<div class='user'><div class='no-photo'>NA</div>" + 
		user + " Account closed</div>"); 
}

/* This function appends the user's info when the user is offline. */
function offline(user){
	$(".users").append("<div class='user'><div class='no-photo'>NA</div>" + 
	  					"<a class='link' target='blank' href='https://secure.twitch.tv/" + user +
	  					"'>" + user + "</a>" + "Offline</div>");
}
