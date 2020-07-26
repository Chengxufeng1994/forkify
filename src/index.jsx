// Global app controller
import Search from './models/search';

const search = new Search('pizza');
console.log(search.getRecipes());
