var selectedEpisodeID = "";

const loadEpisodes = () => {
  return fetch("https://rickandmortyapi.com/api/episode")
    .then((response) => response.json())
    .then((response) => {
      const { results } = response;
      return results;
    });
};

//Create list item dom elements
const createEpisodeItem = (id, title, content) => {
  const newEl = document.createElement("li");
  newEl.setAttribute("data-id", id);
  const episodeTitleEl = `<div class="episode-title"><h2>${title}</h2></div>`;
  const episodeContentEl = `<div class="episode-content">${content}</div>`;
  const actionButtons = `<button class="edit-button">Edit</button><button class="delete-button">Delete</button>`;
  newEl.innerHTML = `${episodeTitleEl}${episodeContentEl}${actionButtons}`;

  return newEl;
};

const onPageInit = () => {
  let episodeList = [];
  const modalOverlay = document.querySelector(".modal-overlay");
  const deleteModal = document.querySelector("#delete-confirmation-modal");
  deleteModal.classList.add("hidden");
  const modalCancelButton = document.querySelector("#modal-cancel");
  const modalUpdateButton = document.querySelector("#modal-update");
  const episodesContainerEl = document.querySelector("#episode-list");
  const inputNameEl = document.querySelector("#input-name");
  const inputEpisodeEl = document.querySelector("#input-episode");
  const inputAirDateEl = document.querySelector("#input-airdate");
  const deleteYesButton = document.querySelector("#confirmation-button");
  const deleteNoButton = document.querySelector("#delete-modal-cancel-button");

  const addActionButtonEvents = (elem) => {
    const editButtonEl = elem.querySelector(".edit-button");
    const deleteButtonEl = elem.querySelector(".delete-button");

    editButtonEl.addEventListener("click", onEditButtonClick);
    deleteButtonEl.addEventListener("click", onDeleteButtonClick);
    modalUpdateButton.addEventListener("click", onUpdateButtonClick);
  };

  const onEditButtonClick = (event) => {
    const { target } = event;
    const listItem = target.closest("li");
    const { id } = listItem.dataset;
    const episodeId = parseInt(id, 10);
    const foundEpisode = episodeList.find((episode) => {
      return episode.id === episodeId;
    });
    console.log(foundEpisode);
    if (foundEpisode) {
      selectedEpisodeID = foundEpisode.id;
      const { name, episode, air_date: airDate } = foundEpisode;
      inputNameEl.value = name;
      inputEpisodeEl.value = episode;
      inputAirDateEl.value = airDate;
    }
    modalOverlay.classList.remove("hidden");
  };
  const onUpdateButtonClick = () => {
    const inputNameEl = document.querySelector("#input-name");
    const inputEpisodeEl = document.querySelector("#input-episode");
    const inputAirDateEl = document.querySelector("#input-airdate");
    const nameLi = document.getElementById(`${selectedEpisodeID}-name`);
    const episodeLi = document.getElementById(`${selectedEpisodeID}-episode`);
    const airDateLi = document.getElementById(`${selectedEpisodeID}-airDate`);

    nameLi.innerHTML = inputNameEl.value;
    episodeLi.innerHTML = inputEpisodeEl.value;
    airDateLi.innerHTML = inputAirDateEl.value;
    modalOverlay.classList.add("hidden");
  };

  const onDeleteButtonClick = (event) => {
    deleteModal.classList.add("delete-confirmation-modal");
    deleteNoButton.onclick = function () {
      deleteModal.classList.remove("delete-confirmation-modal");
    };
    deleteYesButton.onclick = function () {
      const { target } = event;
      const listItem = target.closest("li");
      const { id: episodeId } = listItem.dataset;
      fetch(`https://rickandmortyapi.com/api/episode/${episodeId}`, {
        method: "DELETE",
      }).then((response) => {
        listItem.parentNode.removeChild(listItem);
        deleteModal.classList.remove("delete-confirmation-modal");
      });
    };
  };
  // };

  //Create episodes list
  const createEpisodeList = (episodes) => {
    console.log(episodesContainerEl, episodes);
    episodes.forEach((episodeItem) => {
      const { id, name, episode, air_date: airDate } = episodeItem;
      const nameEl = `<li id="${id}-name">Name: ${name}</li>`;
      const episodeEl = `<li id="${id}-episode">Episode: ${episode}</li>`;
      const airDateEl = `<li id="${id}-airDate">Air date: ${airDate}</li>`;
      const content = `<ul>${nameEl}${episodeEl}${airDateEl}</ul>`;
      const listItemEl = createEpisodeItem(id, name, content);
      addActionButtonEvents(listItemEl);
      episodesContainerEl.appendChild(listItemEl);
    });
  };

  //Load episodes
  loadEpisodes().then((episodes) => {
    //Create episode list dom elements
    episodeList = episodes;
    createEpisodeList(episodes);
  });

  modalCancelButton.addEventListener("click", (event) => {
    event.target.closest(".modal-overlay").classList.add("hidden");
  });
};

window.addEventListener("load", onPageInit);
