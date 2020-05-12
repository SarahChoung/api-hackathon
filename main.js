// NYTimes  API key: HaKYObfArvAiEEXXYE4S7EXBYOd0mpP0
// YT API key: AIzaSyDk49iU_ZTZcnVKaF3dRbOtFEtZWhINHgc


//YOUTUBE VIDEO
function getVideo() {
  $.ajax({
    type: 'GET',
    url: 'https://www.googleapis.com/youtube/v3/search',
    data: {
      key: 'AIzaSyDk49iU_ZTZcnVKaF3dRbOtFEtZWhINHgc',
      q: "videogamedunkey",
      part: 'snippet',
      maxResults: 1,
      type: 'video',
      videoEmbeddable: true,
    },
    success: function (data) {
      embedVideo(data)
    },
    error: function (response) {
      console.log("Request Failed");
    }
  });
}

function embedVideo(data) {
  $('iframe').attr('src', 'https://www.youtube.com/embed/' + data.items[0].id.videoId)
  $('h4.title').text(data.items[0].snippet.title)
  $('.description').text(data.items[0].snippet.description)
}


//NY TIMES ARTICLE
function getArticle() {
  $.ajax({
    url: "https://api.nytimes.com/svc/movies/v2/reviews/search.json?query=godfather&api-key=HaKYObfArvAiEEXXYE4S7EXBYOd0mpP0",
    success: logResult,
    error: logError
  })

  function logResult(result) {
    console.log("success!", result)
  }

  function logError(err) {
    console.log("error", err)
  }
}
