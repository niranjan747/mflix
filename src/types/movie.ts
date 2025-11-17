// TypeScript interfaces for Movie Flix landing page
// Based on data-model.md specification

/**
 * Ratings returned inside MovieDetail payloads
 */
export interface RatingBreakdown {
  Source: string;
  Value: string;
}

/**
 * Search suggestion/base summary entity from OMDb broad search
 */
export interface SearchResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

/**
 * Optional snippet metadata for highlighting query matches
 */
export interface SuggestionSnippet {
  prefix: string;
  match: string;
  suffix: string;
}

/**
 * View model used by poster-rich dropdown rows
 */
export interface SuggestionListItem extends SearchResult {
  snippet?: SuggestionSnippet;
}

/**
 * MovieDetail entity containing every OMDb field needed by the feature
 */
export interface MovieDetail extends SearchResult {
  Rated?: string;
  Released?: string;
  Runtime?: string;
  Genre?: string;
  Director?: string;
  Writer?: string;
  Actors?: string;
  Plot: string;
  Language?: string;
  Country?: string;
  Awards?: string;
  Ratings: RatingBreakdown[];
  Metascore?: string;
  imdbRating: string;
  imdbVotes?: string;
  BoxOffice?: string;
  Website?: string;
  Response?: "True" | "False";
  Error?: string;
}

/**
 * Primary Movie type alias retained for backwards compatibility
 */
export type Movie = MovieDetail;

/**
 * Search suggestion type exported for existing consumers (alias of SearchResult)
 */
export type SearchSuggestion = SearchResult;

/**
 * Response from OMDb broad search API (s parameter)
 */
export interface BroadSearchResponse {
  Search?: SearchSuggestion[];
  totalResults?: string;
  Response: "True" | "False";
  Error?: string;
}

/**
 * Metadata grid helpers
 */
export interface MetadataField {
  label: string;
  value: string;
}

export type DetailViewStatus = "idle" | "loading" | "ready" | "error";

export interface DetailViewState {
  status: DetailViewStatus;
  movie: MovieDetail | null;
  errorMessage: string | null;
  selectedSuggestion: SearchResult | null;
}

/**
 * Legacy search state shape retained for reference; slated for removal once DetailViewState fully adopted
 */
export interface SearchState {
  loading: boolean;
  movieData: MovieDetail | null;
  suggestions: SearchSuggestion[];
  error: string | null;
}

/**
 * Theme preference type
 */
export type Theme = "light" | "dark";
