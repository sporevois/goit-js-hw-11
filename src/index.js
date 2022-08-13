import "./css/styles.css";
import axios from "axios";
import Notiflix from "notiflix";

const refs = {
    form: document.querySelector('.search-form'),
    input: document.querySelector('input'),
    searchBtn: document.querySelector('button'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
};
let limit = 100;
let page = 0;
let totalPages;

refs.loadMoreBtn.classList.add('is-hidden');
refs.form.addEventListener('submit', fetchOnSubmit)

function fetchOnSubmit(event) {
    event.preventDefault();
    page = 1;
    clearGallery();
    fetchCards();
}

async function fetchCards() {    
    try {
        const response = await axios.get(createURL());
        const data = response.data.hits;
        let amount = response.data.totalHits
        totalPages = Math.ceil(amount/limit);
        console.log(totalPages)

        if (data.length === 0) {
            refs.loadMoreBtn.classList.add('is-hidden');
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            return;
        }

        if (page === 1) {
            Notiflix.Notify.success(`Hooray! We found ${amount} images.`)
        }

        if (page > totalPages) {
            refs.loadMoreBtn.classList.add('is-hidden');
            Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
            return;
        }
        page += 1;
        refs.loadMoreBtn.classList.remove('is-hidden');
        refs.loadMoreBtn.addEventListener('click', fetchCards);
        
        renderCards(data);
        return console.log(data);
    }
    catch (error) {
    console.log(error);
    }
    
}
function createURL() {
    const name = refs.input.value.trim();
    const API_KEY = '29184365-ad7d7355f63935605b47c8dfc';
    const BASE_URL = 'https://pixabay.com/api';
    const url = `${BASE_URL}/?key=${API_KEY}&q=${name}&page=${page}&per_page=${limit}&image_type=photo&orientation=horizontal&safesearch=true`;
    return url;
}

function renderCards(items) {
    const markup = items
      .map(createCard)
      .join("");
    refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function createCard({ webformatURL, tags, likes, views, comments, downloads }) {
    return `
            <div class="photo-card">
                <img class="photo-card__image" src="${webformatURL}" alt="${tags}" loading="lazy" width= '180px' />
                <div class="info">
                    <p class="info-item">
                        <b>Likes</b>
                        <b>${likes}</b>
                    </p>
                    <p class="info-item">
                        <b>Views</b>
                        <b>${views}</b>
                    </p>
                    <p class="info-item">
                        <b>Comments</b>
                        <b>${comments}</b>
                    </p>
                    <p class="info-item">
                        <b>Downloads</b>
                        <b>${downloads}</b>
                    </p>
                </div>
            </div>`
}

function clearGallery() {
    refs.gallery.innerHTML = "";
}

