// Global app controller
import Search from './models/search';
import Recipe from './models/recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/searchView';
import { elements, renderLoader, removeLoader } from './views/base';

/** Global state of the app
 * - Search Object
 * - Current recipe Object
 * - Shopping list Object
 * - Liked recipes
 */

const state = {};
const { searchForm, resultsPages } = elements;

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
    renderLoader(elements.recipe);
    // Step3. Create new recipe object
    state.recipe = new Recipe(id);
    // window.recipe = state.recipe;
    try {
      // Step4. Get recipe data
      await state.recipe.getRecipe();
      console.log(state.recipe);
      // Step5. calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();
      state.recipe.parseIngredients();
      // Step6. render recipe
      removeLoader();
      // recipeView.renderResults(state.recipe);
    } catch (error) {
      alert('Error processing recipe!');
      removeLoader();
    }
  }
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
