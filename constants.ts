import { MediaItem } from './types';

export const GENRES = [
  'Action', 'Sci-Fi', 'RPG', 'Drama', 'Comedy', 'Horror', 'Thriller', 'Indie', 'Adventure'
];

export const TAGS = [
  'Mind-blowing', 'Cozy', 'Nostalgia', 'Masterpiece', 'Disappointing', 'Grind', 'Binge-worthy'
];

export const MOCK_DATA: MediaItem[] = [
  {
    id: '1',
    title: 'Cyberpunk: Edgerunners',
    year: 2022,
    type: 'series',
    poster: 'https://picsum.photos/600/900?random=1',
    genre: ['Sci-Fi', 'Action', 'Anime'],
    description: 'A street kid tries to survive in a technology and body modification-obsessed city of the future.',
    rating: 8.3,
    runtime: '24m avg'
  },
  {
    id: '2',
    title: 'Elden Ring',
    year: 2022,
    type: 'game',
    poster: 'https://picsum.photos/600/900?random=2',
    genre: ['RPG', 'Action', 'Fantasy'],
    description: 'Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord.',
    rating: 9.6,
    runtime: '100h+'
  },
  {
    id: '3',
    title: 'Dune: Part Two',
    year: 2024,
    type: 'movie',
    poster: 'https://picsum.photos/600/900?random=3',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    description: 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.',
    rating: 8.8,
    runtime: '166 min'
  },
  {
    id: '4',
    title: 'Hades II',
    year: 2024,
    type: 'game',
    poster: 'https://picsum.photos/600/900?random=4',
    genre: ['Indie', 'Action', 'Roguelike'],
    description: 'Battle beyond the Underworld using dark sorcery to take on the Titan of Time in this bewitching sequel.',
    rating: 9.1,
    runtime: '∞'
  },
  {
    id: '5',
    title: 'Severance',
    year: 2022,
    type: 'series',
    poster: 'https://picsum.photos/600/900?random=5',
    genre: ['Sci-Fi', 'Thriller', 'Drama'],
    description: 'Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives.',
    rating: 8.7,
    runtime: '50m avg'
  },
  {
    id: '6',
    title: 'The Bear',
    year: 2022,
    type: 'series',
    poster: 'https://picsum.photos/600/900?random=6',
    genre: ['Drama', 'Comedy'],
    description: 'A young chef from the fine dining world returns to Chicago to run his family sandwich shop.',
    rating: 8.6,
    runtime: '30m avg'
  },
  {
    id: '7',
    title: 'Baldur\'s Gate 3',
    year: 2023,
    type: 'game',
    poster: 'https://picsum.photos/600/900?random=7',
    genre: ['RPG', 'Strategy', 'Fantasy'],
    description: 'Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival.',
    rating: 9.7,
    runtime: '150h+'
  },
  {
    id: '8',
    title: 'Everything Everywhere All At Once',
    year: 2022,
    type: 'movie',
    poster: 'https://picsum.photos/600/900?random=8',
    genre: ['Sci-Fi', 'Comedy', 'Action'],
    description: 'A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save the existence.',
    rating: 7.9,
    runtime: '139 min'
  }
];
