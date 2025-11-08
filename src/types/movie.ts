// TypeScript interfaces for Movie Flix landing page
// Based on data-model.md specification

/**
 * Movie entity from OMDb API response
 */
export interface Movie {
  Title: string;
  Year: string;
  Plot: string;
  Poster: string;           // Can be "N/A" if unavailable
  imdbRating: string;       // Can be "N/A" if unavailable
  Type?: string;            // e.g., "movie"
  imdbID?: string;          // e.g., "tt1375666"
  Response?: string;        // "True" | "False" - API success indicator
  Error?: string;           // Error message when Response is "False"
}

/**
 * Search suggestion from OMDb broad search API
 * Used for autocomplete dropdown display
 */
export interface SearchSuggestion {
  Title: string;
  Year: string;
  imdbID: string;
  Type: "movie";
  Poster: string;           // URL or "N/A" - not displayed in dropdown
}

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
 * Search state management interface
 * Extended to support autocomplete suggestions
 */
export interface SearchState {
  loading: boolean;
  movieData: Movie | null;
  suggestions: SearchSuggestion[];
  error: string | null;
}

/**
 * Theme preference type
 */
export type Theme = "light" | "dark";
