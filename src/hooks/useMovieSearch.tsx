// Custom hook for movie search functionality
// Based on data-model.md SearchState specification

import { useState } from 'react';
import type { Movie } from '../types/movie';
import { searchMovie as searchMovieAPI, searchMovieByID } from '../utils/api';

/**
 * Custom hook for managing movie search state and operations
 * @returns SearchState object and searchMovie function
 */
export function useMovieSearch() {
  const [loading, setLoading] = useState<boolean>(false);
  const [movieData, setMovieData] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Search for a movie by title
   * @param query - Movie title to search for
   */
  const searchMovie = async (query: string): Promise<void> => {
    // Reset state and start loading
    setLoading(true);
    setError(null);
    setMovieData(null);

    try {
      const data = await searchMovieAPI(query);
      setMovieData(data);
      setError(null);
    } catch (err) {
      setMovieData(null);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Search failed—check connection');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch movie details by IMDb ID
   * @param imdbID - IMDb ID (e.g., "tt1375666")
   */
  const searchMovieDetail = async (imdbID: string): Promise<void> => {
    // Reset state and start loading
    setLoading(true);
    setError(null);
    setMovieData(null);

    try {
      const data = await searchMovieByID(imdbID);
      setMovieData(data);
      setError(null);
    } catch (err) {
      setMovieData(null);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Search hiccup—retry soon');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    movieData,
    error,
    searchMovie,
    searchMovieDetail,
  };
}
