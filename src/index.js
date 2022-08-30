import './css/styles.css';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import GetPhoto from './axiosPhoto';
import throttle from 'lodash.throttle';

const getPhoto = new GetPhoto();

const refs = {
  form: document.querySelector('#search-form'),
  galleryBox: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

let timerId = '';

refs.form.addEventListener('submit', onSearchImage);
refs.loadMoreBtn.addEventListener('click', onSearchMore);
addEventListener('scroll', throttle(onScroll, 250));

function onSearchImage(e) {
  e.preventDefault();

  getPhoto.query = e.currentTarget.elements.searchQuery.value.trim();
  getPhoto.resetPage();

  if (getPhoto.query === '') {
    Notify.warning('input is empty');
    return;
  }

  onRequest().then(response => {
    makeGallary(response);
    const totalImage = response.totalHits;

    if (response.totalHits === 0) {
      onError();
      return;
    }

    if (getPhoto.page === 2) {
      totalImageMessage(totalImage);
    }
  });

  timerId = setTimeout(() => {
    showButton();
  }, 2000);

  clearPage();

  e.currentTarget.reset();
}

function onSearchMore() {
  onRequest().then(makeGallary);
  const countPerPage = getPhoto.counterImages();

  if (countPerPage >= totalHits) {
    atTheEndOfGallary();
  }
}

async function onRequest() {
  try {
    return await getPhoto.fetchArticle();
  } catch (error) {
    console.log('error');
  }
}

function makeGallary(data) {
  const { hits } = data;
  // totalHits = data.totalHits;

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
  clearTimeout(timerId);

  return;
}

function clearPage() {
  refs.galleryBox.innerHTML = '';
}

function atTheEndOfGallary() {
  Notify.failure("We're sorry, but you've reached the end of search results.");
  hideButton();
  removeEventListener('scroll', onScroll);
}

function createLiteBox() {
  let gallery = new SimpleLightbox('.gallery a');
  gallery.refresh;
}

function totalImageMessage(total) {
  Notify.success(`Hooray! We found ${total} images.`);
}

function onScroll() {
  const documentRect = document.documentElement.getBoundingClientRect();
  if (documentRect.bottom <= document.documentElement.clientHeight + 150) {
    onSearchMore();
  }
}

function showButton() {
  refs.loadMoreBtn.classList.add('show-button');
}

function hideButton() {
  refs.loadMoreBtn.classList.remove('show-button');
}
