const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
const main = document.querySelector("main");
const pokeNames = ["Unk-Unk", "Pooly", "Carl", "Toomour", "Riddely", "Lizza", "Glorp", "Geegee", "Tim", "Trax", "Dee", "Asher", "Tomu", "Loouga", "Walley"]
const pokeSpecies = ["Ivysaur", "Wartortle", "Kakuna", "Pidgeot", "Fearow", "Golduck", "Wigglytuff", "Ninetales", "Growlithe", "Farfetch'd", "Cloyster", "Kingler", "Kangaskhan", "Pinsir", "Pikachu"]

fetch(TRAINERS_URL)
  .then(res => res.json())
  .then(trainerData => addTrainers(trainerData))

// Appends trainers and pokemon to main element on DOM
function addTrainers(trainerData) {
  for (let trainer of trainerData) {
    div = document.createElement("div");
    div.className = "card";
    div.dataset.id = trainer.id;
    p = document.createElement("p");
    p.innerHTML = trainer.name;
    button = document.createElement("button");
    button.dataset.trainerId = trainer.id;
    button.innerHTML = "Add Pokemon";
    main.appendChild(div);
    div.appendChild(p);
    div.appendChild(button);
    div.appendChild(appendPokemon(trainer.pokemons));
  }
}

//Helper function to append pokemon to a trainer's card
function appendPokemon(pokemons) {
  ul = document.createElement("ul");
  for (let pokemon of pokemons) {
    li = document.createElement("li");
    li.innerHTML = `${pokemon.nickname} (${pokemon.species})`
    button = document.createElement("button");
    button.className = "release";
    button.dataset.pokemonId = pokemon.id;
    button.innerHTML = "Release";
    li.appendChild(button);
    ul.appendChild(li);
  }
  return ul;
}

//Allows pokemon to be added to trainer collection if current collection is 5 or fewer
function addPokemon() {
  let clicked = event.target
  let id = clicked.dataset.trainerId
  if (clicked.dataset.trainerId) {
    if (clicked.nextSibling.children.length < 6) {
      fetch(POKEMONS_URL, addPokemonFetch(id))
        .then(res => res.json())
        .then(res => addPokemonFetchHelper(clicked, id));
    } else {
      console.log("No room to add pokemon")
    }
  }
}

function addPokemonFetchHelper(clicked, id) {
  clicked.nextSibling.remove();
  fetch(TRAINERS_URL)
    .then(res => res.json())
    .then(trainerData => clicked.parentElement.appendChild(findPokemons(trainerData, id)))
}

function addPokemonFetch(id) {
  return {
    method: 'POST',
    headers: {
      "Content-Type": 'application/json',
      "Accept": 'application/json'
    },
    body: JSON.stringify({
      nickname: fakerName(),
      species: fakerSpecies(),
      trainer_id: id
    })
  }
}

function releasePokemonFetch(id) {
  return {
    method: 'DELETE',
    headers: {
      "Content-Type": 'application/json'
    },
    body: JSON.stringify({
      id: id
    })
  }
}

function releasePokemon() {
  let clicked = event.target
  let id = clicked.dataset.pokemonId
  let ul = clicked.parentElement.parentElement
  let div = ul.parentElement
  let trainerId = div.dataset.id
  if (clicked.dataset.pokemonId) {
    fetch(`${POKEMONS_URL}/${id}`, releasePokemonFetch(id))
      .then(res => res.json())
      .then(res => releasePokemonFetchHelper(ul, trainerId));
  }
}

function releasePokemonFetchHelper(ul, trainerId) {
  let div = ul.parentElement
  ul.remove();
  fetch(TRAINERS_URL)
    .then(res => res.json())
    .then(trainerData => div.appendChild(findPokemons(trainerData, trainerId)))
}


//Helper method to find trainer's pokemon of click event.
function findPokemons(trainerData, id) {
  filteredTrainer = trainerData.filter(trainer => trainer.id === parseInt(id))
  return appendPokemon(filteredTrainer[0].pokemons)
}

/// POKEMON NAME FAKERs ///

function fakerName() {
  return pokeNames[Math.floor(Math.random() * 20)]
}

function fakerSpecies() {
  return pokeSpecies[Math.floor(Math.random() * 20)]
}

/// EVENT LISTENERS ///
main.addEventListener("click", addPokemon)
main.addEventListener("click", releasePokemon)







//
