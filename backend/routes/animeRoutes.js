/**
 * Anime Routes
 * Defines routes for anime CRUD operations
 */

const express = require('express');
const animeController = require('../controllers/animeController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', animeController.getAllAnime);
router.get('/search', animeController.searchAnime);
router.get('/trending', animeController.getTrendingAnime);
router.get('/genres/list', animeController.getAllGenres);
router.get('/genre/:genre', animeController.getAnimeByGenre);
router.get('/:id', animeController.getAnimeById);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, animeController.createAnime);
router.put('/:id', authMiddleware, adminMiddleware, animeController.updateAnime);
router.delete('/:id', authMiddleware, adminMiddleware, animeController.deleteAnime);

// Episode routes (admin only)
router.post('/:id/episodes', authMiddleware, adminMiddleware, animeController.addEpisode);
router.put('/:id/episodes/:episodeNumber', authMiddleware, adminMiddleware, animeController.updateEpisode);
router.delete('/:id/episodes/:episodeNumber', authMiddleware, adminMiddleware, animeController.deleteEpisode);

module.exports = router;
