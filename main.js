//Form Submission
var userInput;
var form = document.querySelector("form");

form.addEventListener("submit", function (event) {
  event.preventDefault();
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
      maxResults: 1,
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
  var iFrame = document.createElement("iframe");
  iFrame.setAttribute('src', 'https://www.youtube.com/embed/' + data.items[0].id.videoId)

  var vidTitle = document.createElement("h4");
  vidTitle.textContent = data.items[0].snippet.title;

  var vidDescription = document.createElement("p");
  vidDescription.textContent = data.items[0].snippet.description;

  document.querySelector("div#ytdiv").append(iFrame, vidTitle, vidDescription);


  // $('iframe').attr('src', 'https://www.youtube.com/embed/' + data.items[0].id.videoId)
  // $('h4.title').text(data.items[0].snippet.title);
  // $('.description').text(data.items[0].snippet.description);
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
    var articleLink = articleResults[0].link;
    var articleURL = articleLink.url;
    var nyTimeLink = document.createElement("p");
    nyTimeLink.append(articleURL);
    document.querySelector("div#nydiv").append(nyTimeLink);
  }

  function logError(err) {
    console.log("error", err)
  }
}
