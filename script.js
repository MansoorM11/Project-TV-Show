//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = ``;
  episodeList.forEach((episode) => {
    let episodeCard = document.createElement("section");
    episodeCard.className = "episode";
    let title = document.createElement("h2");
    title.textContent = episode.name;
    let seasonAndEpisode = document.createElement("p");
    let seasonPadded = episode.season.toString().padStart(2, "0");
    let episodePadded = episode.number.toString().padStart(2, "0");
    seasonAndEpisode.innerHTML = `S${seasonPadded}E${episodePadded}`;
    let image = document.createElement("img");
    image.src = episode.image.medium;

    let summary = document.createElement("div");
    summary.innerHTML = `${episode.summary}`;
    episodeCard.append(title, seasonAndEpisode, image, summary);
    rootElem.append(episodeCard);
  });
}

window.onload = setup;
