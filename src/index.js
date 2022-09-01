import './css/styles.css';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import GetPhoto from './axiosPhoto';

const refs = {
  form: document.querySelector('#search-form'),
  galleryBox: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const getPhoto = new GetPhoto();
let gallery = new SimpleLightbox('.gallery a');

refs.form.addEventListener('submit', onSearchImage);
addEventListener('scroll', onScroll);

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

  setTimeout(() => {
    onRequest().then(smoothScroll);
  }, 250);

  e.currentTarget.reset();
}

async function onRequest() {
  try {
    const res = await getPhoto.fetchArticle();
    makeGallary(res);
    notification(res);
    return res;
  } catch (error) {
    console.log(error);
  }
}

function makeGallary({ hits }) {
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
  gallery.refresh();
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function onScroll() {
  addEventListener('scroll', onScroll);
  hideButton();

  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight) {
    onRequest();
  }
}

function showButton() {
  refs.loadMoreBtn.classList.add('show-button');
}

function hideButton() {
  refs.loadMoreBtn.classList.remove('show-button');
}

function clearPage() {
  refs.galleryBox.innerHTML = '';
}

function notification({ totalHits }) {
  const totalPage = Math.ceil(totalHits / getPhoto.per_page);

  if (totalHits === 0) {
    onError();
    return;
  } else if (getPhoto.page === 2) {
    Notify.success(`Hooray! We found ${totalHits} images.`);
    setTimeout(() => {
      showButton();
    }, 500);
  } else if (getPhoto.page > totalPage) {
    atTheEndOfGallary();
  }
}

function atTheEndOfGallary() {
  removeEventListener('scroll', onScroll);
  hideButton();
  setTimeout(() => {
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }, 2000);
}

function onError() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
  hideButton();
  clearPage();
  return;
}
