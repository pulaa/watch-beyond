# Watch Beyond - Streaming Availability Across Countries

![Watch Beyond Banner](https://watch-beyond.vercel.app/og-image.jpg)

## 🌍 [Watch Beyond Live App](https://watch-beyond.vercel.app/)

## About

Watch Beyond is a tool to help you find where movies and TV shows are available across different countries and streaming services. It was built for personal use but shared for other VPN users who might find it useful.

## Features

- 🔎 **Search** for movies and TV shows across global streaming platforms
- 🌐 **Filter content** by country/region to see what's available where
- 📺 **Compare availability** across multiple streaming services:
  - Netflix, Disney+, Hulu, Amazon Prime Video, HBO Max, Paramount+, Apple TV+
  - And many more: BINGE, Stan, YouTube Premium, Crunchyroll, iQIYI, SkyShowtime
- 🎭 **Browse content** by genre, popularity, rating and release date
- 🔄 **Switch between** movies and TV shows easily
- 🌍 **See which VPN locations** you need to access specific content

## Technologies Used

- **Frontend**: Next.js 15, React 19, Tailwind CSS, HeroUI components
- **Data**: TMDB API for movie/TV data, JustWatch for streaming availability
- **State Management**: Zustand
- **Deployment**: Vercel

## How It Works

1. Search for a movie or TV show
2. View which countries it's available in 
3. See which streaming services offer the content in each country
4. Connect to the appropriate VPN location to watch the content

## Development

### Prerequisites

- Node.js (Latest LTS version)
- Yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/watch-beyond.git
cd watch-beyond

# Install dependencies
yarn install

# Start the development server
yarn dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

```bash
yarn build
yarn start
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Movie and TV show data from [The Movie Database (TMDB)](https://www.themoviedb.org/)
- Streaming availability data from [JustWatch](https://www.justwatch.com/)

---

Built with ❤️ for VPN users and global content seekers
  
