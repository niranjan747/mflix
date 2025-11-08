// OMDb API client with error handling and timeout
// Based on contracts/omdb-api.md specification

import type { Movie, BroadSearchResponse } from '../types/movie';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = 'http://www.omdbapi.com/';
const TIMEOUT_MS = 10000; // 10 seconds per spec

/**
 * Search for a movie by title using OMDb API
 * @param query - Movie title to search for (will be trimmed)
 * @returns Movie data if found
 * @throws Error with user-friendly message on failure
 */
export async function searchMovie(query: string): Promise<Movie> {
  const trimmedQuery = query.trim();
  
  if (!trimmedQuery) {
    throw new Error('Please enter a movie title');
  }

  // AbortController for 10-second timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const url = `${BASE_URL}?apikey=${API_KEY}&t=${encodeURIComponent(trimmedQuery)}`;
    
    const response = await fetch(url, { 
      signal: controller.signal 
    });

    if (!response.ok) {
      // Handle HTTP errors (401, 429, etc.)
      console.error(`HTTP error: ${response.status}`);
      throw new Error('Search failed—check connection');
    }

    const data: Movie = await response.json();

    // Check OMDb API response status
    if (data.Response === 'False') {
      // Movie not found or API error
      if (data.Error?.toLowerCase().includes('not found')) {
        throw new Error('Movie not found—try another!');
      }
      if (data.Error?.toLowerCase().includes('invalid api key')) {
        console.error('Invalid OMDb API key');
        throw new Error('Search failed—check connection');
      }
      if (data.Error?.toLowerCase().includes('request limit')) {
        console.error('OMDb API rate limit exceeded');
        throw new Error('Search failed—check connection');
      }
      // Generic API error
      console.error('OMDb API error:', data.Error);
      throw new Error('Search failed—check connection');
    }

    return data;

  } catch (err) {
    // Handle timeout
    if (err instanceof Error && err.name === 'AbortError') {
      console.error('API timeout after 10 seconds');
      throw new Error('Search failed—check connection');
    }
    
    // Handle network failures
    if (err instanceof TypeError) {
      console.error('Network error:', err.message);
      throw new Error('Search failed—check connection');
    }

    // Re-throw known errors
    if (err instanceof Error) {
      throw err;
    }

    // Unknown error
    console.error('Unexpected error:', err);
    throw new Error('Search failed—check connection');

  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetch movie details by IMDb ID using OMDb API
 * @param imdbID - IMDb ID (e.g., "tt1375666")
 * @returns Movie data if found
 * @throws Error with user-friendly message on failure
 */
export async function searchMovieByID(imdbID: string): Promise<Movie> {
  if (!imdbID) {
    throw new Error('Invalid movie ID');
  }

  // AbortController for 10-second timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const url = `${BASE_URL}?apikey=${API_KEY}&i=${encodeURIComponent(imdbID)}`;
    
    const response = await fetch(url, { 
      signal: controller.signal 
    });

    if (!response.ok) {
      console.error(`HTTP error: ${response.status}`);
      throw new Error('Search hiccup—retry soon');
    }

    const data: Movie = await response.json();

    if (data.Response === 'False') {
      console.error('OMDb API error:', data.Error);
      throw new Error('Search hiccup—retry soon');
    }

    return data;

  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      console.error('API timeout after 10 seconds');
      throw new Error('Search hiccup—retry soon');
    }
    
    if (err instanceof TypeError) {
      console.error('Network error:', err.message);
      throw new Error('Search hiccup—retry soon');
    }

    if (err instanceof Error) {
      throw err;
    }

    console.error('Unexpected error:', err);
    throw new Error('Search hiccup—retry soon');

  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Broad search for movies by query using OMDb API (s parameter)
 * Returns up to 10 suggestions for autocomplete
 * @param query - Search query (will be trimmed and URL-encoded)
 * @returns BroadSearchResponse with array of suggestions
 * @throws Error with user-friendly message on failure
 */
export async function searchMovieBroad(query: string): Promise<BroadSearchResponse> {
  const trimmedQuery = query.trim();
  
  if (!trimmedQuery) {
    throw new Error('Please enter a search term');
  }

  // AbortController for 10-second timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(trimmedQuery)}&type=movie`;
    
    const response = await fetch(url, { 
      signal: controller.signal 
    });

    if (!response.ok) {
      // Handle HTTP errors (401, 429, etc.)
      console.error(`HTTP error: ${response.status}`);
      throw new Error('Search hiccup—retry soon');
    }

    const data: BroadSearchResponse = await response.json();

    // Check OMDb API response status
    if (data.Response === 'False') {
      // Handle specific errors
      if (data.Error?.toLowerCase().includes('movie not found')) {
        // No results - return empty search array
        return { Response: 'True', Search: [], totalResults: '0' };
      }
      if (data.Error?.toLowerCase().includes('invalid api key')) {
        console.error('Invalid OMDb API key');
        throw new Error('Search hiccup—retry soon');
      }
      if (data.Error?.toLowerCase().includes('request limit')) {
        console.error('Rate limit exceeded');
        throw new Error('Search hiccup—retry soon');
      }
      if (data.Error?.toLowerCase().includes('too many results')) {
        console.error('Too many results');
        throw new Error('Search hiccup—retry soon');
      }
      // Generic API error
      console.error('OMDb API error:', data.Error);
      throw new Error('Search hiccup—retry soon');
    }

    return data;

  } catch (err) {
    // Handle timeout
    if (err instanceof Error && err.name === 'AbortError') {
      console.error('API timeout after 10 seconds');
      throw new Error('Search hiccup—retry soon');
    }
    
    // Handle network failures
    if (err instanceof TypeError) {
      console.error('Network error:', err.message);
      throw new Error('Search hiccup—retry soon');
    }

    // Re-throw known errors
    if (err instanceof Error) {
      throw err;
    }

    // Unknown error
    console.error('Unexpected error:', err);
    throw new Error('Search hiccup—retry soon');

  } finally {
    clearTimeout(timeoutId);
  }
}
