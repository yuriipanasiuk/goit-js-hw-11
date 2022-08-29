import './css/styles.css';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import GetPhoto from './axiosPhoto';

const getPhoto = new GetPhoto();

const refs = {
  form: document.querySelector('#search-form'),
  galleryBox: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let timerId = '';
let totalHits = '';

refs.form.addEventListener('submit', onSearchImage);
refs.loadMoreBtn.addEventListener('click', onSearchMore);

async function onSearchImage(e) {
  e.preventDefault();

  getPhoto.query = e.currentTarget.elements.searchQuery.value.trim();
  getPhoto.resetPage();

  if (getPhoto.query === '') {
    Notify.warning('input is empty');
    return;
  }

  onRequest();
  totalImageMessage();
  clearPage();

  timerId = setTimeout(() => {
    refs.loadMoreBtn.classList.add('show-button');
  }, 2000);

  e.currentTarget.reset();
}
function onSearchMore() {
  onRequest();
  const countPerPage = getPhoto.counterImages();

  if (countPerPage >= totalHits) {
    atTheEndOfGallary();
  }
}

function onRequest() {
  try {
    getPhoto.fetchArticle().then(makeGallary);
  } catch (error) {
    console.log('error');
  }
}

function makeGallary(data) {
  const imageArgs = data.hits;
  totalHits = data.totalHits;

  if (totalHits === 0) {
    onError();
    return;
  }

  const markup = imageArgs.reduce(
    (acc, image) =>
      acc +
      `<div class="photo-card">
      <a class = "gallary__item" href="${image.largeImageURL}">
      <img class ="gallery__image"  src="${image.webformatURL}" alt="${image.tags}" loading="lazy"/></a>
    <div class="info">
      <p class="info-item">
        <b>Likes: </b>${image.likes}
      </p>
      <p class="info-item">
        <b>Views: </b>${image.views}
      </p>
      <p class="info-item">
        <b>Comments: </b>${image.comments}
      </p>
      <p class="info-item">
        <b>Dowloads: </b>${image.downloads}
      </p>
    </div>
  </div>`,
    ''
  );

  refs.galleryBox.insertAdjacentHTML('beforeend', markup);
  createLiteBox();
}

function onError() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
  clearTimeout(timerId);
  refs.loadMoreBtn.classList.remove('show-button');
  return;
}

function clearPage() {
  refs.galleryBox.innerHTML = '';
}

function atTheEndOfGallary() {
  Notify.failure("We're sorry, but you've reached the end of search results.");
  refs.loadMoreBtn.classList.remove('show-button');
}

function createLiteBox() {
  let gallery = new SimpleLightbox('.gallery a');
  gallery.refresh;
}

function totalImageMessage() {
  setTimeout(() => {
    Notify.success(`Hooray! We found ${totalHits} images.`);
  }, 500);
}
