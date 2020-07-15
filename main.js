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
  getArticle();
  // getVideo();
  // getTrailer();

  setTimeout(() => {
    const info = document.getElementById("info");
    info.classList.remove("d-none");
    loadingScreen.classList.add("d-none");
  }, 3000);

  setTimeout(() => {
    const info = document.getElementById("info");
    info.scrollIntoView({ behavior: "smooth" });
  }, 3500);
});

//YOUTUBE VIDEO

// function getTrailer() {
//   let ytUserInput = "";
//   if (userInput.includes("trailer") === false) {
//     ytUserInput = userInput.split("_").join("") + "trailer";
//   }

//   $.ajax({
//     type: "GET",
//     url: "https://www.googleapis.com/youtube/v3/search",
//     data: {
//       key: youtubeAPIKey,
//       q: ytUserInput,
//       part: "snippet",
//       maxResults: 1,
//       type: "video",
//       videoEmbeddable: true,
//     },
//     success: function (data) {
//       embedTrailer(data);
//     },
//     error: function (response) {
//       console.log("Request Failed");
//     },
//   });
// }

// function getVideo() {
//   let ytUserInput = "";
//   if (userInput.includes("movie") == false) {
//     ytUserInput = userInput.split("_").join("") + "review";
//   }

//   $.ajax({
//     type: "GET",
//     url: "https://www.googleapis.com/youtube/v3/search",
//     data: {
//       key: youtubeAPIKey,
//       q: ytUserInput,
//       part: "snippet",
//       maxResults: 5,
//       type: "video",
//       videoEmbeddable: true,
//     },
//     success: embedVideo,
//     error: function (response) {
//       console.log("Request Failed");
//     },
//   });
// }

// function embedTrailer(data) {
//   if (data.items.length === 0) {
//     let noTrailerAvailable = document.createElement("p");
//     noTrailerAvailable.textContent =
//       "There are no available trailers on YouTube for this movie.";
//     document.querySelector("div#trailerdiv").append(noTrailerAvailable);
//   } else {
//     let iFrame = document.createElement("iframe");
//     iFrame.setAttribute(
//       "src",
//       "https://www.youtube.com/embed/" + data.items[0].id.videoId
//     );

//     let videoDiv = document.createElement("div");
//     let vidTitle = document.createElement("h4");
//     vidTitle.textContent = data.items[0].snippet.title;

//     videoDiv.append(iFrame, vidTitle);
//     document.querySelector("div#trailerdiv").append(videoDiv);
//   }
// }

// function embedVideo(data) {
//   if (data.items.length === 0) {
//     let noVideosAvailable = document.createElement("p");
//     noVideosAvailable.textContent =
//       "There are no YouTube video reviews for this movie.";
//     document.querySelector("div#ytdiv").append(noVideosAvailable);
//   } else {
//     for (let i = 0; i < data.items.length; i++) {
//       let iFrame = document.createElement("iframe");
//       iFrame.setAttribute(
//         "src",
//         "https://www.youtube.com/embed/" + data.items[i].id.videoId
//       );

//       let videoDiv = document.createElement("div");
//       let vidTitle = document.createElement("p");
//       vidTitle.textContent = data.items[i].snippet.title;

//       videoDiv.append(iFrame, vidTitle);
//       document.querySelector("div#ytdiv").append(videoDiv);
//     }
//   }
// }

//NY TIMES ARTICLE
function getArticle() {
  $.ajax({
    url:
      "https://api.nytimes.com/svc/movies/v2/reviews/search.json?query=" +
      userInput +
      "&api-key=" +
      nyTimesAPIKey,
    success: embedArticle,
    error: logError,
  });

  function embedArticle(data) {
    const articleResults = data.results;

    if (articleResults.length === 0) {
      let noArticleAvailable = document.createElement("p");
      noArticleAvailable.textContent =
        "There are no NY Times reviews for this movie.";
      document.querySelector("div#nydiv").append(noArticleAvailable);
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
          articleParagraph.textContent = articleResults[i].summary_short;
          articleParagraph.textContent.replace("&quot;", "/'");
        }

        let articleLinkPath = document.createElement("a");
        articleLinkPath.setAttribute("href", articleURL);
        articleLinkPath.textContent = "Click here to go to the full article.";

        let nydiv = document.querySelector("div#nydiv");
        accordionDiv.append(articleParagraph, articleLinkPath);
        nydiv.append(titleButton, accordionDiv);
      }

      let acc = document.getElementsByClassName("accordion");
      for (let i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function () {
          /* Toggle between adding and removing the "active" class,
            to highlight the button that controls the panel */
          this.classList.toggle("active");

          /* Toggle between hiding and showing the active panel */
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
  function logError(err) {
    console.log("error", err);
  }
}

//Reset Search

function resetSearch() {
  document.getElementById("info").classList.add("d-none");

  var nyDiv = document.querySelector("div#nydiv");
  while (nyDiv.firstChild) {
    nyDiv.removeChild(nyDiv.lastChild);
  }

  var ytDiv = document.querySelector("div#ytdiv");
  while (ytDiv.firstChild) {
    ytDiv.removeChild(ytDiv.lastChild);
  }

  var trailerDiv = document.querySelector("div#trailerdiv");
  while (trailerDiv.firstChild) {
    trailerDiv.removeChild(trailerDiv.lastChild);
  }
}

//Reset Page Button Functionality
const resetButton = document.querySelector("button#resetbutton");

resetButton.addEventListener("click", function () {
  resetSearch();
});

//Scroll To Top Functionality

const topButton = document.getElementById("scroll-top");
topButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
