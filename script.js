//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = ``;
  let template = document.getElementById("template");
  episodeList.forEach((episode) => {
    let clone = template.content.cloneNode(true);
    let episodeCard = document.querySelector("section");

    let title = (episodeCard.querySelector("h2").textContent = episode.name);

    let seasonPadded = episode.season.toString().padStart(2, "0");
    let episodePadded = episode.number.toString().padStart(2, "0");
    episodeCard.querySelector(
      ".seasonAndEpisode"
    ).textContent = `S${seasonPadded}E${episodePadded}`;
    let image = episodeCard.querySelector("img");
    image.src = episode.image.medium;

    let summary = episodeCard.querySelector(".summary");
    summary.innerHTML = `${episode.summary}`;
    rootElem.append(episodeCard);
  });
}

window.onload = setup;
