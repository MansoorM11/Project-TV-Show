// Global reference for all episodes
let allEpisodes = [];

// Entry point
function initializeApp() {
  allEpisodes = getAllEpisodes();
  renderEpisodesList(allEpisodes);
  setupSearch();
  setupEpisodeSelector();
}

// Renders a list of episodes
function renderEpisodesList(episodeList) {
  const rootElem = document.getElementById("root");
  const template = document.getElementById("template");
  rootElem.innerHTML = "";

  episodeList.forEach((episode) => {
    const episodeCard = createEpisodeCard(template, episode);
    episodeCard.id = `episode-${episode.id}`; // Add unique ID for scrolling
    rootElem.appendChild(episodeCard);
  });

  // Update count
  updateEpisodeCount(episodeList.length);
}

// Creates a single episode card
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
  card.querySelector(".summary").innerHTML = episode.summary || "No summary available.";

  return card;
}

// Formats S01E01
function formatEpisodeCode(season, number) {
  const seasonPadded = season.toString().padStart(2, "0");
  const episodePadded = number.toString().padStart(2, "0");
  return `S${seasonPadded}E${episodePadded}`;
}

// Update displayed episode count
function updateEpisodeCount(count) {
  let counterElem = document.getElementById("searchCount");
  if (!counterElem) {
    counterElem = document.createElement("p");
    counterElem.id = "searchCount";
    const header = document.querySelector("body");
    header.insertBefore(counterElem, document.getElementById("root"));
  }
  counterElem.textContent = `Displaying ${count} / ${allEpisodes.length} episodes`;
}

// Search functionality
function setupSearch() {
  let searchInput = document.getElementById("searchInput");
  if (!searchInput) {
    searchInput = document.createElement("input");
    searchInput.id = "searchInput";
    searchInput.placeholder = "Search episodes...";
    const body = document.querySelector("body");
    body.insertBefore(searchInput, document.getElementById("root"));
  }

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

// Episode selector functionality
function setupEpisodeSelector() {
  let selectElem = document.getElementById("episodeSelect");
  if (!selectElem) {
    selectElem = document.createElement("select");
    selectElem.id = "episodeSelect";
    const showAllOption = document.createElement("option");
    showAllOption.value = "all";
    showAllOption.textContent = "Show All Episodes";
    selectElem.appendChild(showAllOption);

    const body = document.querySelector("body");
    body.insertBefore(selectElem, document.getElementById("root"));
  }

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
        if (epElem) epElem.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  });
}

// Start app
window.onload = initializeApp;


