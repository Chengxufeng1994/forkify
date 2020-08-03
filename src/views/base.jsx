export const elements = {
  searchForm: document.querySelector('.search'),
  searchInput: document.querySelector('.search__field'),
  searchResult: document.querySelector('.results'),
  resultsList: document.querySelector('.results__list'),
  resultsPages: document.querySelector('.results__pages'),
  resultsBtnPrev: document.querySelector('.results__btn--prev'),
  resultsBtnNext: document.querySelector('.results__btn--next'),
};

export const elementStrings = {
  loader: 'loader',
};

export const renderLoader = (parent) => {
  const loader = `
    <div class=${elementStrings.loader}>
      <svg>
        <use href="img/icons.svg#icon-cw" ></use>
      </svg>
    </div>
  `;

  parent.insertAdjacentHTML('afterbegin', loader);
};

export const removeLoader = () => {
  const loader = document.querySelector(`.${elementStrings.loader}`);
  if (loader) {
    loader.parentElement.removeChild(loader);
  }
};
