/**
 * Jikan API Service
 * Fetches anime data from Jikan API and syncs with database
 */

const axios = require('axios');
const Anime = require('../models/Anime');

const JIKAN_API = process.env.JIKAN_API_URL || 'https://api.jikan.moe/v4';

/**
 * Fetch anime from Jikan API
 * @param {string} query - Search query
 * @returns {Promise<Array>} - Array of anime data
 */
exports.fetchAnimeFromJikan = async (query) => {
  try {
    const response = await axios.get(`${JIKAN_API}/anime`, {
      params: { query, limit: 10 },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching from Jikan API:', error.message);
    return [];
  }
};

/**
 * Fetch trending anime
 * @returns {Promise<Array>} - Array of trending anime
 */
exports.fetchTrendingAnime = async () => {
  try {
    const response = await axios.get(`${JIKAN_API}/top/anime`, {
      params: { filter: 'airing', limit: 25 },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching trending anime:', error.message);
    return [];
  }
};

/**
 * Sync anime data with database
 * @param {Object} jikanAnime - Anime data from Jikan
 * @returns {Promise<Object>} - Saved anime document
 */
exports.syncAnimeToDatabase = async (jikanAnime) => {
  try {
    // Check if anime already exists
    let anime = await Anime.findOne({ title: jikanAnime.title });

    if (anime) {
      // Update existing anime
      anime.rating = jikanAnime.score || anime.rating;
      anime.imageUrl = jikanAnime.images?.jpg?.large_image_url || anime.imageUrl;
      anime.description = jikanAnime.synopsis || anime.description;
      anime.genres = jikanAnime.genres?.map(g => g.name) || anime.genres;
      anime.status = jikanAnime.status?.toLowerCase() || anime.status;
      anime.studio = jikanAnime.studios?.[0]?.name || anime.studio;
    } else {
      // Create new anime
      anime = new Anime({
        title: jikanAnime.title,
        description: jikanAnime.synopsis || 'No description available',
        imageUrl: jikanAnime.images?.jpg?.large_image_url || '',
        genres: jikanAnime.genres?.map(g => g.name) || [],
        rating: jikanAnime.score || 0,
        status: jikanAnime.status?.toLowerCase() || 'upcoming',
        studio: jikanAnime.studios?.[0]?.name || '',
        releaseYear: jikanAnime.year || new Date().getFullYear(),
      });
    }

    await anime.save();
    return anime;
  } catch (error) {
    console.error('Error syncing anime to database:', error.message);
    return null;
  }
};

/**
 * Populate database with trending anime
 */
exports.populateDatabase = async () => {
  try {
    console.log('Fetching trending anime from Jikan API...');
    const trendingAnime = await this.fetchTrendingAnime();

    if (trendingAnime.length === 0) {
      console.log('No trending anime found');
      return;
    }

    console.log(`Found ${trendingAnime.length} trending anime. Syncing to database...`);

    for (const anime of trendingAnime) {
      await this.syncAnimeToDatabase(anime);
    }

    console.log('Database population complete!');
  } catch (error) {
    console.error('Error populating database:', error.message);
  }
};
