import { MediaItem, MediaType } from '../types';

const OMDB_KEY = '1a9ba45f';
const RAWG_KEY = '70aaa0bcd001427a8675bd1d09d517c5';

// Helper to normalize OMDb data
const transformOmdbItem = (item: any, type: MediaType): MediaItem => ({
  id: item.imdbID,
  title: item.Title,
  year: parseInt(item.Year) || 0,
  type: type,
  poster: item.Poster !== 'N/A' ? item.Poster : 'https://placehold.co/600x900/1e293b/ffffff?text=No+Image',
  genre: item.Genre ? item.Genre.split(', ') : [],
  description: item.Plot !== 'N/A' ? item.Plot : 'No description available.',
  rating: parseFloat(item.imdbRating) || 0,
  runtime: item.Runtime !== 'N/A' ? item.Runtime : undefined
});

// Helper to normalize RAWG data
const transformRawgItem = (item: any): MediaItem => ({
  id: String(item.id),
  title: item.name,
  year: item.released ? parseInt(item.released.split('-')[0]) : 0,
  type: 'game',
  poster: item.background_image || 'https://placehold.co/600x900/1e293b/ffffff?text=No+Image',
  genre: item.genres ? item.genres.map((g: any) => g.name) : [],
  description: 'Tap card to view details (External Source)', 
  rating: item.rating ? Math.round(item.rating * 20) / 10 : 0, // Convert 5 star to 10 scale
  runtime: item.playtime ? `${item.playtime}h` : undefined
});

export const fetchMoviesAndSeries = async (type: 'movie' | 'series' = 'movie', page = 1): Promise<MediaItem[]> => {
  // Discovery simulation: Search for popular keywords
  const keywords = ['star', 'love', 'dark', 'avengers', 'one', 'game', 'spider', 'batman', 'breaking', 'office', 'dragon'];
  // Deterministic randomish selection based on page
  const keyword = keywords[(page - 1 + Math.floor(Math.random() * keywords.length)) % keywords.length];

  try {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_KEY}&s=${keyword}&type=${type}&page=1`);
    const data = await res.json();

    if (data.Search) {
      // Fetch details for the first 3 items to avoid rate limiting and speed up UI
      const detailedPromises = data.Search.slice(0, 3).map(async (shortItem: any) => {
         try {
             const detailRes = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_KEY}&i=${shortItem.imdbID}`);
             const detailData = await detailRes.json();
             return transformOmdbItem(detailData, type);
         } catch(e) {
             return null;
         }
      });
      
      const results = await Promise.all(detailedPromises);
      return results.filter(item => item !== null) as MediaItem[];
    }
    return [];
  } catch (e) {
    console.error("OMDb fetch error", e);
    return [];
  }
};

export const fetchGames = async (page = 1): Promise<MediaItem[]> => {
  try {
    const res = await fetch(`https://api.rawg.io/api/games?key=${RAWG_KEY}&page=${page}&page_size=10&ordering=-metacritic`);
    const data = await res.json();
    if (data.results) {
        return data.results.map(transformRawgItem);
    }
    return [];
  } catch (e) {
    console.error("RAWG fetch error", e);
    return [];
  }
};

export const searchContent = async (query: string): Promise<MediaItem[]> => {
    try {
        const [movies, series, games] = await Promise.all([
            fetch(`https://www.omdbapi.com/?apikey=${OMDB_KEY}&s=${query}&type=movie`).then(r => r.json()),
            fetch(`https://www.omdbapi.com/?apikey=${OMDB_KEY}&s=${query}&type=series`).then(r => r.json()),
            fetch(`https://api.rawg.io/api/games?key=${RAWG_KEY}&search=${query}&page_size=5`).then(r => r.json())
        ]);

        let results: MediaItem[] = [];

        if (movies.Search) {
            results = [...results, ...movies.Search.map((m: any) => ({
                id: m.imdbID,
                title: m.Title,
                year: parseInt(m.Year) || 0,
                type: 'movie',
                poster: m.Poster !== 'N/A' ? m.Poster : 'https://placehold.co/600x900/1e293b/ffffff?text=No+Image',
                genre: [],
                description: 'Search result',
                rating: 0
            }))];
        }
        if (series.Search) {
            results = [...results, ...series.Search.map((m: any) => ({
                id: m.imdbID,
                title: m.Title,
                year: parseInt(m.Year) || 0,
                type: 'series',
                poster: m.Poster !== 'N/A' ? m.Poster : 'https://placehold.co/600x900/1e293b/ffffff?text=No+Image',
                genre: [],
                description: 'Search result',
                rating: 0
            }))];
        }
        if (games.results) {
            results = [...results, ...games.results.map(transformRawgItem)];
        }

        return results;
    } catch (error) {
        console.error("Search failed", error);
        return [];
    }
}