/**
 * Anime Model
 * Stores anime information with episodes
 */

const mongoose = require('mongoose');

const EpisodeSchema = new mongoose.Schema({
  episodeNumber: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  videoUrl: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    default: 0, // in minutes
  },
  releaseDate: {
    type: Date,
    default: Date.now,
  },
  thumbnail: {
    type: String,
    default: '',
  },
}, { timestamps: true });

const AnimeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  bannerUrl: {
    type: String,
    default: '',
  },
  genres: [{
    type: String,
    enum: ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller', 'Other'],
  }],
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0,
  },
  status: {
    type: String,
    enum: ['ongoing', 'completed', 'upcoming'],
    default: 'upcoming',
  },
  episodes: [EpisodeSchema],
  totalEpisodes: {
    type: Number,
    default: 0,
  },
  studio: {
    type: String,
    default: '',
  },
  director: {
    type: String,
    default: '',
  },
  releaseYear: {
    type: Number,
    default: new Date().getFullYear(),
  },
  season: {
    type: String,
    enum: ['Winter', 'Spring', 'Summer', 'Fall'],
    default: 'Fall',
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  favoriteCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// Index for search
AnimeSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Anime', AnimeSchema);
