# movies-to-see

A front end JavaScript application that utilizes the data from the [New York Times Movie Reviews API](https://developer.nytimes.com/docs/movie-reviews-api/1/overview) and [YouTube API](https://developers.google.com/youtube/v3) to give users reviews of any movie that they search for.

## Technologies Used

- JavaScript ES5 & ES6
- HTML 5
- CSS 3
- Bootstrap 4
- jQuery/AJAX

## Live Demo

Try the application live at [https://movies-to-see.sarahchoung.com/](https://movies-to-see.sarahchoung.com/)

## Features

- Users can input the title of any movie.
- Users can view a list of review articles and click their respective links.
- Users can view a movie trailer and a list of YouTube video reviews.
- Users can search for another movie without refreshing the page.

## Preview

![Movies To See](assets/movies-to-see-preview.gif)

## Getting Started

1. Clone the repository.

```shell
git clone https://github.com/SarahChoung/movies-to-see.git
```

2. Create a config.js file and add your own NY Times and YouTube API keys

```shell
const nyTimesAPIKey = "yourNYTimesAPIKey";
const youtubeAPIKey = "yourYouTubeAPIKey";
```

Note: The YouTube API uses a daily quota for requests, so videos may not be retrieved if the quota is exceeded.

3. Open the file through a code editor and open default browser from the `index.html` file.
