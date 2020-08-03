// Global app controller
import Search from './models/search';
import * as searchView from './views/searchView';
import { elements, renderLoader, removeLoader } from './views/base';

/** Global state of the app
 * - Search Object
 * - Current recipe Object
 * - Shopping list Object
 * - Liked recipes
 */

const state = {};
const { searchForm, resultsPages, resultsBtnPrev, resultsBtnNext } = elements;

const controlSearch = async () => {
  // Step1. Get query from View
  const query = searchView.getInputValue();

  if (query) {
    // Step2. New Search object and add to state
    state.search = new Search(query);

    // Step3. Prepare UI for results
    searchView.clearInputValue();
    searchView.clearResults();
    renderLoader(elements.searchResult);

    // Step4. Search for recipes
    await state.search.getRecipes();

    // Step5. Render results on UI
    removeLoader();
    searchView.renderResults(state.search.recipes);
  }
};

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  controlSearch();
});

resultsPages.addEventListener('click', (event) => {
  const btn = event.target.closest('.btn-inline');

  if (btn) {
    const goToPage = parseInt(btn.dataset.gotopage, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.recipes, goToPage, 10);
  }

});
