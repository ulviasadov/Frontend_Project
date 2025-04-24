window.onscroll = function () { ScrollFunction() };

const navbar_sticky = document.getElementById("navbar_sticky");
const sticky = navbar_sticky.offsetTop;
const navbar_height = document.querySelector('.navbar').offsetHeight;
const searchInput = document.querySelector("#search-input");
const searchButton = document.querySelector("#search-button");
const centerSection = document.querySelector("#center");
const searchedShowArea = document.querySelector("#searched-show-area");
const genreFilter = document.querySelector("#genre-filter");

function ScrollFunction() {
    if (window.pageYOffset >= sticky + navbar_height) {
        navbar_sticky.classList.add("sticky")
        document.body.style.paddingTop = navbar_height + 'px';
    } else {
        navbar_sticky.classList.remove("sticky");
        document.body.style.paddingTop = '0'
    }
}

const carouselInner = document.getElementById("carousel-inner");
let allShows = [];

const getData = async function () {
    try {
        const response = await fetch("https://api.tvmaze.com/shows");
        const data = await response.json();
        allShows = data;

        for (let i = 0; i < 3; i++) {
            const div = document.createElement("div");
            div.classList.add("carousel-item");
            if (i == 0) div.classList.add("active");

            div.innerHTML = `<img src="${data[i].image.original}" class="d-block w-100" alt="...">
                            <div class="carousel-caption d-md-block">
                             <h1 class="font_60">${data[i].name}</h1>
                             <h6 class="mt-3">
                              <span class="col_red me-3">
                               <i class="fa fa-star"></i>
                               <i class="fa fa-star"></i>
                               <i class="fa fa-star"></i>
                               <i class="fa fa-star"></i>
                               <i class="fa fa-star-half-o"></i>
                              </span>
                               ${data[i].rating.average} (Imdb)       Premier : ${data[i].premiered}
                               <a class="bg_red p-2 pe-4 ps-4 ms-3 text-white d-inline-block" href="#">Action</a>
                             </h6>
                             <p class="mt-3">${data[i].summary}</p>
                             <p class="mb-2"><span class="col_red me-1 fw-bold">Genres:</span> ${data[i].genres.join(", ")}</p>
                             <p><span class="col_red me-1 fw-bold">Runtime:</span>${data[i].runtime}</p>	
                             <h6 class="mt-4"><a class="button" href="${data[i]._links.previousepisode.href}"><i class="fa fa-play-circle align-middle me-1"></i> Watch Trailer</a></h6>
                            </div>`

            carouselInner.appendChild(div);
        };

        const allGenres = new Set();
        allShows.forEach(show => show.genres.forEach(genre => allGenres.add(genre)));

        allGenres.forEach(genre => {
            const option = document.createElement("option");
            option.value = genre;
            option.textContent = genre;
            genreFilter.appendChild(option);
        })
    }
    catch (err) {
        console.error(err.message);
    };
}

getData();

const latestMoviesContainer = document.querySelector("#latest-movies");
const loadMoreBtn = document.querySelector("#load-more-btn");

let latestIndex = 0;
const showsPerPage = 8;

const renderLatestMovies = () => {
    const nextBatch = allShows.slice(latestIndex, latestIndex + showsPerPage);

    nextBatch.forEach(show => {
        const showCard = document.createElement("div");
        showCard.classList.add("searchedShow");

        showCard.innerHTML = `
            <div class="showCart-container">
                <img src="${show.image?.medium || 'placeholder.jpg'}" alt="${show.name}">
                <div class="showCart-inner-div">
                    <h2>${show.name}</h2>
                    <p>${show.genres.join(', ')}</p>
                    <p>Süre: ${show.runtime} dk</p>
                </div>
            </div>
        `;

        latestMoviesContainer.appendChild(showCard);
    });

    latestIndex += showsPerPage;

    if (latestIndex >= allShows.length) {
        loadMoreBtn.style.display = "none";
    }
};

loadMoreBtn.addEventListener("click", renderLatestMovies);

getData().then(() => {
    renderLatestMovies();
});


const displayShows = function (show) {
    const showCart = document.createElement("div");
    showCart.classList.add("searchedShow");

    showCart.innerHTML = `
    <div class="showCart-container">
        <img src="${show.image?.medium || 'placeholder.jpg'}" alt="${show.name}">
        <div class = "showCart-inner-div">
            <h2>${show.name}</h2>
            <p>${show.genres.join(', ')}</p>
            <p>Süre: ${show.runtime} dk</p>
        </div>
    </div>
    `

    searchedShowArea.appendChild(showCart);
}

const searchShows = function () {
    searchedShowArea.innerHTML = "";
    const searchTerm = searchInput.value.toLowerCase();
    const selectedGenre = genreFilter.value;

    const filtered = allShows.filter(show => {
        const matchesSearch = searchTerm === "" || show.name.toLowerCase().includes(searchTerm);
        const matchesGenre = selectedGenre === "" || show.genres.includes(selectedGenre);
        console.log("nese");
        return matchesSearch && matchesGenre;
    });

    filtered.forEach(show => displayShows(show));
    // if (searchInput.value == "") searchedShowArea.innerHTML = "";
}

searchButton.addEventListener("click", searchShows);
searchInput.addEventListener("input", searchShows);
genreFilter.addEventListener("change", searchShows);


const carouselItem = document.querySelector(".carousel-item");

let currentPage = 0;
let isLoading = false;

const loadMoreShows = async () => {
    if (isLoading) return;

    isLoading = true;
    try {
        const response = await fetch(`https://api.tvmaze.com/shows?page=${currentPage}`);
        const data = await response.json();

        if (data.length === 0) {
            window.removeEventListener("scroll", handleScroll);
            return;
        }

        allShows = [...allShows, ...data];

        data.forEach(show => {
            const showCart = document.createElement("div");
            showCart.classList.add("searchedShow");
            showCart.innerHTML = `
                <div class="showCart-container">
                    <img src="${show.image?.medium || 'placeholder.jpg'}" alt="${show.name}">
                    <div class="showCart-inner-div">
                        <h2>${show.name}</h2>
                        <p>${show.genres.join(', ')}</p>
                        <p>Runtime: ${show.runtime}</p>
                    </div>
                </div>`;

            carouselItem.appendChild(showCart);
        });

        currentPage++;
    } catch (err) {
        console.error(err);
    }
    isLoading = false;
};

const handleScroll = () => {
    const bottomThreshold = 300;
    const scrolledToBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - bottomThreshold;

    const searchTerm = searchInput.value.trim();
    const selectedGenre = genreFilter.value;

    if (scrolledToBottom && searchTerm === "" && selectedGenre === "") {
        loadMoreShows();
    }
};

window.addEventListener("scroll", handleScroll);































const apiUrl = 'https://api.tvmaze.com/shows';
let currentIndex = 0;
let movies = [];

const movieList = document.getElementById('movie-list');
const detailPage = document.getElementById('detail-page');
const homePage = document.getElementById('trend');
const movieDetail = document.getElementById('movie-detail');
const backBtn = document.getElementById('back-btn');
const directorsChoice = document.getElementById('directors-choice');

fetchMovies();

loadMoreBtn.addEventListener('click', showMoreMovies);

backBtn.addEventListener('click', () => {
  detailPage.style.display = 'none';
  homePage.style.display = 'block';
});

function fetchMovies() {
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      movies = data;
      fillDirectorsChoice();
      showMoreMovies();
    });
}

function showMoreMovies() {
  const moviesToShow = movies.slice(currentIndex, currentIndex + 8);
  moviesToShow.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.className = 'col-md-3 col-6 mb-4';
    movieCard.innerHTML = `
      <div class="trend_2im position-relative">
        <div class="trend_2im1">
          <div class="grid">
            <figure class="effect-jazz mb-0">
              <a href="#"><img src="${movie.image?.medium}" class="w-100" alt="${movie.name}"></a>
            </figure>
          </div>
        </div>
        <div class="trend_2im2 position-absolute w-100 top-0 text-center">
          <h5><a class="col_red" href="#">${movie.name}</a></h5>
        </div>
      </div>
    `;
    movieCard.addEventListener('click', () => showMovieDetail(movie));
    movieList.appendChild(movieCard);
  });
  currentIndex += 8;
  if (currentIndex >= movies.length) {
    loadMoreBtn.style.display = 'none';
  }
}

function showMovieDetail(movie) {
  movieDetail.innerHTML = `
    <img src="${movie.image?.original}" class="w-100 mb-3" alt="${movie.name}">
    <h2 class="mb-3">${movie.name}</h2>
    <p><strong>Description:</strong> ${movie.summary || 'No description available.'}</p>
    <p><strong>Runtime:</strong> ${movie.runtime ? movie.runtime + ' min' : 'N/A'}</p>
    <p><strong>Rating:</strong> ${movie.rating?.average || 'N/A'}</p>
    <p><strong>Release Year:</strong> ${movie.premiered ? movie.premiered.substring(0,4) : 'N/A'}</p>
  `;
  homePage.style.display = 'none';
  detailPage.style.display = 'block';
}

function fillDirectorsChoice() {
  const choiceMovies = movies.slice(0, 4);
  choiceMovies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'col-md-3 col-6 mb-4';
    card.innerHTML = `
      <div class="trend_2im position-relative">
        <div class="trend_2im1">
          <div class="grid">
            <figure class="effect-jazz mb-0">
              <a href="#"><img src="${movie.image?.medium}" class="w-100" alt="${movie.name}"></a>
            </figure>
          </div>
        </div>
        <div class="trend_2im2 position-absolute w-100 top-0 text-center">
          <h5><a class="col_red" href="#">${movie.name}</a></h5>
        </div>
      </div>
    `;
    card.addEventListener('click', () => showMovieDetail(movie));
    directorsChoice.appendChild(card);
  });
}