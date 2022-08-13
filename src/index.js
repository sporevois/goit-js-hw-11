import axios from "axios";
import Notiflix from "notiflix";

const refs = {
    form: document.querySelector('.search-form'),
    input: document.querySelector('input'),
    button: document.querySelector('button'),
    gallery: document.querySelector('.gallery')
};
refs.form.addEventListener('submit', fetchCards)
async function fetchCards(event) {
    event.preventDefault();
    const name = refs.input.value.trim();
    const API_KEY = '29184365-ad7d7355f63935605b47c8dfc';
    const BASE_URL = 'https://pixabay.com/api';

    const response = await axios.get(`${BASE_URL}/?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true`)
    const data = response.data.hits;
    // return data;
    renderCards(data)
}


function renderCards(items) {
    const markup = items
      .map(({ webformatURL, tags, likes, views, comments, downloads }) => {
          return `
            <div class="photo-card">
                <img src="${webformatURL}" alt="${tags}" loading="lazy" width= '240px' />
                <div class="info">
                    <p class="info-item">
                        <b>Likes ${likes}</b>
                    </p>
                    <p class="info-item">
                        <b>Views ${views}</b>
                    </p>
                    <p class="info-item">
                        <b>Comments ${comments}</b>
                    </p>
                    <p class="info-item">
                        <b>Downloads ${downloads}</b>
                    </p>
                </div>
            </div>`
      })
      .join("");
    refs.gallery.innerHTML = markup;
}



