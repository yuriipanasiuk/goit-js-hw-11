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

refs.form.addEventListener('submit', onSearchImage);
refs.loadMoreBtn.addEventListener('click', onRequest);

let timerId = '';
let totalPictures = 0;

async function onSearchImage(e) {
  e.preventDefault();

  getPhoto.query = e.currentTarget.elements.searchQuery.value.trim();
  getPhoto.resetPage();

  if (getPhoto.query === '') {
    Notify.warning('input is empty');
    return;
  }

  onRequest();
  clearPage();

  timerId = setTimeout(() => {
    refs.loadMoreBtn.classList.add('show-button');
  }, 2000);

  e.currentTarget.reset();
}

function onRequest() {
  try {
    getPhoto.fetchArticle().then(renderPhoto);
  } catch (error) {
    console.log('error');
  }
}

function renderPhoto(data) {
  // const totalImages = data.totalHits;
  // setTimeout(() => {
  //   Notify.success(`Hooray! We found ${totalImages} images.`);
  // }, 1000);
  makeGallary(data);
}
//під час повернення даних тотал завжди 500, потрібно щось зробити(скопіювати значення) і від нього віднімати
function makeGallary(data) {
  const imageArgs = data.hits;
  const totalImages = data.totalHits;

  if (imageArgs.length === 0) {
    onError();
    return;
  }

  setTimeout(() => {
    Notify.success(`Hooray! We found ${totalImages} images.`);
  }, 1000);

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

function theEndOfGallary() {
  Notify.failure("We're sorry, but you've reached the end of search results.");
  refs.loadMoreBtn.classList.remove('show-button');
}

function createLiteBox() {
  let gallery = new SimpleLightbox('.gallery a');
  gallery.refresh;
}
