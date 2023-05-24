import 'font-awesome/css/font-awesome.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import createImageMarkup from './js/marcup.js';
import FetchImg from './js/fetch.js';
import smoothScroll from './js/smoothScroll.js';
import throttle from 'lodash.throttle';

const galleryEl = document.querySelector('.gallery');
const searchQueryEl = document.querySelector('input[name="searchQuery"]');
const searchFormEl = document.querySelector('form');
const gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
let searchQuery;
let fetch;

searchFormEl.addEventListener('submit', event => {
  event.preventDefault();
  onSubmitSearchButton();
});
window.addEventListener('scroll', throttle(onScroll, 300));

async function onSubmitSearchButton() {
  clearMarcup();
  searchQuery = searchQueryEl.value;
  fetch = new FetchImg(`${searchQuery}`);
  await fetch.getResponce();
  showMessage(fetch);
  renderMarcup(fetch);
}

async function onScroll() {
  if (checkPosition()) {
    await fetch.nextPage();
    renderMarcup(fetch);
    smoothScroll(galleryEl);
  }
}

function checkPosition() {
  const height = document.body.offsetHeight;
  const screenHeight = window.innerHeight;
  const scrolled = window.scrollY;
  const threshold = height - screenHeight / 4;
  const position = scrolled + screenHeight;
  return position >= threshold;
}

function clearMarcup() {
  const messageEnd = document.querySelector('.message');
  if (messageEnd) {
    messageEnd.remove();
  }
  galleryEl.innerHTML = '';
}

function showMessage(f) {
  const imgCount = f.getCountImg();
  if (imgCount > 0) {
    Notify.success(`Hooray! We found ${imgCount} images.`);
  } else {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function renderMarcup(f) {
  const images = f.getImg();
  const countFetch = f.getCountRequests();
  const searchNumber = f.getPege();

  if (countFetch === searchNumber) {
    const messageEndOfSearchResults = `<p class = 'message'>We're sorry, but you've reached the end of search results.</p>`;
    galleryEl.insertAdjacentHTML('afterend', messageEndOfSearchResults);
  }

  const galerry = createImageMarkup(images);
  galleryEl.insertAdjacentHTML('beforeend', galerry);
  gallery.refresh();
}
