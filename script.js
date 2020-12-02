const API_ENDPOINT = 'https://api.punkapi.com/v2/beers?per_page=40';
const alcoholCheckbox = document.getElementById('alcohol');

let isSortByAlcohol = false;
let beers = [];

// Listen for sort toggle
alcoholCheckbox.addEventListener('change', () => {
  isSortByAlcohol = !isSortByAlcohol;
  if (isSortByAlcohol) {
    const sortedBears = sortBeers([...beers]);
    renderBeers(sortedBears);
  } else {
    renderBeers(beers);
  }
});

// Fetch beers from API and render them
fetchBeers();

/**
 * Sorts list of bears based on abv value
 * @param {[]} unSortedBeers
 */
function sortBeers(unSortedBeers) {
  return unSortedBeers.sort((a, b) => {
    if (a.abv < b.abv) return -1;
    if (a.abv > b.abv) return 1;

    return 0;
  });
}

/**
 * Asynchronously fetches beers data and renders them
 */
async function fetchBeers() {
  try {
    const response = await fetch(API_ENDPOINT);

    const data = await response.json();

    beers = data;
    renderBeers(beers);
  } catch (error) {
    console.log(error);
    return [];
  }
}

/**
 * Dynamically renders beers data to DOM
 */
function renderBeers(beers = []) {
  const container = document.getElementById('beers-container');

  const childrens = beers.map(
    (beer) => `
      <div class="beer-card">
        <img
          class="beer-img"
          src=${beer.image_url}
          alt=${beer.name}
        />
        <div class="beer-content">
          <div class="beer-card-header">
            <h2 class="beer-name">${beer.name}</h2>
            <p class="beer-tag">${beer.tagline}</p>
          </div>
          <div class="beer-card-body">
            <p class="beer-desc">
              ${beer.description}
            </p>
            <h3 class="beer-volume">Alcohol By Volume: ${beer.abv}</h3>
            <div class="ingredients">
              <h3 class="list-heading">Ingredients:</h3>
              <ul>
                <li>
                  <h4>Malt:</h4>
                  <ul class="sub-list">
                    ${beer.ingredients.malt
                      .map(
                        (malt) => `
                        <li>
                          ${malt.name} (${malt.amount.value} ${malt.amount.unit})
                        </li>
                      `
                      )
                      .join('')}
                  </ul>
                </li>
                <li>
                  <h4>Hops:</h4>
                  <ul  class="sub-list">
                    ${beer.ingredients.hops
                      .map(
                        (hop) => `
                        <li>
                          ${hop.name} (${hop.amount.value} ${hop.amount.unit})
                        </li>
                      `
                      )
                      .join('')}
                  </ul>
                </li>
                <li>
                  <h4>Yeast: <span class="yeast">${
                    beer.ingredients.yeast
                  }</span></h4>
                </li>
              </ul>
            </div>
            <div class="food_pairings">
              <h3  class="list-heading">
                Food Pairings 
              </h3>
              <ul>
                    ${beer.food_pairing
                      .map(
                        (food) => `
                        <li>
                         ${food}
                        </li>
                      `
                      )
                      .join('')}
                </ul>
            </div>
          </div>
        </div>
      </div>
  `
  );

  container.innerHTML = childrens.join('');
}
