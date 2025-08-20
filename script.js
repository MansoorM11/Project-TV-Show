// Global reference for all episodes
let allEpisodes = [];

// Entry point
function initializeApp() {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "<p>Loading titles, please wait..</p>";

  //fetch titles from TVMaze api
  fetch("https://api.tvmaze.com/shows/82/episodes")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to load titles");
      }
      return response.json();
    })

    .then(function (data) {
      allEpisodes = data;
      renderEpisodesList(allEpisodes);
      setupSearch();
      setupEpisodeSelector();
    })
    .catch(function (error) {
      rootElem.textContent = `Failed to load episodes: ${error.message}`;
    });
}

// Renders all episodes to the page
function renderEpisodesList(episodeList) {
  const rootElem = document.getElementById("root");
  const template = document.getElementById("template");

  // Clear existing content
  rootElem.innerHTML = "";

  episodeList.forEach((episode) => {
    const episodeCard = createEpisodeCard(template, episode);
    episodeCard.id = `episode-${episode.id}`; // Unique ID for scrolling
    rootElem.appendChild(episodeCard);
  });

  // Update count
  updateEpisodeCount(episodeList.length);
}

// Creates a single episode card from template
function createEpisodeCard(template, episode) {
  const clone = template.content.cloneNode(true);
  const card = clone.querySelector("section");

  // Title
  card.querySelector("h2").textContent = episode.name;

  // Season/Episode
  card.querySelector(".seasonAndEpisode").textContent = formatEpisodeCode(
    episode.season,
    episode.number
  );

  // Image
  const image = card.querySelector("img");
  if (episode.image) {
    image.src = episode.image.medium;
    image.alt = `Still from "${episode.name}" (S${episode.season}, E${episode.number})`;
  } else {
    image.src = "";
    image.alt = "No image available";
  }

  // Summary
  card.querySelector(".summary").innerHTML =
    episode.summary || "No summary available.";

  return card;
}

// Formats S01E01
function formatEpisodeCode(season, number) {
  const seasonPadded = season.toString().padStart(2, "0");
  const episodePadded = number.toString().padStart(2, "0");
  return `S${seasonPadded}E${episodePadded}`;
}

// Updates displayed episode count
function updateEpisodeCount(count) {
  let counterElem = document.getElementById("searchCount");
  if (!counterElem) {
    counterElem = document.createElement("p");
    counterElem.id = "searchCount";
    const header = document.querySelector("header");
    header.appendChild(counterElem);
  }
  counterElem.textContent = `Displaying ${count} / ${allEpisodes.length} episodes`;
}

// Sets up live search
function setupSearch() {
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredEpisodes = allEpisodes.filter((episode) => {
      const nameMatch = episode.name.toLowerCase().includes(searchTerm);
      const summaryMatch = episode.summary
        ? episode.summary.toLowerCase().includes(searchTerm)
        : false;
      return nameMatch || summaryMatch;
    });
    renderEpisodesList(filteredEpisodes);
  });
}

// Sets up episode selector dropdown
function setupEpisodeSelector() {
  const selectElem = document.getElementById("episodeSelect");

  // Populate dropdown with episodes
  allEpisodes.forEach((episode) => {
    const seasonStr = String(episode.season).padStart(2, "0");
    const numberStr = String(episode.number).padStart(2, "0");
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `S${seasonStr}E${numberStr} - ${episode.name}`;
    selectElem.appendChild(option);
  });

  selectElem.addEventListener("change", (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "all") {
      renderEpisodesList(allEpisodes);
      return;
    }
    const selectedEpisode = allEpisodes.find((ep) => ep.id == selectedValue);
    if (selectedEpisode) {
      renderEpisodesList([selectedEpisode]);
      setTimeout(() => {
        const epElem = document.getElementById(`episode-${selectedEpisode.id}`);
        if (epElem)
          epElem.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  });
}

// Run app on load
window.onload = initializeApp;
