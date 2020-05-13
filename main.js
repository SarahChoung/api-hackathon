//Form Submission
var userInput;
var form = document.querySelector("form");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  resetSearch();
  var textInput = event.target[0];
  var textValue = textInput.value;
  var textNoSpace = textValue.split(" ").join("_");
  console.log(textNoSpace);
  userInput = textNoSpace;

  getArticle();
  getVideo();
})


//YOUTUBE VIDEO
function getVideo() {
  $.ajax({
    type: 'GET',
    url: 'https://www.googleapis.com/youtube/v3/search',
    data: {
      key: youtubeAPIKey,
      q: userInput,
      part: 'snippet',
      maxResults: 10,
      type: 'video',
      videoEmbeddable: true,
    },
    success: function(data) {
      embedVideo(data);
    },
    error: function (response) {
      console.log("Request Failed");
    }
  });
}

function embedVideo(data) {
  console.log(data.items);

  for (var i=0; i<data.items.length; i++) {
    var iFrame = document.createElement("iframe");
    iFrame.setAttribute('src', 'https://www.youtube.com/embed/' + data.items[i].id.videoId)

    var videoDiv = document.createElement("div");
    var vidTitle = document.createElement("h4");
    vidTitle.textContent = data.items[i].snippet.title;

    videoDiv.append(iFrame, vidTitle);
    document.querySelector("div#ytdiv").append(videoDiv);
  }
}

//NY TIMES ARTICLE
function getArticle() {
  $.ajax({
    url: "https://api.nytimes.com/svc/movies/v2/reviews/search.json?query=" + userInput + "&api-key=" + nyTimesAPIKey,
    success: embedArticle,
    error: logError
  })

  function embedArticle(data) {
    var articleResults = data.results;

    if (articleResults.length === 0) {
      var noArticleAvailable = document.createElement("p");
      noArticleAvailable.textContent = "There are no movie reviews for this movie.";
      document.querySelector("ul#nydiv").append(noArticleAvailable);
    } else {
      for (var i=0; i < articleResults.length; i++) {
        var articleLink = articleResults[i].link;
        var articleURL = articleLink.url;
        var articleHeadline = articleResults[i].headline;

        var nyTimeListEl = document.createElement("li");
        var nyTimeLink = document.createElement("a");
        nyTimeLink.setAttribute('href', articleURL);
        nyTimeLink.textContent = articleHeadline;

        nyTimeListEl.append(nyTimeLink);
        document.querySelector("ul#nydiv").append(nyTimeListEl);
      }
    }
  }

  function logError(err) {
    console.log("error", err)
  }
}

//Reset Functionality

function resetSearch() {
  var nyDiv = document.querySelector("ul#nydiv");
  while (nyDiv.firstChild) {
    nyDiv.removeChild(nyDiv.lastChild);
  }

  var ytDiv = document.querySelector("div#ytdiv");
  while (ytDiv.firstChild) {
    ytDiv.removeChild(ytDiv.lastChild);
  }
}
