import 'font-awesome/css/font-awesome.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import createImageMarkup from './js/marcup.js';
import { perPage, fetchImg } from './js/fetch.js';
import smoothScroll from './js/smoothScroll.js';

const galleryEl = document.querySelector('.gallery');
const searchQueryEl = document.querySelector('input[name="searchQuery"]');
const searchFormEl = document.querySelector('form');
const loadMoreButtonEl = document.querySelector('.load-more');
const gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const messageEndOfSearchResults = `<p class = 'message'>We're sorry, but you've reached the end of search results.</p>`;

let searchNumber;
let searchQuery;

searchFormEl.addEventListener('submit', onSubmitSearchButtonEl);

function onSubmitSearchButtonEl(e) {
  e.preventDefault();
  clearMarcup();
  searchNumber = 1;
  searchQuery = searchQueryEl.value;
  showMessageAndRenderMarcup();
}

async function onClickLoadMoreButtonEl(e) {
  searchNumber += 1;
  const respons = await fetchImg(searchQuery, searchNumber);
  renderMarcup(respons);
  smoothScroll(galleryEl);
}

async function showMessageAndRenderMarcup() {
  const respons = await fetchImg(searchQuery, searchNumber);
  const imgCount = respons.data.totalHits;
  if (imgCount > 0) {
    Notify.success(`Hooray! We found ${imgCount} images.`);
    renderMarcup(respons);
  } else {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

async function renderMarcup(res) {
  const images = res.data.hits;
  const countImg = res.data.totalHits;
  const countFetch = Math.ceil(countImg / perPage);
  console.log('countFetch', countFetch);
  console.log('searchNumber', searchNumber);

  if (countImg > 40 && countFetch > searchNumber) {
    loadMoreButtonEl.style.display = 'block';
    loadMoreButtonEl.addEventListener('click', onClickLoadMoreButtonEl);
  }

  if (countFetch === searchNumber) {
    loadMoreButtonEl.style.display = 'none';
    loadMoreButtonEl.removeEventListener('click', onClickLoadMoreButtonEl);
    galleryEl.insertAdjacentHTML('afterend', messageEndOfSearchResults);
  }

  const galerry = createImageMarkup(images);
  galleryEl.insertAdjacentHTML('beforeend', galerry);
  gallery.refresh();
}

function clearMarcup() {
  const messageEndOfSearchResultsEl = document.querySelector('.message');
  if (messageEndOfSearchResultsEl) {
    messageEndOfSearchResultsEl.remove();
  }
  galleryEl.innerHTML = '';
}
