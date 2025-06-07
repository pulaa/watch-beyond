import { Metadata } from 'next'

interface SEOProps {
  title?: string
  description?: string
  canonical?: string
  ogImage?: string
  noIndex?: boolean
  keywords?: string[]
}

export function generateSEO({
  title,
  description,
  canonical,
  ogImage,
  noIndex = false,
  keywords = [],
}: SEOProps = {}): Metadata {
  const baseUrl = 'https://watchbeyond.live'
  const defaultTitle = 'Watch Beyond - Streaming Availability Across Countries'
  const defaultDescription = 'Find where to stream movies and TV shows across different countries and services, with integrated VPN recommendations for global access.'
  
  const finalTitle = title ? `${title} | Watch Beyond` : defaultTitle
  const finalDescription = description || defaultDescription
  const canonicalUrl = canonical ? `${baseUrl}${canonical}` : baseUrl
  const finalOgImage = ogImage || '/og-image.jpg'

  return {
    title: finalTitle,
    description: finalDescription,
    keywords: [
      'streaming',
      'movies',
      'TV shows',
      'VPN',
      'global streaming',
      'Netflix',
      'Disney+',
      'HBO Max',
      'Amazon Prime',
      ...keywords,
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: canonicalUrl,
      siteName: 'Watch Beyond',
      images: [
        {
          url: finalOgImage,
          width: 1200,
          height: 630,
          alt: finalTitle,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDescription,
      images: [finalOgImage],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
  }
}

// Structured data generators
export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Watch Beyond',
    url: 'https://watchbeyond.live',
    description: 'Find where to stream movies and TV shows across different countries and services, with integrated VPN recommendations for global access.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://watchbeyond.live/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    author: {
      '@type': 'Organization',
      name: 'Watch Beyond Team',
    },
  }
}

export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Watch Beyond',
    url: 'https://watchbeyond.live',
    logo: 'https://watchbeyond.live/logo.png',
    description: 'A tool to help you find where movies and TV shows are available across different countries and streaming services.',
    sameAs: [
      'https://github.com/yourusername/watch-beyond',
    ],
  }
}

export function generateMovieStructuredData(movie: {
  name: string
  description: string
  image: string
  datePublished: string
  genre: string[]
  director?: string
  actor?: string[]
  aggregateRating?: {
    ratingValue: number
    bestRating: number
    worstRating: number
    ratingCount: number
  }
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.name,
    description: movie.description,
    image: movie.image,
    datePublished: movie.datePublished,
    genre: movie.genre,
    director: movie.director ? {
      '@type': 'Person',
      name: movie.director,
    } : undefined,
    actor: movie.actor?.map(name => ({
      '@type': 'Person',
      name,
    })),
    aggregateRating: movie.aggregateRating ? {
      '@type': 'AggregateRating',
      ratingValue: movie.aggregateRating.ratingValue,
      bestRating: movie.aggregateRating.bestRating,
      worstRating: movie.aggregateRating.worstRating,
      ratingCount: movie.aggregateRating.ratingCount,
    } : undefined,
  }
}

export function generateTVSeriesStructuredData(series: {
  name: string
  description: string
  image: string
  startDate: string
  endDate?: string
  genre: string[]
  numberOfEpisodes?: number
  numberOfSeasons?: number
  aggregateRating?: {
    ratingValue: number
    bestRating: number
    worstRating: number
    ratingCount: number
  }
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: series.name,
    description: series.description,
    image: series.image,
    startDate: series.startDate,
    endDate: series.endDate,
    genre: series.genre,
    numberOfEpisodes: series.numberOfEpisodes,
    numberOfSeasons: series.numberOfSeasons,
    aggregateRating: series.aggregateRating ? {
      '@type': 'AggregateRating',
      ratingValue: series.aggregateRating.ratingValue,
      bestRating: series.aggregateRating.bestRating,
      worstRating: series.aggregateRating.worstRating,
      ratingCount: series.aggregateRating.ratingCount,
    } : undefined,
  }
} 