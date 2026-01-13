# 📱 SwipeTrack – Personal Entertainment Journal

SwipeTrack is a high-energy, "dating-app-style" entertainment tracker designed to help you organize your movies, series, and games with a single swipe. Built with a premium **Notion-style** aesthetic, it combines addictive interactivity with deep analytics.

## ✨ Features

- **The Deck**: Swipe right to log as "Watched", left to "Skip", up to "Prioritize", and down for "Backlog".
- **Cinematic Journal**: A beautiful workspace for your tracked media, featuring powerful filters and a "Surprise Me" decision-maker.
- **Deep Analytics**: Visualize your entertainment habits with time-logged summaries, quality averages, and a detailed "Medium Split" donut chart.
- **Global Search**: Instantly find any movie, show, or game using integrated OMDb and RAWG data.
- **Cinematic Details**: Full-bleed posters, synopsis, cast lists, and direct "Watch Here" links to external streamers.
- **Cloud Sync**: Real-time persistence using **RestDB.io** and local offline-first fallback.

## 🛠️ Tech Stack

- **Frontend**: React 19, Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **Backend**: RestDB.io (NoSQL Cloud Database)
- **External APIs**: 
  - [OMDb API](http://www.omdbapi.com/) (Movies & Series)
  - [RAWG API](https://rawg.io/apidocs) (Games)

## 🚀 Setup & Backend Configuration

### 1. Database Setup (RestDB.io)
SwipeTrack is pre-configured to sync with a RestDB.io collection. To ensure your data saves correctly:
1. Log in to [restdb.io](https://restdb.io/).
2. Create a database (The current build uses `swipetrack-06c8`).
3. Create a collection named **`user-entries`**.
4. In **Settings > API**, ensure the API key `bccf628e3205e55b31c8167698c67d4ae12f5` has `POST` and `GET` permissions.
5. Enable **CORS** for your database in the RestDB security settings.

### 2. Project Properties
The application expects the following data structure in the `user-entries` collection:
- `username` (String)
- `itemId` (String)
- `data` (JSON/Object containing the MediaItem details)
- `syncedAt` (DateTime)

## 🎨 Design Philosophy
The UI follows a **Glassmorphism** and **Dark Mode** aesthetic, prioritizing legibility and tactile feedback. Every interaction is designed to feel "snappy" through the use of spring physics and micro-interactions.

---
*Created with passion by your world-class senior frontend engineer. Hasta la vista!*