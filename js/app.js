window.onscroll = function () { ScrollFunction() };

const navbar_sticky = document.getElementById("navbar_sticky");
const sticky = navbar_sticky.offsetTop;
const navbar_height = document.querySelector('.navbar').offsetHeight;
const searchInput = document.querySelector("#search-input");
const searchButton = document.querySelector("#search-button");
const centerSection = document.querySelector("#center");
const searchedShowArea = document.querySelector("#searched-show-area");

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
    }
    catch (err) {
        console.error(err.message);
    };
}

getData();

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
    const filtered = allShows.filter(show => show.name.toLowerCase().includes(searchTerm));

    filtered.forEach(show => displayShows(show));
    if (searchInput.value == "") searchedShowArea.innerHTML = "";
}

searchButton.addEventListener("click", searchShows);

searchInput.addEventListener("input", searchShows);
