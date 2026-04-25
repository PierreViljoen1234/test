/**
 * User Controller
 * Handles user favorites and watch history
 */

const User = require('../models/User');
const Anime = require('../models/Anime');

/**
 * Add anime to favorites
 * POST /api/user/favorites/:animeId
 */
exports.addFavorite = async (req, res) => {
  try {
    const { animeId } = req.params;

    // Check if anime exists
    const anime = await Anime.findById(animeId);
    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already in favorites
    if (user.favorites.includes(animeId)) {
      return res.status(400).json({ message: 'Anime already in favorites' });
    }

    // Add to favorites
    user.favorites.push(animeId);
    anime.favoriteCount += 1;

    await user.save();
    await anime.save();

    res.status(200).json({
      success: true,
      message: 'Added to favorites',
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Remove anime from favorites
 * DELETE /api/user/favorites/:animeId
 */
exports.removeFavorite = async (req, res) => {
  try {
    const { animeId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if in favorites
    if (!user.favorites.includes(animeId)) {
      return res.status(400).json({ message: 'Anime not in favorites' });
    }

    // Remove from favorites
    user.favorites = user.favorites.filter(id => id.toString() !== animeId);

    // Update anime favorite count
    const anime = await Anime.findById(animeId);
    if (anime) {
      anime.favoriteCount = Math.max(0, anime.favoriteCount - 1);
      await anime.save();
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Removed from favorites',
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get user favorites
 * GET /api/user/favorites
 */
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user.favorites,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Add to watch history
 * POST /api/user/watch-history/:animeId/:episodeNumber
 */
exports.addToWatchHistory = async (req, res) => {
  try {
    const { animeId, episodeNumber } = req.params;
    const { progress = 0 } = req.body;

    // Check if anime exists
    const anime = await Anime.findById(animeId);
    if (!anime) {
      return res.status(404).json({ message: 'Anime not found' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if episode exists
    const episode = anime.episodes.find(ep => ep.episodeNumber === parseInt(episodeNumber));
    if (!episode) {
      return res.status(404).json({ message: 'Episode not found' });
    }

    // Find and update or create watch history entry
    const historyIndex = user.watchHistory.findIndex(
      item => item.anime.toString() === animeId && item.episodeNumber === parseInt(episodeNumber)
    );

    if (historyIndex > -1) {
      user.watchHistory[historyIndex].progress = progress;
      user.watchHistory[historyIndex].watchedAt = Date.now();
    } else {
      user.watchHistory.push({
        anime: animeId,
        episodeNumber: parseInt(episodeNumber),
        progress,
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Watch history updated',
      watchHistory: user.watchHistory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get watch history
 * GET /api/user/watch-history
 */
exports.getWatchHistory = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const user = await User.findById(req.user.id)
      .populate('watchHistory.anime')
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Sort by most recent and limit
    const watchHistory = user.watchHistory
      .sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt))
      .slice(0, parseInt(limit));

    res.status(200).json({
      success: true,
      data: watchHistory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Clear watch history
 * DELETE /api/user/watch-history
 */
exports.clearWatchHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.watchHistory = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Watch history cleared',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
