const API_KEY = '38394863-d0bf61be8343901c1ba6a4493';
const BASE_URL = 'https://pixabay.com/api/';

export async function fetchImages(query, page, perPage) {
  try {
    const response = await fetch(
      `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(
        query
      )}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
}
