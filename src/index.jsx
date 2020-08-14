// Global app controller
import Search from './models/search';
import Recipe from './models/recipe';
import List from './models/list';
import Likes from './models/likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, removeLoader } from './views/base';

/** Global state of the app
 * - Search Object
 * - Current recipe Object
 * - Shopping list Object
 * - Liked recipes
 */

const state = {};
const {
  searchForm, resultsPages, recipe, shoppingList,
} = elements;
window.state = state;

const controlSearch = async () => {
  // Step1. Get query from View
  const query = searchView.getInputValue();
  // const query = 'pizza';

  if (query) {
    // Step2. New Search object and add to state
    state.search = new Search(query);
    try {
      // Step3. Prepare UI for results
      searchView.clearInputValue();
      searchView.clearResults();
      renderLoader(elements.searchResult);

      // Step4. Search for recipes
      await state.search.getRecipes();

      // Step5. Render results on UI
      removeLoader();
      searchView.renderResults(state.search.recipes);
    } catch (error) {
      alert('Error processing search!');
      removeLoader();
    }
  }
};

const controlRecipe = async () => {
  // Step1. Get ID form url
  const id = window.location.hash.replace('#', '');
  console.log(id);

  if (id) {
    // Step2. Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);
    if (state.search) {
      // HightlightSelected
      searchView.hightlightSelected(id);
    }
    // Step3. Create new recipe object
    state.recipe = new Recipe(id);
    // window.recipe = state.recipe;
    try {
      // Step4. Get recipe data
      await state.recipe.getRecipe();
      // console.log(state.recipe);
      // console.log(state.recipe.ingredents);
      state.recipe.parseIngredients();
      // Step5. calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();
      // Step6. render recipe
      removeLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (error) {
      alert('Error processing recipe!');
      removeLoader();
    }
  }
};

const controlList = () => {
  // create a new list IF there in none yet
  if (!state.list) {
    state.list = new List();
  }
  // Add each ingredient to the list
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
  console.log(state.list.items);
};

const controlLikes = () => {
  console.log('Control Likes');
  const {
    recipe: {
      id, img, title, author,
    },
  } = state;
  // create a new like if there in none yet
  if (!state.likes) {
    state.likes = new Likes();
  }
  const currentID = id;
  // User has not yet liked current recipe
  if (!state.likes.isLiked(currentID)) {
    // Add like to the state
    const newLikes = state.likes.addLikes(currentID, img, title, author);
    // Toggle the like button
    likesView.toggleLikeBtn(true);
    // Add like to UI list
    likesView.renderLike(newLikes);
    console.log(state.likes);
    //  User has liked current recipe
  } else {
    // Remove like to the state
    state.likes.removeLikes(currentID);
    // Toggle the like button
    likesView.toggleLikeBtn(false);
    // Remove like to UI list
    likesView.deleteLike(currentID);
    console.log(state.likes);
  }

  likesView.toggleLikesMenu(state.likes.getNumLikes());
};

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  controlSearch();
});

// window.addEventListener('load', (event) => {
//   event.preventDefault();
//   controlSearch();
// });

resultsPages.addEventListener('click', (event) => {
  const btn = event.target.closest('.btn-inline');

  if (btn) {
    const goToPage = parseInt(btn.dataset.gotopage, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.recipes, goToPage, 10);
  }
});

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach((event) => {
  window.addEventListener(event, controlRecipe);
});

// handling recipe btns click
recipe.addEventListener('click', (event) => {
  if (event.target.matches('.btn-decrease, .btn-decrease *')) {
    // Decrease btn is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (event.target.matches('.btn-increase, .btn-increase *')) {
    // increase btn is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (event.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    // Add ingredients to shopping list
    controlList();
  } else if (event.target.matches('.recipe__love, .recipe__love *')) {
    // Add recipr to likes
    controlLikes();
  }
  // console.log(state.recipe);
});

// handling delete and update list item events
shoppingList.addEventListener('click', (event) => {
  const id = event.target.closest('.shopping__item').dataset.itemid;

  if (event.target.matches('.shpooing__delete, .shopping__delete *')) {
    // Delete from state
    state.list.removeItem(id);
    // Delete from UI
    listView.removeItem(id);
    // handling a count update
  } else if (event.target.matches('.shopping__count-value')) {
    const newCount = parseInt(event.target.value, 10);
    state.list.updateCount(id, newCount);
  }
});

window.addEventListener('load', () => {
  state.likes = new Likes();
  // Restore likes
  state.likes.readStorage();
  // Toggle like menu button
  likesView.toggleLikesMenu(state.likes.getNumLikes());
  // Render the existing likes
  state.likes.likes.forEach((like) => likesView.renderLike(like));
});
