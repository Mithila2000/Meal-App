const API_URL = 'https://www.themealdb.com/api/json/v1/1';
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const favouriteMealsContainer = document.getElementById('favouriteMeals');
const mealDetailContainer = document.getElementById('mealDetail');

if (searchInput) {
  searchInput.addEventListener('input', searchMeals);
}

async function searchMeals() {
  const query = searchInput.value.trim();
  if (query.length > 2) {
    const response = await fetch(`${API_URL}/search.php?s=${query}`);
    const data = await response.json();
    displaySearchResults(data.meals);
  } else {
    searchResults.innerHTML = '';
  }
}

function displaySearchResults(meals) {
  searchResults.innerHTML = '';
  if (meals) {
    meals.forEach(meal => {
      const mealCard = document.createElement('div');
      mealCard.className = 'card meal-card';
      mealCard.innerHTML = `
        <img class="card-img-top" src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <div class="card-body">
          <h5 class="card-title">${meal.strMeal}</h5>
          <button class="btn btn-primary" onclick="viewMeal(${meal.idMeal})">View</button>
          <button class="btn btn-warning" onclick="addFavourite(${meal.idMeal})">Favourite</button>
        </div>
      `;
      searchResults.appendChild(mealCard);
    });
  } else {
    searchResults.innerHTML = '<p>No meals found.</p>';
  }
}

function viewMeal(id) {
  window.location.href = `meal.html?id=${id}`;
}

function addFavourite(id) {
  let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
  if (!favourites.includes(id)) {
    favourites.push(id);
    localStorage.setItem('favourites', JSON.stringify(favourites));
  }
}

async function displayMealDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (id) {
    const response = await fetch(`${API_URL}/lookup.php?i=${id}`);
    const data = await response.json();
    const meal = data.meals[0];
    mealDetailContainer.innerHTML = `
      <h2>${meal.strMeal}</h2>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <h4>Instructions:</h4>
      <p>${meal.strInstructions}</p>
      <h4>Ingredients:</h4>
      <ul>
        ${getIngredients(meal).map(ingredient => `<li>${ingredient}</li>`).join('')}
      </ul>
    `;
  }
}

function getIngredients(meal) {
  let ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
    } else {
      break;
    }
  }
  return ingredients;
}

function displayFavouriteMeals() {
  const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
  favouriteMealsContainer.innerHTML = '';
  if (favourites.length > 0) {
    favourites.forEach(async id => {
      const response = await fetch(`${API_URL}/lookup.php?i=${id}`);
      const data = await response.json();
      const meal = data.meals[0];
      const mealCard = document.createElement('div');
      mealCard.className = 'card meal-card';
      mealCard.innerHTML = `
        <img class="card-img-top" src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <div class="card-body">
          <h5 class="card-title">${meal.strMeal}</h5>
          <button class="btn btn-primary" onclick="viewMeal(${meal.idMeal})">View</button>
          <button class="btn btn-danger" onclick="removeFavourite(${meal.idMeal})">Remove</button>
        </div>
      `;
      favouriteMealsContainer.appendChild(mealCard);
    });
  } else {
    favouriteMealsContainer.innerHTML = '<p>No favourite meals found.</p>';
  }
}

function removeFavourite(id) {
  let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
  favourites = favourites.filter(favId => favId !== id);
  localStorage.setItem('favourites', JSON.stringify(favourites));
  displayFavouriteMeals();
}

if (mealDetailContainer) {
  displayMealDetail();
}

if (favouriteMealsContainer) {
  displayFavouriteMeals();
}
 