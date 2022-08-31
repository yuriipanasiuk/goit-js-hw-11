import './css/styles.css';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import GetPhoto from './axiosPhoto';
import throttle from 'lodash.throttle';
import { createLiteBox } from './liteBox';
import { smoothScroll } from './smoothScroll';

const getPhoto = new GetPhoto();

const refs = {
  form: document.querySelector('#search-form'),
  galleryBox: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onSearchImage);
refs.loadMoreBtn.addEventListener('click', onRequest);
// addEventListener('scroll', throttle(onScroll, 250));

function onSearchImage(e) {
  e.preventDefault();

  getPhoto.query = e.currentTarget.elements.searchQuery.value.trim();
  getPhoto.resetPage();

  if (getPhoto.query === '') {
    Notify.warning('input is empty');
    return;
  }
  hideButton();
  clearPage();
  onRequest();

  e.currentTarget.reset();
}

// function onSearchMore() {
//   onRequest();
// }

async function onRequest() {
  try {
    const res = await getPhoto.fetchArticle();
    makeGallary(res);
    notification(res);
  } catch (error) {
    console.log(error);
  }
}

function makeGallary({ hits }) {
  if (hits !== 0) {
    smoothScroll();
  }
  const markup = hits.reduce(
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
  hideButton();
  clearPage();
  return;
}

function clearPage() {
  refs.galleryBox.innerHTML = '';
}

function atTheEndOfGallary() {
  hideButton();
  Notify.failure("We're sorry, but you've reached the end of search results.");

  // removeEventListener('scroll', onScroll);
}

function notification(res) {
  const totalPage = Math.ceil(res.totalHits / getPhoto.per_page);

  if (res.totalHits === 0) {
    onError();
    return;
  } else if (getPhoto.page === 2) {
    Notify.success(`Hooray! We found ${res.totalHits} images.`);
    setTimeout(() => {
      showButton();
    }, 500);
  } else if (getPhoto.page > totalPage) {
    atTheEndOfGallary();
  }
}

function onScroll() {
  const documentRect = document.documentElement.getBoundingClientRect();
  if (documentRect.bottom <= document.documentElement.clientHeight + 150) {
    onRequest();
  }
}

function showButton() {
  refs.loadMoreBtn.classList.add('show-button');
}

function hideButton() {
  refs.loadMoreBtn.classList.remove('show-button');
}
