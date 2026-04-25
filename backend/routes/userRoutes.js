/**
 * User Routes
 * Defines routes for user preferences, favorites, and watch history
 */

const express = require('express');
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Favorites routes
router.post('/favorites/:animeId', userController.addFavorite);
router.delete('/favorites/:animeId', userController.removeFavorite);
router.get('/favorites', userController.getFavorites);

// Watch history routes
router.post('/watch-history/:animeId/:episodeNumber', userController.addToWatchHistory);
router.get('/watch-history', userController.getWatchHistory);
router.delete('/watch-history', userController.clearWatchHistory);

module.exports = router;
