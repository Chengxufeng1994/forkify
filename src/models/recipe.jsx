import axios from '../api/index';
class Recipe {
  constructor(id) {
    this.id = id;
  }

  getRecipe = async () => {
    try {
      // const response = await axios.get(`/search?q=${this.query}`);
      const response = await axios({
        method: 'get',
        url: '/get',
        params: {
          rId: this.id,
        },
      });
      const {
        data: { recipe },
      } = response;
      // console.log(recipe);
      this.title = recipe.title;
      this.author = recipe.publisher;
      this.img = recipe.image_url;
      this.url = recipe.source_url;
      this.publisherUrl = recipe.publisher_url;
      this.ingredients = recipe.ingredients;
    } catch (error) {
      console.error(error);
      alert('Something went wrong!!!');
    }
  };

  calcTime = () => {
    // Assuming that we need 15 min for each ingredients
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);

    this.time = periods * 15;
  };

  calcServings = () => {
    this.servings = 4;
  };

  parseIngredients = () => {
    const unitsLong = [
      'tablespoon',
      'tablespoons',
      'ounce',
      'ounces',
      'teaspoon',
      'teaspoons',
      'cups',
      'pounds',
    ];
    const unitsShort = [
      'tbsp',
      'tbsp',
      'oz',
      'oz',
      'tsp',
      'tsp',
      'cup',
      'pound',
    ];
    const units = [...unitsShort, 'kg', 'g'];

    const newIngredients = this.ingredients.map((el) => {
      // step1. Uniform units
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });
      // step2. remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
      // step3. parse ingredients into count, unit and ingredient
      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex((el2) => {
        return unitsShort.includes(el2);
      });
      let objIng;
      // console.log(arrIng, unitIndex);
      if (unitIndex > -1) {
        // There is a unit
        // Ex. 4 1/2 cups, arrCount is [4, 1/2]
        // Ex. 4 cups, arrCount is [4]
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace('-', '+'));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join('+'));
        }
        // console.log(arrCount, count);
        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' '),
        };
      } else if (parseInt(arrIng[0], 10)) {
        // There is NO unit, but 1st element is number
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' '),
        };
      } else if (unitIndex === -1) {
        // There is NO unit and NO number in 1st position
        objIng = {
          count: 1,
          unit: '',
          ingredient,
        };
      }

      return objIng;
    });

    this.ingredients = newIngredients;
  };

  updateServings = (type) => {
    // Servings
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
    // Ingredients
    this.ingredients.forEach((ing) => {
      ing.count = ing.count * (newServings / this.servings);
    });

    this.servings = newServings;
  };
}

export default Recipe;
