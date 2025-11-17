// Custom hook for movie search functionality
// Based on data-model.md SearchState specification

import { useRef, useState } from 'react';
import type {
  DetailTabId,
  DetailTabSection,
  DetailViewState,
  HeroSummary,
  MovieDetail,
  PosterPanelState,
  SearchResult,
} from '../types/movie';
import { searchMovie as searchMovieAPI, searchMovieByID } from '../utils/api';
import {
  buildCastPreview,
  buildHighlightBullets,
  fallbackText,
  splitList,
} from '../utils/metadata';
import { buildPosterMediaAsset } from '../utils/poster';

const DEFAULT_TAB_ID: DetailTabId = 'overview';
const HERO_PLOT_LIMIT = 360;
const DEFAULT_BACKDROP_COLOR = '#0b1120';
const DEFAULT_SCROLL_BOUNDS = 0;
const NA_VALUE = 'N/A';

const INITIAL_DETAIL_STATE: DetailViewState = {
  status: 'idle',
  movie: null,
  heroSummary: null,
  tabs: [],
  posterPanel: null,
  errorMessage: null,
  selectedSuggestion: null,
  activeTabId: DEFAULT_TAB_ID,
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
      heroSummary: null,
      tabs: [],
      posterPanel: null,
      errorMessage: null,
      selectedSuggestion,
      activeTabId: DEFAULT_TAB_ID,
    });
    return token;
  };

  const completeSuccess = (
    token: number,
    payload: DetailSuccessPayload,
    selectedSuggestion?: SearchResult | null,
  ) => {
    if (token !== requestIdRef.current) {
      return;
    }

    setDetailState({
      status: 'ready',
      movie: payload.movie,
      heroSummary: payload.heroSummary,
      tabs: payload.tabs,
      posterPanel: payload.posterPanel,
      errorMessage: null,
      selectedSuggestion: selectedSuggestion ?? toSuggestion(payload.movie),
      activeTabId: DEFAULT_TAB_ID,
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
      heroSummary: null,
      tabs: [],
      posterPanel: null,
      errorMessage: message,
      selectedSuggestion,
      activeTabId: DEFAULT_TAB_ID,
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
      const payload = await assembleDetailPayload(data);
      completeSuccess(requestToken, payload);
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
      const payload = await assembleDetailPayload(data);
      completeSuccess(requestToken, payload, selectedSuggestion);
    } catch (err) {
      const message = err instanceof Error ? err.message : GENERIC_ERROR;
      completeError(requestToken, message, selectedSuggestion);
    }
  };

  const clearDetail = () => {
    requestIdRef.current += 1;
    setDetailState(INITIAL_DETAIL_STATE);
  };

  const setActiveTab = (tabId: DetailTabId) => {
    setDetailState((previous) => {
      if (previous.activeTabId === tabId) {
        return previous;
      }

      if (!previous.tabs.some((tab) => tab.id === tabId)) {
        return previous;
      }

      return {
        ...previous,
        activeTabId: tabId,
      };
    });
  };

  return {
    detailState,
    loading: detailState.status === 'loading',
    movieData: detailState.movie,
    error: detailState.errorMessage,
    heroSummary: detailState.heroSummary,
    tabs: detailState.tabs,
    activeTabId: detailState.activeTabId,
    posterPanel: detailState.posterPanel,
    searchMovie,
    searchMovieDetail,
    clearDetail,
    setActiveTab,
  };
}

interface DetailSuccessPayload {
  movie: MovieDetail;
  heroSummary: HeroSummary;
  tabs: DetailTabSection[];
  posterPanel: PosterPanelState;
}

async function assembleDetailPayload(movie: MovieDetail): Promise<DetailSuccessPayload> {
  const posterPanel = await buildPosterPanel(movie);
  const heroSummary = buildHeroSummary(movie, posterPanel.mediaAsset.dominantColor);
  const tabs = buildDetailTabs(movie);

  return {
    movie,
    heroSummary,
    tabs,
    posterPanel,
  };
}

async function buildPosterPanel(movie: MovieDetail): Promise<PosterPanelState> {
  const mediaAsset = await buildPosterMediaAsset(movie.imdbID, movie.Poster);
  return {
    mediaAsset,
    isSticky: true,
    scrollBounds: DEFAULT_SCROLL_BOUNDS,
  };
}

function buildHeroSummary(movie: MovieDetail, fallbackColor?: string): HeroSummary {
  const genres = splitList(movie.Genre);
  return {
    title: movie.Title,
    releaseYear: extractReleaseYear(movie.Year),
    runtime: fallbackText(movie.Runtime),
    genres: genres.length ? genres : undefined,
    plotSnippet: clampPlot(movie.Plot),
    primaryRating: formatPrimaryRating(movie.imdbRating),
    backdropUrl: sanitizeValue(movie.Poster),
    backdropFallbackColor: fallbackColor ?? DEFAULT_BACKDROP_COLOR,
  };
}

function buildDetailTabs(movie: MovieDetail): DetailTabSection[] {
  const overview: DetailTabSection = {
    id: 'overview',
    label: 'Overview',
    content: {
      expandedPlot: sanitizeValue(movie.Plot) ?? FALLBACK_PLOT_TEXT,
      highlightBullets: buildHighlightBullets(movie),
    },
    priority: 0,
  };

  const info: DetailTabSection = {
    id: 'info',
    label: 'Info',
    content: {
      releaseDate: fallbackText(movie.Released),
      runtime: fallbackText(movie.Runtime),
      castPreview: buildCastPreview(movie.Actors),
      languages: splitList(movie.Language),
      awards: fallbackText(movie.Awards),
    },
    priority: 1,
  };

  const ratings: DetailTabSection = {
    id: 'ratings',
    label: 'Ratings',
    content: buildRatingsContent(movie),
    priority: 2,
  };

  return [overview, info, ratings].sort((a, b) => a.priority - b.priority);
}

function buildRatingsContent(movie: MovieDetail) {
  return {
    imdbRating: formatImdbRating(movie.imdbRating),
    metacritic: pickRatingValue(movie, 'metacritic') ?? formatMetascore(movie.Metascore),
    rottenTomatoes: pickRatingValue(movie, 'rotten tomatoes'),
    userScore: formatUserScore(movie.imdbVotes),
    lastUpdated: sanitizeValue(movie.Released) ?? undefined,
  };
}

function pickRatingValue(movie: MovieDetail, source: string): string | undefined {
  if (!movie.Ratings) {
    return undefined;
  }
  const match = movie.Ratings.find((rating) => rating.Source.toLowerCase().includes(source));
  return sanitizeValue(match?.Value);
}

function formatImdbRating(raw?: string): string | undefined {
  const value = sanitizeValue(raw);
  return value ? `${value}/10` : undefined;
}

function formatMetascore(raw?: string): string | undefined {
  const value = sanitizeValue(raw);
  return value ? `${value}/100` : undefined;
}

function formatPrimaryRating(raw?: string): string | undefined {
  const value = sanitizeValue(raw);
  return value ? `IMDb ${value}` : undefined;
}

function formatUserScore(raw?: string): string | undefined {
  const value = sanitizeValue(raw);
  return value ? `${value} votes` : undefined;
}

function extractReleaseYear(raw?: string): string {
  const value = sanitizeValue(raw);
  if (!value) {
    return 'Unknown';
  }
  const match = value.match(/\d{4}/);
  return match ? match[0] : value;
}

function clampPlot(plot?: string): string {
  const value = sanitizeValue(plot) ?? FALLBACK_PLOT_TEXT;
  if (value.length <= HERO_PLOT_LIMIT) {
    return value;
  }
  const truncated = value.slice(0, HERO_PLOT_LIMIT);
  const lastSpace = truncated.lastIndexOf(' ');
  return `${truncated.slice(0, lastSpace > 200 ? lastSpace : HERO_PLOT_LIMIT).trim()}…`;
}

function sanitizeValue(value?: string | null): string | undefined {
  if (!value) {
    return undefined;
  }
  const trimmed = value.trim();
  if (!trimmed || trimmed.toUpperCase() === NA_VALUE) {
    return undefined;
  }
  return trimmed;
}

const FALLBACK_PLOT_TEXT = 'Plot synopsis unavailable.';
