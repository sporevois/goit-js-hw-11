import axios from "axios";

export async function fetchCards(searchTerm, page, limit) {
    const API_KEY = '29184365-ad7d7355f63935605b47c8dfc';
    const BASE_URL = 'https://pixabay.com/api';
    const url = `${BASE_URL}/?key=${API_KEY}&q=${searchTerm}&page=${page}&per_page=${limit}&image_type=photo&orientation=horizontal&safesearch=true`;

    try {
        const response = await axios.get(url);
        const data = response.data;  
        return data;
    }
    catch (error) {
    console.log(error);
    }
}
