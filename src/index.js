import "./css/styles.css";
import axios from "axios";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    form: document.querySelector('.search-form'),
    input: document.querySelector('input'),
    searchBtn: document.querySelector('button'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more'),
};
let limit = 40;
let page = 0;
let totalPages;
let name;
const lightbox = new SimpleLightbox(".gallery a", {
  captionsData: "alt",
  captionDelay: 250,
});


refs.loadMoreBtn.classList.add('is-hidden');
refs.form.addEventListener('submit', fetchOnSubmit)


async function fetchOnSubmit(event) {
    event.preventDefault();
    refs.loadMoreBtn.addEventListener('click', loadMore);
    name = refs.input.value.trim();
    clearGallery();
    page = 1;
    console.log('PAGE:', page);
    try {
        const data = await fetchCards(name);
        await renderCards(data);
        
        if (totalPages !== 0) {
            scrollBy();
        }            
    }
    catch (error) {
    console.log(error);
    }

}
            
async function loadMore() {
    page += 1;
    console.log('PAGE:', page);
    try {
        const data = await fetchCards(name);
        await renderCards(data);
        lightbox.refresh();
        scrollBy();
        
        if (page >= totalPages) {
            refs.loadMoreBtn.classList.add('is-hidden');
            refs.loadMoreBtn.removeEventListener('click', loadMore);
            Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
        }
    }
    catch (error) {
        console.log(error);
    }
}
            
async function fetchCards(search) {
    const API_KEY = '29184365-ad7d7355f63935605b47c8dfc';
    const BASE_URL = 'https://pixabay.com/api';
    if (!search) {
        Notiflix.Notify.failure("Pease, enter something to search query!");
        return;
    }
    const url = `${BASE_URL}/?key=${API_KEY}&q=${search}&page=${page}&per_page=${limit}&image_type=photo&orientation=horizontal&safesearch=true`;

    try {
        const response = await axios.get(url);
        const data = response.data.hits;
        const amount = response.data.totalHits
        totalPages = Math.ceil(amount / limit);
        console.log('TOTAL PAGES:',totalPages)
        
        if (amount > 0 && amount <= 40) {        
            refs.loadMoreBtn.classList.add('is-hidden');
            refs.loadMoreBtn.removeEventListener('click', loadMore);
            Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");  
        }

        if (amount === 0) {
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            refs.loadMoreBtn.classList.add('is-hidden');
            return;
        }

        if (page === 1 && amount > 40){
            Notiflix.Notify.success(`Hooray! We found ${amount} images.`);
            refs.loadMoreBtn.classList.remove('is-hidden');
        }
        console.log(data)
        return data;
    }
    catch (error) {
    console.log(error);
    }
}

async function renderCards(items) {
    if (!items) {
        return
    }
    const markup = await items
      .map(createCard)
      .join("");
    refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function createCard({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) {
    return `
            <div class="photo-card">
            <a class="gallery-item" href="${largeImageURL}">
                <img
                class="photo-card__image"
                src="${webformatURL}"
                alt="${tags}"
                width= '180px'
                loading="lazy"
                />
            </a>

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
function scrollBy() {
    const { height: cardHeight } = refs.gallery
    .firstElementChild.getBoundingClientRect();

    window.scrollBy({
    top: cardHeight / 2,
    behavior: "smooth",
    });
}

