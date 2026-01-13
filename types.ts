export type MediaType = 'movie' | 'series' | 'game';

export interface MediaItem {
  id: string;
  title: string;
  year: number;
  type: MediaType;
  poster: string;
  genre: string[];
  description: string;
  rating?: number; // External rating (IMDb/Metacritic) 0-10
  runtime?: string; // e.g. "120 min" or "60h"
}

export interface CollectionItem extends MediaItem {
  userRating: number; // 0-5 (0 means unrated)
  dateAdded: number;
  status: 'watched' | 'playing' | 'backlog' | 'dropped';
  tags: string[];
  priority: boolean;
}

export type SwipeDirection = 'left' | 'right' | 'up' | 'down';

export interface UserStats {
  totalMovies: number;
  totalSeries: number;
  totalGames: number;
  totalHoursWatched: number;
  totalHoursPlayed: number;
  genreDistribution: { name: string; value: number }[];
}
