import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getPhoto } from './axiosPhoto';

export let page = 1;
export let per_page = 40;

const refs = {
  form: document.querySelector('#search-form'),
  galleryBox: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onSearchImage);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onLoadMore() {
  per_page += 1;
  clearPage();
  const inputValue = '';
  request(inputValue);
}

async function onSearchImage(e) {
  e.preventDefault();

  clearPage();
  // page = 1;

  const form = e.currentTarget;
  const searchQuery = form.elements.searchQuery.value.trim();
  inputValue = searchQuery;

  if (!searchQuery) {
    return clearPage();
  }

  request(searchQuery);

  e.currentTarget.reset();

  setTimeout(() => {
    refs.loadMoreBtn.classList.add('show-button');
  }, 2000);
}

function request(response) {
  try {
    getPhoto(response).then(renderPhoto);
  } catch (onError) {
    console.error(error);
  }
}

function onError() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function clearPage() {
  refs.galleryBox.innerHTML = '';
}

function renderPhoto(data) {
  makeGallary(data);
}

function makeGallary(data) {
  const imageArgs = data.hits;
  if (imageArgs.length === 0) {
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

  refs.galleryBox.innerHTML = markup;
  createLiteBox();
}

function createLiteBox() {
  let gallery = new SimpleLightbox('.gallery a');
  gallery.refresh;
}
