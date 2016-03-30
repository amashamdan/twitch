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
				appendUsers(results[i].photo, results[i].link, results[i].user, results[i].status);
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
			/* If the account is closed or offline, appendUser is called to append user's info */
			if (results[i].status == "Account closed" || results[i].status == "Offline"){
				appendUsers(results[i].photo, results[i].link, results[i].user, results[i].status);
			}
		}		
	})
	/* When All button is clicked, all users are displayed on the page. */
	$("#show-all").click(function() {
		/* The users class is emptied. */
		$(".users").html("");
		for (var i = 0; i < results.length; i++){
			appendUsers(results[i].photo, results[i].link, results[i].user, results[i].status);			
		}	
	})
	/* Invert the color of the clicked filter button */
	$(".status-button").click(function() {
		$(this).css({"color": "white", "backgroundColor": "#246868"});
		$(this).siblings().css({"color": "#246868", "backgroundColor": "white"});
	})
})

// The variable users has all the users for which the code will check he status.
var users = ["freecodecamp", "storbeck", "terakilobyte", "habathcx","RobotCaleb",
"thomasballinger","noobs2ninjas","beohoff", "comster404", "brunofin", "esl_sc2",
"ogamingsc2", "cretetion", "test_channel", "sheevergaming", "tr7k"];

// The array results will store information about all users after a response is received.
var results = [];


/* A placeholder image to show for offline users and the users with closed accounts. */
var noImageUrl = "http://i446.photobucket.com/albums/qq186/amashamdan2/Untitled_zpssgvkrhao.jpg";

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
	  	/* A call to the function appendUsers to append the user's info to the page. */
	  	appendUsers(data["stream"]["channel"]["logo"], data["stream"]["channel"]["url"],
	  			users[i], "Online: " + data["stream"]["channel"]["status"]);
	  /* If the account is closed, the following executes. */
	  } else if (data.error) {
	  	results.push({"user": users[i], 
	  				"status": "Account closed",
	  				/* The link below is given the shown value so when the link is clicked,
	  				it won't do anything. an empty href "" will reload the page. */
	  				"link": "javascript:;",
	  				"photo": noImageUrl});
	  	/* A call to the function appendUsers to append the user's info to the page. */
	  	appendUsers(noImageUrl, "javascript:;", users[i], "Account closed");
	  } else {
	  	/* If the user exists but doesn't stream, the following executes. */
	  	results.push({"user": users[i], 
	  				"status": "Offline",
	  				"link": "https://secure.twitch.tv/" + users[i],
	  				"photo": noImageUrl});
	  	/* A call to the function appendUsers to append the user's info to the page. */
	  	appendUsers(noImageUrl, "https://secure.twitch.tv/" + users[i], users[i], "Offline");
	  }
	});
}

/* This function appends the user's info when the user is online. */
function appendUsers(img, url, user, status){
	$(".users").append("<div class='user'><div class'logo'><img class='photo' src=" + img +
	  					"></img></div><div class='user-info'><div class='username'><a class='link' target='blank' href=" +
	  					url +">" + user + "</a></div><div class='status'>" + status + "</div></div></div>");
}