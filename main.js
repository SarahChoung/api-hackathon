//Form Submission
var userInput;
var form = document.querySelector("form");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  resetSearch();
  var textInput = event.target[0];
  var textValue = textInput.value;
  var textNoSpace = textValue.split(" ").join("_");
  userInput = textNoSpace;

  getArticle();
  getVideo();
  getTrailer();
})


//YOUTUBE VIDEO

function getTrailer() {
  var ytUserInput = "";
  if (userInput.includes("trailer") === false) {
    ytUserInput = userInput.split("_").join("") + "trailer";
  }

  $.ajax({
    type: 'GET',
    url: 'https://www.googleapis.com/youtube/v3/search',
    data: {
      key: youtubeAPIKey,
      q: ytUserInput,
      part: 'snippet',
      maxResults: 1,
      type: 'video',
      videoEmbeddable: true,
    },
    success: function (data) {
      embedTrailer(data);
    },
    error: function(response) {
      console.log("Request Failed");
    }
  });
}

function getVideo() {
  var ytUserInput = "";
  if (userInput.includes("movie")==false) {
    ytUserInput = userInput.split("_").join("") + "review";
  }

  $.ajax({
    type: 'GET',
    url: 'https://www.googleapis.com/youtube/v3/search',
    data: {
      key: youtubeAPIKey,
      q: ytUserInput,
      part: 'snippet',
      maxResults: 10,
      type: 'video',
      videoEmbeddable: true,
    },
    success: embedVideo,
    error: function(response) {
      console.log("Request Failed");
    }
  });
}

function embedTrailer(data) {
  //delete img
  var suchEmpty1 = document.querySelector("img#suchempty1")
  if (suchEmpty1) {
    suchEmpty1.classList.add("d-none");
  }

  if (data.items.length === 0) {
    var noTrailerAvailable = document.createElement("p");
    noTrailerAvailable.textContent = "There are no available trailers on YouTube for this movie.";
    document.querySelector("div#trailerdiv").append(noTrailerAvailable);
  } else {
    var iFrame = document.createElement("iframe");
    iFrame.setAttribute('src', 'https://www.youtube.com/embed/' + data.items[0].id.videoId)

    var videoDiv = document.createElement("div");
    var vidTitle = document.createElement("h4");
    vidTitle.textContent = data.items[0].snippet.title;

    videoDiv.append(iFrame, vidTitle);
    document.querySelector("div#trailerdiv").append(videoDiv);
  }
}


function embedVideo(data) {
  //delete img
  var suchEmpty3 = document.querySelector("img#suchempty3");
  if (suchEmpty3) {
    suchEmpty3.classList.add("d-none");
  }

  if (data.items.length === 0) {
    var noVideosAvailable = document.createElement("p");
    noVideosAvailable.textContent = "There are no YouTube video reviews for this movie.";
    document.querySelector("div#ytdiv").append(noVideosAvailable);
  } else {
    for (var i=0; i<data.items.length; i++) {
      var iFrame = document.createElement("iframe");
      iFrame.setAttribute('src', 'https://www.youtube.com/embed/' + data.items[i].id.videoId)

      var videoDiv = document.createElement("div");
      var vidTitle = document.createElement("p");
      vidTitle.textContent = data.items[i].snippet.title;

      videoDiv.append(iFrame, vidTitle);
      document.querySelector("div#ytdiv").append(videoDiv);
    }
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
    //delete img
    var suchEmpty2 = document.querySelector("img#suchempty2")
    if (suchEmpty2) {
      suchEmpty2.classList.add("d-none");
    }

    var articleResults = data.results;

    if (articleResults.length === 0) {
      var noArticleAvailable = document.createElement("p");
      noArticleAvailable.textContent = "There are no NY Times reviews for this movie.";
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

//Reset Search

function resetSearch() {
  var nyDiv = document.querySelector("ul#nydiv");
  while (nyDiv.firstChild) {
    nyDiv.removeChild(nyDiv.lastChild);
  }

  var ytDiv = document.querySelector("div#ytdiv");
  while (ytDiv.firstChild) {
    ytDiv.removeChild(ytDiv.lastChild);
  }

  var trailerDiv = document.querySelector("div#trailerdiv")
  while (trailerDiv.firstChild) {
    trailerDiv.removeChild(trailerDiv.lastChild);
  }
}

//Reset Page Button Functionality
var resetButton = document.querySelector("button#resetbutton");

var trailerImage = document.querySelector("img#suchempty1");
var nyImage = document.querySelector("img#suchempty2");
var ytImage = document.querySelector("img#suchempty3");

resetButton.addEventListener("click", function() {
  resetSearch();

  if (trailerImage.classList.contains("d-none") || nyImage.classList.contains("d-none") || ytImage.classList.contains("d-none")) {
    trailerImage.classList.remove("d-none");
    nyImage.classList.remove("d-none");
    ytImage.classList.remove("d-none");
  }
})
