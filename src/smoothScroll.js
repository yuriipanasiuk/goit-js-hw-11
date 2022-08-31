export function smoothScroll() {
  //   const { height: cardHeight } = document
  //     .querySelector('.photo-card')
  //     .firstElementChild.getBoundingClientRect();

  //   window.scrollBy({
  //     top: cardHeight * 2,
  //     behavior: 'smooth',
  //   });
  const { height: cardHeight } = document
    .querySelector('.photo-card')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
