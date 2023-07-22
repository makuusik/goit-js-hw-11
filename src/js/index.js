import Notiflix from 'notiflix';
import { fetchImages } from './api.js';

const perPage = 40;
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('searchQuery');
const searchButton = document.getElementById('search-button');

let currentPage = 1;
let currentQuery = '';
let totalHits = 0;

function displayImages(images) {
  const imageCards = images.map(image => {
    return `
      <div class="photo-card">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        <div class="info">
          <p class="info-item"><b>Likes:</b> ${image.likes}</p>
          <p class="info-item"><b>Views:</b> ${image.views}</p>
          <p class="info-item"><b>Comments:</b> ${image.comments}</p>
          <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
        </div>
      </div>
    `;
  });

  gallery.insertAdjacentHTML('beforeend', imageCards.join(''));
}

async function handleResponse(data) {
  if (data.hits.length === 0) {
    Notiflix.Notify.failure(
      'К сожалению, по вашему запросу не найдено ни одного изображения.'
    );
    hideLoadMoreBtn();
  } else {
    Notiflix.Notify.success(`Ура! Мы нашли ${data.totalHits} изображений.`);
    displayImages(data.hits);
    if (currentPage >= Math.ceil(data.totalHits / perPage)) {
      hideLoadMoreBtn();
    } else {
      showLoadMoreBtn();
    }
    currentPage++;
    totalHits = data.totalHits;
  }
}

async function searchImages(query) {
  currentPage = 1;
  currentQuery = query;
  gallery.innerHTML = '';

  try {
    const data = await fetchImages(query, currentPage, perPage);
    handleResponse(data);
  } catch (error) {
    console.error('Error searching images:', error);
  }
}

async function loadMoreImages() {
  if (currentPage >= Math.ceil(totalHits / perPage)) {
    hideLoadMoreBtn();
    Notiflix.Notify.info('Мы достигли конца результатов поиска.');
    return;
  }

  try {
    const data = await fetchImages(currentQuery, currentPage, perPage);

    if (data.hits.length > 0) {
      displayImages(data.hits);
      currentPage++;
    } else {
      hideLoadMoreBtn();
      Notiflix.Notify.info('Мы достигли конца результатов поиска.');
    }
  } catch (error) {
    console.error('Error loading more images:', error);
  }
}

function showLoadMoreBtn() {
  loadMoreBtn.classList.remove('hidden');
}

function hideLoadMoreBtn() {
  loadMoreBtn.classList.add('hidden');
}

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  const searchQuery = searchInput.value.trim();
  if (searchQuery !== '') {
    searchImages(searchQuery);
  }
});

searchInput.addEventListener('input', () => {
  toggleSearchButton();
});

loadMoreBtn.addEventListener('click', loadMoreImages);

function toggleSearchButton() {
  const searchQuery = searchInput.value.trim();
  searchButton.disabled = searchQuery === '';
}

toggleSearchButton();
