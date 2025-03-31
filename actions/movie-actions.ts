"use server";

import { MediaFilters } from "@/types";
import exp from "constants";


export interface WatchProviders {
  results: {
    [key: string]: {
      flatrate?: {
        provider_id: number;
        provider_name: string;
        logo_path: string;
      }[];
      rent?: {
        provider_id: number;
        provider_name: string;
        logo_path: string;
      }[];
      buy?: { provider_id: number; provider_name: string; logo_path: string }[];
    };
  };
}

interface MovieDetails {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  runtime?: number;
  number_of_seasons?: number;
  genres: { id: number; name: string }[];
  credits: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
  };
  "watch/providers": WatchProviders;
}

interface MediaResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
}

interface MediaResponse {
  page: number;
  results: MediaResult[];
  total_pages: number;
}

interface Genre {
  id: number;
  name: string;
}

interface GenresResponse {
  genres: Genre[];
}

// Add this new interface for external ratings
interface ExternalRatings {
  id: number;
  imdb_id?: string;
  imdb_rating?: number;
  rotten_tomatoes_rating?: number;
}

export async function getGenres(mediaType: string): Promise<Genre[]> {
  const TMDB_TOKEN = process.env.TMDB_API_TOKEN;

  if (!TMDB_TOKEN) {
    throw new Error("API token not configured");
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/genre/${mediaType}/list?language=en`,
    {
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 604800 }, // Cache for 1 week (7 days)
    }
  );

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }

  const data: GenresResponse = await response.json();
  return data.genres;
}

// Modify the discoverMedia function to include a sort parameter
export async function discoverMedia(
  filters: MediaFilters
): Promise<MediaResponse> {
  const TMDB_TOKEN = process.env.TMDB_API_TOKEN;
  if (!TMDB_TOKEN) {
    throw new Error("API token not configured");
  }

  const { mediaType, providers, language, region, page, genres, sortBy } =
    filters;
  let params = new URLSearchParams();

  // Pagination: Set the current page number for results (if provided)
  if (page) params.set("page", page.toString());

  // Sorting: Set sorting order (e.g., popularity.desc, release_date.desc)
  if (sortBy) params.set("sort_by", sortBy);

  // Language: Filter results by the original spoken language (e.g., en, ja)
  if (language) params.set("with_original_language", language);

  // Genres: Filter by one or more genre IDs (comma-separated string or array)
  if (genres) params.set("with_genres", genres);

  // Streaming Region: Required when using providers or monetization filters.
  // This defines **which country's streaming availability** to consider.
  if (region) {
    params.set("watch_region", region);
  }

  // Streaming Providers: Filter by provider IDs (e.g., Netflix = 8).
  // Must be used together with `watch_region`.
  // Replaces commas with pipe (|) for "OR" logic as expected by TMDb.
  if (providers) {
    params.set("with_watch_providers", providers.replace(/,/g, "|"));
  }

  // Monetization Types: If no providers are set but region is provided,
  // include all possible types (flatrate, free, ads, rent, buy)
  // so `watch_region` works correctly.
  // TMDb requires this in order to apply `watch_region`.
  if (!providers && region) {
    params.set("with_watch_monetization_types", "flatrate|free|ads|rent|buy");
  }

  let url = `https://api.themoviedb.org/3/discover/${mediaType}?${params.toString()}`;

  console.log("Fetching URL:", url);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 86400 }, // Cache for 1 day
  });

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }

  return response.json();
}

export async function searchMedia(
  query: string,
  mediaType: string,
  page: number
): Promise<MediaResponse> {
  if (!query.trim()) {
    return { page: 1, results: [], total_pages: 0 };
  }

  const TMDB_TOKEN = process.env.TMDB_API_TOKEN;

  if (!TMDB_TOKEN) {
    throw new Error("API token not configured");
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/search/${mediaType}?` +
      `query=${encodeURIComponent(query)}&page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 86400 }, // Cache for 1 day
    }
  );

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }

  return response.json();
}

export async function getMediaDetails(
  mediaType: "movie" | "tv",
  mediaId: number
): Promise<MovieDetails> {
  const TMDB_TOKEN = process.env.TMDB_API_TOKEN;

  if (!TMDB_TOKEN) {
    throw new Error("API token not configured");
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/${mediaType}/${mediaId}?append_to_response=watch/providers`,
    {
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 86400 }, // Cache for 1 day
    }
  );

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }

  return response.json();
}

// Add this new function to fetch external ratings
export async function getExternalRatings(
  mediaType: string,
  mediaId: number
): Promise<ExternalRatings> {
  const TMDB_TOKEN = process.env.TMDB_API_TOKEN;

  if (!TMDB_TOKEN) {
    throw new Error("API token not configured");
  }

  // First, get the external IDs (including IMDb ID)
  const externalIdsResponse = await fetch(
    `https://api.themoviedb.org/3/${mediaType}/${mediaId}/external_ids`,
    {
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 86400 }, // Cache for 24 hours
    }
  );

  if (!externalIdsResponse.ok) {
    throw new Error(`TMDB API error: ${externalIdsResponse.status}`);
  }

  const externalIds = await externalIdsResponse.json();

  // Now get the ratings from the "movie/tv provider" endpoint
  const ratingsResponse = await fetch(
    `https://api.themoviedb.org/3/${mediaType}/${mediaId}/reviews`,
    {
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 86400 }, // Cache for 24 hours
    }
  );

  if (!ratingsResponse.ok) {
    return { id: mediaId, imdb_id: externalIds.imdb_id };
  }

  const ratingsData = await ratingsResponse.json();

  // Parse the reviews to look for IMDb or Rotten Tomatoes mentions
  // This is a simplified approach - in a real app, you might want to use a more robust method
  let imdbRating: number | undefined;
  let rottenTomatoesRating: number | undefined;

  // For demonstration purposes, we'll use the vote_average from TMDB as a proxy
  // In a real application, you would need to implement a more sophisticated approach
  // to get actual IMDb and Rotten Tomatoes ratings

  return {
    id: mediaId,
    imdb_id: externalIds.imdb_id,
    imdb_rating: undefined, // We don't have actual IMDb ratings
    rotten_tomatoes_rating: undefined, // We don't have actual Rotten Tomatoes ratings
  };
}

