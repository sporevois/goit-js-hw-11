import "./css/styles.css";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { fetchCards } from './js/fetch-cards';
import { renderCards } from "./js/render-cards";

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
    if (!name) {
        return Notiflix.Notify.failure("Pease, enter something to search query!");
    }

    clearGallery();
    page = 1;
    console.log('LOAD RESULT:', `PAGE ${page} LOADED`);
    try {
        const data = await fetchCards(name, page, limit);
        const amount = data.totalHits;
        const hitsArr = data.hits;
        totalPages = Math.ceil(amount / limit);
        
        const markup = await renderCards(hitsArr);
        refs.gallery.insertAdjacentHTML('beforeend', markup);
        
        if (totalPages !== 0) {
            scrollBy();
        }
        if (amount > 0 && amount <= 40) {        
            hideLoadMoreBtn();
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");  
        }

        if (amount === 0) {
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            hideLoadMoreBtn()
            return;
        }

        if (page === 1 && amount > 40){
            Notiflix.Notify.success(`Hooray! We found ${amount} images.`);
            showLoadMoreBtn();
        }
    }
    catch (error) {
    console.log(error);
    }

}

async function loadMore() {
    page += 1;
    console.log('LOAD RESULT:', `PAGE ${page} LOADED`);
    try {
        const data = await fetchCards(name, page, limit);
        const hitsArr = data.hits;
        const markup = await renderCards(hitsArr);
        refs.gallery.insertAdjacentHTML('beforeend', markup);
        lightbox.refresh();
        scrollBy();
        
        if (page >= totalPages) {
            hideLoadMoreBtn();
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        }
    }
    catch (error) {
        console.log(error);
    }
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
function hideLoadMoreBtn() {
    refs.loadMoreBtn.classList.add('is-hidden');
    refs.loadMoreBtn.removeEventListener('click', loadMore);
}
function showLoadMoreBtn() {
    refs.loadMoreBtn.classList.remove('is-hidden');
    refs.loadMoreBtn.addEventListener('click', loadMore);
}

