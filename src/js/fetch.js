const axios = require('axios/dist/browser/axios.cjs');
const perPage = 40;
async function fetchImg(inputValue, page) {
  const res = await axios.get(
    `https://pixabay.com/api/?key=8750177-d089b57417bac5b783de77329&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  );
  return res;
}

export { perPage, fetchImg };
