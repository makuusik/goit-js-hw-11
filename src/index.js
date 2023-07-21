import axios from 'axios';
import Notiflix from 'notiflix';

const API_KEY = '38394863-d0bf61be8343901c1ba6a4493';
const BASE_URL = 'https://pixabay.com/api/';
const perPage = 40;

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let currentPage = 1;
let currentQuery = '';

async function fetchImages(query, page) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: perPage,
        page: page,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
}

function displayImages(images) {
  images.forEach(image => {
    const card = document.createElement('div');
    card.classList.add('photo-card');

    const img = document.createElement('img');
    img.src = image.webformatURL;
    img.alt = image.tags;
    img.loading = 'lazy';

    const info = document.createElement('div');
    info.classList.add('info');

    const likes = document.createElement('p');
    likes.classList.add('info-item');
    likes.innerHTML = `<b>Likes:</b> ${image.likes}`;

    const views = document.createElement('p');
    views.classList.add('info-item');
    views.innerHTML = `<b>Views:</b> ${image.views}`;

    const comments = document.createElement('p');
    comments.classList.add('info-item');
    comments.innerHTML = `<b>Comments:</b> ${image.comments}`;

    const downloads = document.createElement('p');
    downloads.classList.add('info-item');
    downloads.innerHTML = `<b>Downloads:</b> ${image.downloads}`;

    info.appendChild(likes);
    info.appendChild(views);
    info.appendChild(comments);
    info.appendChild(downloads);

    card.appendChild(img);
    card.appendChild(info);

    gallery.appendChild(card);
  });
}

async function searchImages(query) {
  currentPage = 1;
  currentQuery = query;
  gallery.innerHTML = '';

  try {
    const data = await fetchImages(query, currentPage);

    if (data.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      hideLoadMoreBtn();
    } else {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      displayImages(data.hits);
      showLoadMoreBtn();
      currentPage++;
    }
  } catch (error) {
    console.error('Error searching images:', error);
  }
}

async function loadMoreImages() {
  try {
    const data = await fetchImages(currentQuery, currentPage);

    if (data.hits.length > 0) {
      displayImages(data.hits);
      currentPage++;
    } else {
      hideLoadMoreBtn();
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
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
  const searchQuery = event.target.searchQuery.value.trim();
  if (searchQuery !== '') {
    searchImages(searchQuery);
  }
});

loadMoreBtn.addEventListener('click', loadMoreImages);
