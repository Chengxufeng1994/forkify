import axios from '../api/index';

class Search {
  constructor(query) {
    this.query = query;
  }

  async getRecipes() {
    try {
      // const response = await axios.get(`/search?q=${this.query}`);
      const response = await axios({
        method: 'get',
        url: '/search',
        params: {
          q: this.query,
        },
      });
      const {
        data: { recipes },
      } = response;

      this.recipes = recipes;
    } catch (error) {
      console.error(error);
    }
  }
}

export default Search;
