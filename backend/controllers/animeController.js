/**
 * Anime Controller
 * Handles anime CRUD operations, search, and filtering
 */

const Anime = require('../models/Anime');

/**
 * Get all anime with pagination, filtering, and sorting
 * GET /api/anime
 */
exports.getAllAnime = async (req, res) => {
  try {
    const { page = 1, limit = 10, genre, status, sort = '-rating' } = req.query;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (genre) filter.genres = genre;
    if (status) filter.status = status;

    // Execute query
    const anime = await Anime.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Anime.countDocuments(filter);

    res.status(200).json({
      success: true,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
      data: anime,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get trending anime
 * GET /api/anime/trending
 */
exports.getTrendingAnime = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const anime = await Anime.find()
      .sort('-viewCount')
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: anime,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get single anime by ID
 * GET /api/anime/:id
 */
exports.getAnimeById = async (req, res) => {
  try {
    const anime = await Anime.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    );

    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }

    res.status(200).json({
      success: true,
      data: anime,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Search anime
 * GET /api/anime/search
 */
exports.searchAnime = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const anime = await Anime.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: anime,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all genres
 * GET /api/anime/genres/list
 */
exports.getAllGenres = async (req, res) => {
  try {
    const genres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller', 'Other'];

    res.status(200).json({
      success: true,
      data: genres,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get anime by genre
 * GET /api/anime/genre/:genre
 */
exports.getAnimeByGenre = async (req, res) => {
  try {
    const { genre } = req.params;
    const { limit = 10 } = req.query;

    const anime = await Anime.find({ genres: genre })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: anime,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create new anime (Admin only)
 * POST /api/anime
 */
exports.createAnime = async (req, res) => {
  try {
    const { title, description, imageUrl, bannerUrl, genres, status, studio, director, releaseYear, season } = req.body;

    // Validate required fields
    if (!title || !description || !imageUrl) {
      return res.status(400).json({ message: 'Title, description, and image URL are required' });
    }

    const anime = new Anime({
      title,
      description,
      imageUrl,
      bannerUrl,
      genres,
      status,
      studio,
      director,
      releaseYear,
      season,
    });

    await anime.save();

    res.status(201).json({
      success: true,
      message: 'Anime created successfully',
      data: anime,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update anime (Admin only)
 * PUT /api/anime/:id
 */
exports.updateAnime = async (req, res) => {
  try {
    const { title, description, imageUrl, bannerUrl, genres, status, studio, director, releaseYear, season, rating } = req.body;

    let anime = await Anime.findById(req.params.id);
    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }

    // Update fields
    if (title) anime.title = title;
    if (description) anime.description = description;
    if (imageUrl) anime.imageUrl = imageUrl;
    if (bannerUrl) anime.bannerUrl = bannerUrl;
    if (genres) anime.genres = genres;
    if (status) anime.status = status;
    if (studio) anime.studio = studio;
    if (director) anime.director = director;
    if (releaseYear) anime.releaseYear = releaseYear;
    if (season) anime.season = season;
    if (rating) anime.rating = rating;

    await anime.save();

    res.status(200).json({
      success: true,
      message: 'Anime updated successfully',
      data: anime,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete anime (Admin only)
 * DELETE /api/anime/:id
 */
exports.deleteAnime = async (req, res) => {
  try {
    const anime = await Anime.findByIdAndDelete(req.params.id);

    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Anime deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Add episode to anime (Admin only)
 * POST /api/anime/:id/episodes
 */
exports.addEpisode = async (req, res) => {
  try {
    const { episodeNumber, title, description, videoUrl, duration, thumbnail } = req.body;

    // Validate required fields
    if (!episodeNumber || !title || !videoUrl) {
      return res.status(400).json({ message: 'Episode number, title, and video URL are required' });
    }

    const anime = await Anime.findById(req.params.id);
    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }

    // Check if episode already exists
    const episodeExists = anime.episodes.some(ep => ep.episodeNumber === episodeNumber);
    if (episodeExists) {
      return res.status(400).json({ message: 'Episode already exists' });
    }

    // Add episode
    anime.episodes.push({
      episodeNumber,
      title,
      description,
      videoUrl,
      duration,
      thumbnail,
    });

    // Update total episodes
    anime.totalEpisodes = anime.episodes.length;

    await anime.save();

    res.status(201).json({
      success: true,
      message: 'Episode added successfully',
      data: anime,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update episode (Admin only)
 * PUT /api/anime/:id/episodes/:episodeNumber
 */
exports.updateEpisode = async (req, res) => {
  try {
    const { episodeNumber } = req.params;
    const { title, description, videoUrl, duration, thumbnail } = req.body;

    const anime = await Anime.findById(req.params.id);
    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }

    const episode = anime.episodes.find(ep => ep.episodeNumber === parseInt(episodeNumber));
    if (!episode) {
      return res.status(404).json({ message: 'Episode not found' });
    }

    // Update episode fields
    if (title) episode.title = title;
    if (description) episode.description = description;
    if (videoUrl) episode.videoUrl = videoUrl;
    if (duration) episode.duration = duration;
    if (thumbnail) episode.thumbnail = thumbnail;

    await anime.save();

    res.status(200).json({
      success: true,
      message: 'Episode updated successfully',
      data: anime,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete episode (Admin only)
 * DELETE /api/anime/:id/episodes/:episodeNumber
 */
exports.deleteEpisode = async (req, res) => {
  try {
    const { episodeNumber } = req.params;

    const anime = await Anime.findById(req.params.id);
    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }

    anime.episodes = anime.episodes.filter(ep => ep.episodeNumber !== parseInt(episodeNumber));
    anime.totalEpisodes = anime.episodes.length;

    await anime.save();

    res.status(200).json({
      success: true,
      message: 'Episode deleted successfully',
      data: anime,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
