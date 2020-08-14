import { elements } from './base';
import { limitRecipeTitle } from './searchView';

export const clearLikes = () => {
  elements.likesList.innerHTML = '';
};

export const toggleLikeBtn = (isLiked) => {
  const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
  const use = document.querySelector('.recipe__love use');

  use.setAttribute('href', `img/icons.svg#${iconString}`);
};

export const toggleLikesMenu = (numLikes) => {
  elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};

export const renderLike = (like) => {
  const newTitle = limitRecipeTitle(like.title);
  const markup = `
    <li>
        <a class="likes__link" href="#${like.id}">
            <figure class="likes__fig">
                <img src="${like.img}" alt="${newTitle}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${newTitle}</h4>
                <p class="likes__author">${like.author}</p>
            </div>
        </a>
    </li>
  `;

  elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = (id) => {
  const el = document.querySelector(`.likes__link[href*="#${id}"]`);

  if (el) {
    el.parentElement.removeChild(el);
  }
};
