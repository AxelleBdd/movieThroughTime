import {apikey, token} from "./keyapi.js";

const decadeContainer = document.querySelector("#decadeContainer");
const detailsContainer = document.querySelector("#detailsContainer");
const selectDecade = document.querySelector("#selectDecade");
const buttonEvolution = document.querySelector("#buttonEvolution");
const buttonStopEvolution = document.querySelector("#buttonStopEvolution");
const buttonCloseModal = document.createElement("button");
const decadeDisplay = document.querySelector("#decadeDisplay");
const body = document.querySelector("body");
const bodyClass = body.classList;

const urlSeventies =
  "https://api.themoviedb.org/3/discover/movie?page=1&primary_release_date.gte=1970-01-01&primary_release_date.lte=1979-12-31&sort_by=vote_average.desc&vote_count.gte=5000&api_key=" + apikey;
const urlEighties =
  "https://api.themoviedb.org/3/discover/movie?page=1&primary_release_date.gte=1980-01-01&primary_release_date.lte=1989-12-31&sort_by=vote_average.desc&vote_count.gte=5000&api_key=" + apikey;
const urlNineties =
  "https://api.themoviedb.org/3/discover/movie?page=1&primary_release_date.gte=1990-01-01&primary_release_date.lte=1999-12-31&sort_by=vote_average.desc&vote_count.gte=5000&api_key=" + apikey;
const urlTwenies =
  "https://api.themoviedb.org/3/discover/movie?page=1&primary_release_date.gte=2000-01-01&primary_release_date.lte=2009-12-31&sort_by=vote_average.desc&vote_count.gte=10000&api_key=" + apikey;
const urlTwentyTenies =
  "https://api.themoviedb.org/3/discover/movie?page=1&primary_release_date.gte=2010-01-01&primary_release_date.lte=2019-12-31&sort_by=vote_average.desc&vote_count.gte=20000&api_key=" + apikey;
const urlTwentyTwenties =
  "https://api.themoviedb.org/3/discover/movie?page=1&primary_release_date.gte=2020-01-01&primary_release_date.lte=2029-12-31&sort_by=vote_average.desc&vote_count.gte=10000&api_key=" + apikey;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer ' + token
  }
}

const urlArray = [
  urlSeventies,
  urlEighties,
  urlNineties,
  urlTwenies,
  urlTwentyTenies,
  urlTwentyTwenties,
];

const yearsArray = [
  "70's",
  "80's",
  "90's",
  "00's",
  "10's",
  "20's",
]

let intervalID;


/****SECONDARY FUNCTION******
 ***************************/
function getEvolution() {
  let count = 0;
  decadeContainer.classList.add("fade-in");
  getDecade(urlArray[count], yearsArray[count]);

  intervalID = setInterval(() => {
    count++;
    if (count < urlArray.length) {
      decadeContainer.innerHTML = "";
      decadeContainer.classList.add("fade-in");
      getDecade(urlArray[count], yearsArray[count]);
    } else {
      decadeContainer.classList.remove("fade-in");
      clearInterval(intervalID);
      selectDecade.disabled = false;
    }
  }, 4000);
}

function movieList() {
  let moviesList = document.createElement("ol");
  decadeContainer.appendChild(moviesList);
  return moviesList;
}

function TheTopThree(list) {
  let divTopThree = document.createElement("div");
  divTopThree.classList.add("topThree");
  list.appendChild(divTopThree);
  return divTopThree;
}

function TheLastSeven(list) {
  let divLastSeven = document.createElement("div");
  divLastSeven.classList.add("topLastSeven");
  list.appendChild(divLastSeven);
  return divLastSeven;
}

function displayDetails(elem) {
  let detailsDiv = document.createElement("div");
  detailsDiv.classList.add("detailsDiv");
  
  let posterDiv = document.createElement("div");
  posterDiv.classList.add("posterDiv");
  detailsContainer.appendChild(posterDiv);
 
  let poster = document.createElement("img");
  poster.src = `https://image.tmdb.org/t/p/w500${elem.poster_path}`;
  posterDiv.appendChild(poster);

  let title = document.createElement("div");
  title.innerText = `Title: ${elem.title}`;
  detailsDiv.appendChild(title);

  let releaseDate = document.createElement("div");
  releaseDate.innerText = `Release date: ${elem.release_date}`;
  detailsDiv.appendChild(releaseDate);

  let runtime = document.createElement("div");
  runtime.innerText = `Runtime: ${elem.runtime} minutes`;
  detailsDiv.appendChild(runtime);
  
  let genre = elem.genres;
  let genresName = document.createElement("div");
  let result = "";
  for (let value of genre) {
    result += value.name + " ";
  }
  genresName.innerText = `Genre(s): ${result}`;
  detailsDiv.appendChild(genresName);
  
  let overview = document.createElement("div");
  overview.innerText = `Overview: ${elem.overview}`;
  overview.classList.add("overviewContainer");
  detailsDiv.appendChild(overview);
  
  let voteAverage = document.createElement("div");
  voteAverage.innerText = `Score: ${elem.vote_average}`;
  detailsDiv.appendChild(voteAverage);

  detailsContainer.appendChild(detailsDiv);
}

function displayCloseButton() {
  buttonCloseModal.setAttribute("id", "closeButton"); //button for closing modal
  buttonCloseModal.classList.add("closeButton");
  buttonCloseModal.innerText = "Close"; //naming button
  detailsContainer.appendChild(buttonCloseModal); //append to the detailContainer (a dialog, not a div?)
}

function createDiv(list, elem, number, position) {
  let titlePoster = document.createElement("div");
  titlePoster.classList.add(`titlePoster${number}`);
  list.appendChild(titlePoster);

  let poster = document.createElement("img");
  poster.classList.add(`moviePoster${number}${position}`);
  poster.src = `https://image.tmdb.org/t/p/w500${elem.poster_path}`; //correspond à un setAttribute
  titlePoster.appendChild(poster);

  let movieTitle = document.createElement("p");
  movieTitle.classList.add(`title${number}`);
  movieTitle.innerText = elem.title;
  titlePoster.appendChild(movieTitle);
  
  poster.addEventListener("click", () => {
    detailsContainer.innerHTML = "";
    moviesDetails(elem.id);
    detailsContainer.classList.add("modalFadeIn");
    bodyClass.add("blurBackground");
  })
 return titlePoster;
}


/****PRINCIPAL FUNCTIONS******
 ****************************/
async function moviesDetails(id_movie) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id_movie}`, options);
    const dataDetails = await response.json();

    detailsContainer.showModal();
    displayDetails(dataDetails);
    displayCloseButton();

  } catch (error) {
    console.error("Failed to catch data details:", error);
  }
}

async function getDecade(url, year) {
  try {
    const response = await fetch(url);
    const dataDecade = await response.json();

    decadeDisplay.innerText = `Top of the ${year}`;

    let resultDecade = dataDecade.results;
    let topThree = resultDecade.slice(0, 3);
    let topLastSeven = resultDecade.slice(3, 10);
    let count = 1;

    let listOfMovies = movieList();
    let listTopThree = TheTopThree(listOfMovies);
    let listLastSeven = TheLastSeven(listOfMovies);

    topThree.forEach((element) => {
      createDiv(listTopThree, element, "Three", count);
      count ++;
    });

    topLastSeven.forEach((element) => {
      createDiv(listLastSeven, element, "Seven", count);
    });

  } catch (error) {
    console.error("Failed to catch data :", error);
  }
}


/*******START*******
 *******************/
buttonStopEvolution.disabled = true;

selectDecade.addEventListener("change", () => {
  decadeContainer.innerHTML = "";
  const decade = selectDecade.value;
  decadeContainer.classList.remove("fade-in");

  switch (decade) {
    case "70":
      getDecade(urlSeventies, "70's");
      break;
    case "80":
      getDecade(urlEighties, "80's");
      break;
    case "90":
      getDecade(urlNineties, "90's");
      break;
    case "00":
      getDecade(urlTwenies, "00's");
      break;
    case "10":
      getDecade(urlTwentyTenies, "10's");
      break;
    case "20":
      getDecade(urlTwentyTwenties, "20's");
      break;
    default:
      break;
  }
  selectDecade.value = "";
});

buttonEvolution.addEventListener("click", () => {
  decadeContainer.innerHTML = "";
  selectDecade.disabled = true;
  buttonEvolution.disabled = true;
  buttonStopEvolution.disabled = false;
  getEvolution();
});

buttonStopEvolution.addEventListener("click", () => {
  decadeContainer.classList.remove("fade-in");
  selectDecade.disabled = false;
  buttonEvolution.disabled = false;
  buttonStopEvolution.disabled = true;
  clearInterval(intervalID);
})

buttonCloseModal.addEventListener("click", () => {
  detailsContainer.close();
  decadeContainer.classList.remove("modalFadeIn");
  bodyClass.remove("blurBackground");
})
