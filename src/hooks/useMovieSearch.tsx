// Custom hook for movie search functionality
// Based on data-model.md SearchState specification

import { useRef, useState } from 'react';
import type { DetailViewState, MovieDetail, SearchResult } from '../types/movie';
import { searchMovie as searchMovieAPI, searchMovieByID } from '../utils/api';

const INITIAL_DETAIL_STATE: DetailViewState = {
  status: 'idle',
  movie: null,
  errorMessage: null,
  selectedSuggestion: null,
};

const GENERIC_ERROR = 'Search hiccup—retry soon';

const toSuggestion = (movie: MovieDetail): SearchResult => ({
  Title: movie.Title,
  Year: movie.Year,
  imdbID: movie.imdbID,
  Type: movie.Type,
  Poster: movie.Poster,
});

/**
 * Custom hook for managing movie search detail state machine
 */
export function useMovieSearch() {
  const [detailState, setDetailState] = useState<DetailViewState>(INITIAL_DETAIL_STATE);
  const requestIdRef = useRef(0);

  const beginRequest = (selectedSuggestion: SearchResult | null = null) => {
    requestIdRef.current += 1;
    const token = requestIdRef.current;
    setDetailState({
      status: 'loading',
      movie: null,
      errorMessage: null,
      selectedSuggestion,
    });
    return token;
  };

  const completeSuccess = (
    token: number,
    movie: MovieDetail,
    selectedSuggestion?: SearchResult | null,
  ) => {
    if (token !== requestIdRef.current) {
      return;
    }

    setDetailState({
      status: 'ready',
      movie,
      errorMessage: null,
      selectedSuggestion: selectedSuggestion ?? toSuggestion(movie),
    });
  };

  const completeError = (
    token: number,
    message: string,
    selectedSuggestion: SearchResult | null = null,
  ) => {
    if (token !== requestIdRef.current) {
      return;
    }

    setDetailState({
      status: 'error',
      movie: null,
      errorMessage: message,
      selectedSuggestion,
    });
  };

  /**
   * Search for a movie by title
   * @param query - Movie title to search for
   */
  const searchMovie = async (query: string): Promise<void> => {
    const requestToken = beginRequest();

    try {
      const data = await searchMovieAPI(query);
      completeSuccess(requestToken, data);
    } catch (err) {
      const message = err instanceof Error ? err.message : GENERIC_ERROR;
      completeError(requestToken, message);
    }
  };

  /**
   * Fetch movie details by IMDb ID
   * @param imdbID - IMDb ID (e.g., "tt1375666")
   */
  const searchMovieDetail = async (
    imdbID: string,
    selectedSuggestion: SearchResult | null = null,
  ): Promise<void> => {
    const requestToken = beginRequest(selectedSuggestion);

    try {
      const data = await searchMovieByID(imdbID);
      completeSuccess(requestToken, data, selectedSuggestion);
    } catch (err) {
      const message = err instanceof Error ? err.message : GENERIC_ERROR;
      completeError(requestToken, message, selectedSuggestion);
    }
  };

  const clearDetail = () => {
    requestIdRef.current += 1;
    setDetailState(INITIAL_DETAIL_STATE);
  };

  return {
    detailState,
    loading: detailState.status === 'loading',
    movieData: detailState.movie,
    error: detailState.errorMessage,
    searchMovie,
    searchMovieDetail,
    clearDetail,
  };
}
