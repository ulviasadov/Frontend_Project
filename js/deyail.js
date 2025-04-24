document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get("id");

    fetch(`https://api.example.com/movies/${movieId}`)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById("movie-detail");
            container.innerHTML = `
          <h1>${data.title}</h1>
          <p>${data.description}</p>
        `;
        })
        .catch(error => {
            console.error(error);
        });
});
