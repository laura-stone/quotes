var user = {
	myQuotes: []
};
var returnUser = JSON.parse(localStorage.getItem('user'));
	if (returnUser !== null) {
		user.myQuotes = returnUser.myQuotes;
	}
/* Add Quote Button */
// Toggle form visibility when Add Quote button clicked
$("#add-quote").on("click", function() {
	$("form").toggleClass("hidden-xs hidden-sm hidden-md hidden-lg");
});
// Add form contents to quotes array
var quote;
$("form").on("submit", function(e) {
	quote = {};
	$(this).find("[name]").each(function(index, num) {
		var that = $(this),
			name = that.attr("name"),
			num = that.val();
			if (num === "") {
				console.log("well, that was blank");
				alert("Please enter a quote and author");
				return false;
			}
			else {
				quote[name] = num;
			}
	});
	if (quote.quote !== undefined && quote.author !== undefined) {
		user["myQuotes"].push(quote);
		localStorage.setItem('user', JSON.stringify(user));
	}
	$("input[type=text]").val("");

});

/* Quote Me! Button */
// Generates a new quote and displays it
$("#json-quote").on("click", function(e) {
	src = 'http://iheartquotes.com/api/v1/random';
	makeRequest(src);
});
// Need to circumvent API that does not allow CORS
// Uses Yahoo's YQL to parse data from iheartquotes API
function makeRequest(url) {
	$.ajax({
    url: "http://query.yahooapis.com/v1/public/yql",
    jsonp: "callback",
    dataType: "jsonp",
    // tell YQL what we want and that we want JSON
    data: {
        q: "select * from json where url=\"http://www.iheartquotes.com/api/v1/random?format=json\"",
        format: "json"
    },
    // work with the response
    success: function( response ) {
        var data = response.query.results.json;
        if ($("#my-quotes-list").children().length > 0) {
			console.log("the list exists");
			$("#my-quotes-list").hide();
			$("#quote-area").append('<p id="quote"></p>');
		}
        $("#quote").text(data.quote);
        $("#author").hide();
    }
});
}

/* My Quotes Button */
// Displays a list of the quotes you have added
$("#my-quotes").on("click", displayMyQuotes);
function displayMyQuotes() {
	// need to clear the page if it already lists the quotes
	$("ul").remove();
	var array = user.myQuotes;
	if (array.length > 0) {
		$("#quote").remove();
		$("#author").remove();
		$("#quote-area").append('<ul id="my-quotes-list"></ul>');
		array.forEach(addQuoteToPage);
	}
	else {
		$("p").first().text("You have not added any quotes!");
		$("p").last().hide();
	}
}
function addQuoteToPage(quote) {
	var text;
	var author;
	$.each(quote, function(key, value) {
		if (key == "quote") {
			text = value;
		}
		else {
			author = value;
		}
	});
	$("#my-quotes-list").append("<li><p>" + text + "<small><cite>" + author + "</cite></small></p>");
}