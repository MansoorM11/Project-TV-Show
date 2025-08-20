// script.js
function initializeApp() {
  const allEpisodes = getAllEpisodes();
  renderEpisodesList(allEpisodes);
}

// this is the first one name "renderEpisodeCards" is more specific than "makePageForEpisodes."
// this function tells us what It exactly does: it renders a set of cards for episodes.
// Renders all episodes to the page.

function renderEpisodesList(episodeList) {
  const rootElem = document.getElementById("root");
  const template = document.getElementById("template");

  // Clear any existing content before rendering
  rootElem.innerHTML = "";

  episodeList.forEach((episode) => {
    const episodeCard = createEpisodeCard(template, episode);
    rootElem.appendChild(episodeCard);
  });
}

// Creates a single episode card from template
function createEpisodeCard(template, episode) {
  const clone = template.content.cloneNode(true);
  const card = clone.querySelector("section");

  // Title
  card.querySelector("h2").textContent = episode.name;

  // Season/Episode code
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

// Formats season and episode numbers as S01E02
function formatEpisodeCode(season, number) {
  const seasonPadded = season.toString().padStart(2, "0");
  const episodePadded = number.toString().padStart(2, "0");
  return `S${seasonPadded}E${episodePadded}`;
}

// Run app on load
window.onload = initializeApp;
