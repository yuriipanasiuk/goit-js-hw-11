import axios from 'axios';
import { page, per_page } from './index';
const API_KEY = '29525266-43f22ff86b92049909965975c';

const BASE_URL = `https://pixabay.com/api/?key=${API_KEY}&q=`;
const FILTER_RESPONSE = `&orientation=horizontal&image_type=photo&safesearch=true`;

export async function getPhoto(name) {
  const params = new URLSearchParams({
    page,
    per_page,
  });

  let resolve = await axios.get(
    `${BASE_URL}${name}${FILTER_RESPONSE}${params}`
  );
  let data = resolve.data;
  return data;
}
