import axios from 'axios';

const API_KEY = '29525266-43f22ff86b92049909965975c';
const BASE_URL = `https://pixabay.com/api/?key=${API_KEY}&q=`;
const FILTER_RESPONSE = `&orientation=horizontal&image_type=photo&safesearch=true&`;

export default class GetPhoto {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  async fetchArticle() {
    const params = new URLSearchParams({
      page: this.page,
      per_page: this.per_page,
    });
    const url = `${BASE_URL}${this.searchQuery}${FILTER_RESPONSE}${params}`;
    const resolve = await axios.get(url);

    this.incrementPage();

    return resolve.data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
