const axios = require('axios/dist/browser/axios.cjs');
export default class FetchImg {
  page = 1;

  constructor(
    inputValue,
    perPage = 40,
    KEY = '8750177-d089b57417bac5b783de77329',
    type = 'photo',
    orientation = 'horizontal'
  ) {
    this.inputValue = inputValue;
    this.perPage = perPage;
    this.key = KEY;
    this.type = type;
    this.orientation = orientation;
    this.data;
  }

  async getResponce() {
    try {
      const responce = await axios.get(
        `https://pixabay.com/api/?key=${this.key}&q=${this.inputValue}&image_type=${this.type}&orientation=${this.orientation}&safesearch=true&per_page=${this.perPage}&page=${this.page}`
      );
      const responseData = responce.data;
      this.data = responseData;
      return responseData;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  nextPage() {
    this.page += 1;
    return this.getResponce();
  }

  getImg() {
    this.img = this.data.hits;
    return this.img;
  }

  getCountImg() {
    this.countImg = this.data.totalHits;
    return this.countImg;
  }

  getCountRequests() {
    this.countRequests = Math.ceil(this.getCountImg() / this.perPage);
    return this.countRequests;
  }

  getPege() {
    return this.page;
  }
}
