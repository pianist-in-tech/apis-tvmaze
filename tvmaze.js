"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function searchShows(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  try { 
  const showObjects = [];
  const shows = await axios.get(`http://api.tvmaze.com/search/shows?q=${term}`)

 for(let index of shows.data){
  let id = index.show.id;
  let name = index.show.name;
  let summary = index.show.summary;
  let image = null;
  if (index.show.image){
    image = index.show.image.medium;
  } else {
    image = 'https://static.tvmaze.com/images/tvm-header-logo.png';
  }

  let showObject = {
    id: id,
    name: name,
    summary: summary,
    image: image
  }
  
  showObjects.push(showObject);
 }
 return showObjects
} catch (error) {
  console.error(error);
  return [];
}
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="card">
           <img 
              src="${show.image}" onerror = "this.onerror=null; this.src='<https://tinyurl.com/tv-missing>';"
              class="w-25 mr-3 card-img-top">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-primary Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);  }
    // $episodesArea.hide()
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await searchShows(term);

  $episodesArea.hide();
  populateShows(shows);
  $("#search-query").val("");
 
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
 
});

async function getEpisodesOfShow(id){
 
  let res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

  let episodes = res.data.map(episode =>({
    id: episode.id,
    name: episode.name, 
    season: episode.season,
    number: episode.number
  }))
  console.log(episodes)
  return episodes;
}


function populateEpisodes(episodes){
 const $episodesList = $('#episodes-list');
 $episodesList.empty();

 for (let episode of episodes) {
  let $item = $(`<li>${episode.name} (Season ${episode.season}, Episode ${episode.number})</li>`);
  $episodesList.append($item);
}
$episodesArea.show();
}
 
async function handleEpisodeClick(e){
 const showId = e.target.closest('.Show').dataset.showId; 
 let episodes = await getEpisodesOfShow(showId);
 populateEpisodes(episodes);
 }


 const showsList = document.querySelector('#shows-list');
 showsList.addEventListener('click',e=>{
  if (e.target.classList.contains('Show-getEpisodes')){
    handleEpisodeClick(e);
    console.log(e)
  }
 });


// ${id}
/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
