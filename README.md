# 🎌 AnimePlay - Full-Stack Anime Streaming Platform

A comprehensive anime streaming application inspired by Crunchyroll, built with React, Node.js, Express, and MongoDB.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Future Enhancements](#future-enhancements)

## ✨ Features

### 🏠 Homepage
- Dark-themed modern UI with anime streaming aesthetic
- Featured banner section with latest/highlighted anime
- Horizontal scrollable anime rows:
  - Trending anime
  - Popular anime
  - Recently updated
- Responsive design for mobile and desktop

### 📺 Anime Detail Page
- Cover image and banner
- Title, description, genres, and rating
- Episode list with clickable episodes
- Add/remove from favorites functionality
- Full episode information display

### 🎬 Video Player
- HTML5 video player with full controls
- Episode navigation (next/previous)
- Side episode list with quick access
- Autoplay next episode option
- Watch progress tracking
- Episode title and description

### 👤 User Features
- User registration and login with JWT authentication
- User profile management
- Add/remove favorites
- Watch history tracking
- Personal recommendations based on favorites

### 🔍 Search & Discovery
- Global search functionality (search by title/description)
- Filter by genre
- Trending anime section
- Rating-based sorting
- Pagination support

### 📊 Admin Features
- Add new anime entries
- Add episodes to anime
- Update anime information
- Delete anime
- Manual content management dashboard (ready to implement)

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library with functional components and hooks
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

### External APIs
- **Jikan API** - Anime data fetching and syncing

## 📁 Project Structure

```
anime-streaming-platform/
├── backend/
│   ├── middleware/
│   │   ├── auth.js              # JWT & admin authorization
│   │   └── errorHandler.js      # Centralized error handling
│   ├── models/
│   │   ├── Anime.js             # Anime schema with episodes
│   │   └── User.js              # User authentication model
│   ├── controllers/
│   │   ├── authController.js    # Register, login, profile
│   │   ├── animeController.js   # CRUD operations for anime
│   │   └── userController.js    # Favorites & watch history
│   ├── routes/
│   │   ├── authRoutes.js        # Authentication endpoints
│   │   ├── animeRoutes.js       # Anime endpoints
│   │   └── userRoutes.js        # User endpoints
│   ├── services/
│   │   └── jikanService.js      # Jikan API integration
│   ├── scripts/
│   │   └── seedDatabase.js      # Database seeding script
│   ├── server.js                # Main server file
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnimeCard.js     # Anime card component
│   │   │   └── Navbar.js        # Navigation bar
│   │   ├── context/
│   │   │   └── AuthContext.js   # Global auth state
│   │   ├── pages/
│   │   │   ├── HomePage.js      # Homepage
│   │   │   ├── AnimeDetailPage.js
│   │   │   ├── VideoPlayerPage.js
│   │   │   ├── LoginPage.js
│   │   │   └── RegisterPage.js
│   │   ├── services/
│   │   │   └── api.js           # API service & axios config
│   │   ├── styles/
│   │   │   └── globals.css      # Global styles
│   │   ├── App.js               # Main app component
│   │   └── index.js             # Entry point
│   ├── public/
│   │   └── index.html           # HTML template
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env.example
│
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js v14+ and npm
- MongoDB (local or Atlas)
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** in `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/anime-streaming
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   PORT=5000
   NODE_ENV=development
   ```

5. **Start MongoDB**
   ```bash
   mongod
   ```

6. **Seed the database (optional)**
   ```bash
   npm run seed-database
   ```

7. **Start the backend server**
   ```bash
   npm start      # Production mode
   npm run dev    # Development mode with nodemon
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** in `.env`:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

   Frontend will open at `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string",
  "confirmPassword": "string"
}

Response: { token, user }
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}

Response: { token, user }
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>

Response: { user }
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "string",
  "profileImage": "string"
}

Response: { user }
```

### Anime Endpoints

#### Get All Anime
```http
GET /api/anime?page=1&limit=10&genre=Action&sort=rating
Response: { pagination, data }
```

#### Get Trending
```http
GET /api/anime/trending?limit=10
Response: { data }
```

#### Get Single Anime
```http
GET /api/anime/:id
Response: { data }
```

#### Search Anime
```http
GET /api/anime/search?q=naruto
Response: { data }
```

#### Get All Genres
```http
GET /api/anime/genres/list
Response: { data }
```

#### Get Anime by Genre
```http
GET /api/anime/genre/:genre?limit=10
Response: { data }
```

#### Create Anime (Admin Only)
```http
POST /api/anime
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "string",
  "description": "string",
  "imageUrl": "string",
  "genres": ["string"],
  "rating": "number",
  "status": "ongoing|completed|upcoming"
}

Response: { data }
```

#### Add Episode (Admin Only)
```http
POST /api/anime/:id/episodes
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "episodeNumber": "number",
  "title": "string",
  "videoUrl": "string",
  "duration": "number"
}

Response: { data }
```

### User Endpoints

#### Add to Favorites
```http
POST /api/user/favorites/:animeId
Authorization: Bearer <token>
Response: { favorites }
```

#### Remove from Favorites
```http
DELETE /api/user/favorites/:animeId
Authorization: Bearer <token>
Response: { favorites }
```

#### Get Favorites
```http
GET /api/user/favorites
Authorization: Bearer <token>
Response: { data }
```

#### Add to Watch History
```http
POST /api/user/watch-history/:animeId/:episodeNumber
Authorization: Bearer <token>
Content-Type: application/json

{
  "progress": "number"
}

Response: { watchHistory }
```

#### Get Watch History
```http
GET /api/user/watch-history
Authorization: Bearer <token>
Response: { data }
```

## 🔐 Environment Variables

### Backend (.env)
```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/anime-streaming

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Server
PORT=5000
NODE_ENV=development

# Jikan API
JIKAN_API_URL=https://api.jikan.moe/v4
```

### Frontend (.env)
```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
```

## 🎨 UI/UX Features

- **Dark Theme**: Black (#1a1a1a) and gray (#2d2d2d) backgrounds
- **Accent Color**: Orange (#ff6b35) for interactive elements
- **Smooth Animations**: Hover effects, fade-in, and slide-in animations
- **Responsive Design**: Mobile-first approach, works on all screen sizes
- **Custom Scrollbar**: Styled scrollbar with accent color
- **Loading States**: Spinner animations and loading states

## 🔄 Database Seeding

To populate the database with anime from Jikan API:

```bash
cd backend
npm run seed-database
```

This will fetch and add popular, trending, and top-rated anime to your MongoDB database.

## 📱 Features to Implement

- [ ] Favorites page with user's favorite anime
- [ ] Watch history page with resume watching
- [ ] User profile page with edit functionality
- [ ] Admin dashboard for content management
- [ ] Advanced filtering (multiple genres, year, studio)
- [ ] Rating and review system
- [ ] Comment section on episodes
- [ ] Social sharing features
- [ ] Notifications for new episodes
- [ ] Recommendation engine
- [ ] Dark/Light theme toggle
- [ ] Multiple language support

## 🚀 Deployment

### Backend (Heroku/Render)
1. Push code to GitHub
2. Connect to Heroku/Render
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy to Vercel/Netlify
3. Set `REACT_APP_API_URL` environment variable

## 📝 Code Quality

- Clean, well-organized code structure
- Comprehensive comments and documentation
- Error handling and validation
- Security best practices (password hashing, JWT)
- Separation of concerns (controllers, routes, middleware)
- Reusable components in React

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 📞 Support

For questions or issues, please create a GitHub issue or contact the development team.

---

**Happy Anime Watching! 🎌✨**
