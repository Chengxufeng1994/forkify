import { elements } from './base';

export const getInputValue = () => elements.searchInput.value;

export const clearInputValue = () => {
  elements.searchInput.value = '';
};

export const clearResults = () => {
  elements.resultsList.innerHTML = '';
  elements.resultsPages.innerHTML = '';
};

export const hightlightSelected = (id) => {
  const resultArr = document.querySelectorAll('.results__link');
  resultArr.forEach((el) => el.classList.remove('results__link--active'));
  const resultId = document.querySelector(`.results__link[href="#${id}"]`);
  // console.log(resultId);
  resultId.classList.add('results__link--active');
  // document
  //   .querySelector(`a [href=#${id}]`)
  //   .classList.add('.result__link--active');
};

/*
// 'Pasta with toato and spinach'
  acc: 0 / acc + cur.length = 5 / newTitle=['Pasta]
  acc: 5 / acc + cur.length = 9 / newTitle=['Pasta', 'with']
  acc: 9 / acc + cur.length = 15 / newTitle=['Pasta', 'with', 'tomato']
  acc: 15 / acc + cur.length = 18 / newTitle=['Pasta', 'with', 'tomato']
  acc: 18 / acc + cur.length = 24 / newTitle=['Pasta', 'with', 'tomato']
*/
export const limitRecipeTitle = (title, limit = 17) => {
  // if (title.length > limit) {
  //   return title.substring(0, limit) + '...';
  // }
  const newTitle = [];
  if (title.length > limit) {
    title.split(' ').reduce((acc, cur) => {
      if (acc + cur.length <= limit) {
        newTitle.push(cur);
      }
      return acc + cur.length;
    }, 0);

    return `${newTitle.join(' ')}...`;
  }

  return title;
};

const renderRecipe = (recipe) => {
  // console.log(recipe);
  const markup = `
  <li>
    <a class="results__link" href="#${recipe.recipe_id}">
      <figure class="results__fig">
          <img src="${recipe.image_url}" alt="${recipe.title}">
      </figure>
      <div class="results__data">
          <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
          <p class="results__author">${recipe.publisher}</p>
      </div>
    </a>
  </li>
  `;

  elements.resultsList.insertAdjacentHTML('beforeend', markup);
};

const createBtn = (page, type) => `
  <button class="btn-inline results__btn--${type}" data-gotopage=${
  type === 'prev' ? page - 1 : page + 1
}>
    <svg class="search__icon">
      <use href="img/icons.svg#icon-triangle-${
  type === 'prev' ? 'left' : 'right'
}"></use>
    </svg>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
  </button>
`;

const renderButtons = (page, numResults, recipesPerPage) => {
  const pages = Math.ceil(numResults / recipesPerPage);
  let btn;

  if (page === 1 && pages > 1) {
    // Only next btn
    btn = createBtn(page, 'next');
  } else if (page < pages) {
    // Both btn
    btn = `
      ${createBtn(page, 'next')};
      ${createBtn(page, 'prev')};
    `;
  } else if (page === pages && pages > 1) {
    // Only prev btn
    btn = createBtn(page, 'prev');
  }

  elements.resultsPages.insertAdjacentHTML('afterbegin', btn);
};

export const renderResults = (recipes, page = 1, recipesPerPage = 10) => {
  const start = (page - 1) * recipesPerPage;
  const end = page * recipesPerPage;

  recipes.slice(start, end).forEach((recipe) => {
    renderRecipe(recipe);
  });
  // render pagination btns
  renderButtons(page, recipes.length, recipesPerPage);
};
