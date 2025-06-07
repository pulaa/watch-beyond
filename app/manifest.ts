import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Watch Beyond - Global Streaming Finder',
    short_name: 'Watch Beyond',
    description: 'Find where to stream movies and TV shows across different countries and services, with integrated VPN recommendations for global access.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#1e293b',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['entertainment', 'streaming', 'movies', 'tv'],
    shortcuts: [
      {
        name: 'Search Movies',
        short_name: 'Movies',
        description: 'Search for movies',
        url: '/movies',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Search TV Shows',
        short_name: 'TV Shows',
        description: 'Search for TV shows',
        url: '/tv-shows',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
    ],
  }
} 