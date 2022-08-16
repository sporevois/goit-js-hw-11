export function createCard({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) {
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