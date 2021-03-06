//Form Submission
let userInput;

const form = document.querySelector("form");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  resetSearch();
  const textInput = event.target[0].value;
  const textNoSpace = textInput.split(" ").join("_");
  userInput = textNoSpace;

  const loadingScreen = document.getElementById("loading");
  loadingScreen.classList.remove("d-none");
  const resetButton = document.getElementById("resetbutton");
  resetButton.classList.remove("disabled");
  resetButton.setAttribute("aria-disabled", "false");

  getArticle();
  getVideo();
  getTrailer();

  setTimeout(() => {
    const info = document.getElementById("info");
    info.classList.remove("d-none");
    loadingScreen.classList.add("d-none");
  }, 3000);

  setTimeout(() => {
    $([document.documentElement, document.body]).animate(
      {
        scrollTop: $("#info").offset().top,
      },
      500
    );
  }, 3000);
});

//YOUTUBE VIDEO

function getTrailer() {
  let ytUserInput = "";
  if (userInput.includes("trailer") === false) {
    ytUserInput = userInput.split("_").join("") + "trailer";
  }

  $.ajax({
    type: "GET",
    url: "https://www.googleapis.com/youtube/v3/search",
    data: {
      key: youtubeAPIKey,
      q: ytUserInput,
      part: "snippet",
      maxResults: 1,
      type: "video",
      videoEmbeddable: true,
    },
    success: embedTrailer,
    error: function (err) {
      let trailerError = document.createElement("p");
      trailerError.textContent = "An error occurred.";
      document.getElementById("trailerdiv").append(trailerError);
    },
  });
}

function getVideo() {
  let ytUserInput = "";
  if (userInput.includes("movie") == false) {
    ytUserInput = userInput.split("_").join("") + "review";
  }

  $.ajax({
    type: "GET",
    url: "https://www.googleapis.com/youtube/v3/search",
    data: {
      key: youtubeAPIKey,
      q: ytUserInput,
      part: "snippet",
      maxResults: 5,
      type: "video",
      videoEmbeddable: true,
    },
    success: embedVideo,
    error: function (err) {
      let videoError = document.createElement("p");
      videoError.textContent = "An error occurred.";
      document.getElementById("ytdiv").append(videoError);
    },
  });
}

function embedTrailer(data) {
  if (data.items.length === 0) {
    let noTrailerAvailable = document.createElement("p");
    noTrailerAvailable.textContent =
      "There are no available trailers on YouTube for this movie.";
    document.getElementById("trailerdiv").append(noTrailerAvailable);
  } else {
    let iFrame = document.createElement("iframe");
    iFrame.setAttribute(
      "src",
      "https://www.youtube.com/embed/" + data.items[0].id.videoId
    );
    iFrame.classList.add("mw-100");

    let trailerDiv = document.createElement("div");
    let vidTitle = document.createElement("h4");
    let vidTitleText = decodeEntities(data.items[0].snippet.title);
    vidTitle.textContent = vidTitleText;

    trailerDiv.append(iFrame, vidTitle);
    trailerDiv.classList.add("p-1");
    document.getElementById("trailerdiv").append(trailerDiv);
  }
}

function embedVideo(data) {
  if (data.items.length === 0) {
    let noVideosAvailable = document.createElement("p");
    noVideosAvailable.textContent =
      "There are no YouTube video reviews for this movie.";
    document.getElementById("ytdiv").append(noVideosAvailable);
  } else {
    for (let i = 0; i < data.items.length; i++) {
      let iFrame = document.createElement("iframe");
      iFrame.setAttribute(
        "src",
        "https://www.youtube.com/embed/" + data.items[i].id.videoId
      );
      iFrame.classList.add("mw-100");

      let videoDiv = document.createElement("div");
      videoDiv.classList.add("video-div");
      let vidTitle = document.createElement("p");
      let vidText = decodeEntities(data.items[i].snippet.title);
      vidTitle.textContent = vidText;
      vidTitle.classList.add("video-title");

      videoDiv.append(iFrame, vidTitle);
      document.getElementById("ytdiv").append(videoDiv);
    }
  }
}

//NY TIMES ARTICLE
function getArticle() {
  $.ajax({
    url:
      "https://api.nytimes.com/svc/movies/v2/reviews/search.json?query=" +
      userInput +
      "&api-key=" +
      nyTimesAPIKey,
    success: embedArticle,
    error: function (err) {
      let articleError = document.createElement("p");
      articleError.textContent = "An error occurred.";
      document.getElementById("nydiv").append(articleError);
    },
  });

  function embedArticle(data) {
    const articleResults = data.results;

    if (articleResults.length === 0) {
      let noArticleAvailable = document.createElement("p");
      noArticleAvailable.textContent =
        "There are no NY Times reviews for this movie.";
      document.getElementById("nydiv").append(noArticleAvailable);
    } else {
      for (let i = 0; i < articleResults.length; i++) {
        const articleLink = articleResults[i].link;
        const articleURL = articleLink.url;
        const articleHeadline = articleResults[i].headline;
        const articleSummary = articleResults[i].summary_short;

        let titleButton = document.createElement("button");
        titleButton.classList.add("accordion");
        titleButton.textContent = articleHeadline;

        let accordionDiv = document.createElement("div");
        accordionDiv.classList.add("panel");

        let articleParagraph = document.createElement("p");
        if (articleSummary === "") {
          articleParagraph.textContent = "No summary available";
        } else {
          let text = decodeEntities(articleResults[i].summary_short);
          articleParagraph.textContent = text;
        }

        let articleLinkPath = document.createElement("a");
        articleLinkPath.setAttribute("href", articleURL);
        articleLinkPath.textContent = "Click here to go to the full article.";

        let nydiv = document.getElementById("nydiv");
        accordionDiv.append(articleParagraph, articleLinkPath);
        nydiv.append(titleButton, accordionDiv);
      }

      let acc = document.getElementsByClassName("accordion");
      for (let i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function () {
          this.classList.toggle("active");
          let panel = this.nextElementSibling;
          if (panel.style.display === "block") {
            panel.style.display = "none";
          } else {
            panel.style.display = "block";
          }
        });
      }
      articleLoaded = true;
    }
  }
}

//Reset Search

function resetSearch() {
  document.getElementById("info").classList.add("d-none");

  let nyDiv = document.getElementById("nydiv");
  while (nyDiv.firstChild) {
    nyDiv.removeChild(nyDiv.lastChild);
  }

  let ytDiv = document.getElementById("ytdiv");
  while (ytDiv.firstChild) {
    ytDiv.removeChild(ytDiv.lastChild);
  }

  let trailerDiv = document.getElementById("trailerdiv");
  while (trailerDiv.firstChild) {
    trailerDiv.removeChild(trailerDiv.lastChild);
  }

  const resetButton = document.getElementById("resetbutton");
  resetButton.classList.add("disabled");
  resetButton.setAttribute("aria-disabled", "true");
}

//Reset Page Button Functionality
const resetButton = document.getElementById("resetbutton");
resetButton.addEventListener("click", function () {
  if (!resetButton.classList.contains("disabled")) {
    resetSearch();
  }
});

//Scroll To Top Functionality

const topButton = document.getElementById("scroll-top");
topButton.addEventListener("click", () => {
  $("html, body").animate({ scrollTop: 0 }, 200);
});

//Decoding Entities
function decodeEntities(encodedString) {
  let textArea = document.createElement("textarea");
  textArea.innerHTML = encodedString;
  return textArea.value;
}
