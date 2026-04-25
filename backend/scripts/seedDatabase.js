/**
 * Database Seeding Script
 * Run: npm run seed-database
 * Populates the database with initial anime data from Jikan API
 */

require('dotenv').config();
const mongoose = require('mongoose');
const jikanService = require('../services/jikanService');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seed = async () => {
  try {
    await connectDB();
    await jikanService.populateDatabase();
    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();
