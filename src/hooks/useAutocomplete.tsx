// Custom hook for autocomplete functionality
// Manages debounced search suggestions with loading and error states

import { useState, useEffect } from 'react';
import { searchMovieBroad } from '../utils/api';
import type { SearchSuggestion } from '../types/movie';

const DEBOUNCE_DELAY_MS = 300;
const MIN_QUERY_LENGTH = 2;

interface UseAutocompleteReturn {
  query: string;
  setQuery: (query: string) => void;
  suggestions: SearchSuggestion[];
  loading: boolean;
  error: string | null;
  clearSuggestions: () => void;
  focusedIndex: number;
  setFocusedIndex: React.Dispatch<React.SetStateAction<number>>;
}

export function useAutocomplete(): UseAutocompleteReturn {
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  // Debounced search effect
  useEffect(() => {
    // Reset suggestions and error when query changes
    setError(null);
    setFocusedIndex(-1);

    // Don't search if query is too short
    if (query.length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    // Start debounce timer
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const response = await searchMovieBroad(query);
        
        if (response.Response === 'True' && response.Search) {
          setSuggestions(response.Search);
          
          // Show "no results" message if search returned empty array
          if (response.Search.length === 0) {
            setError('No movies found—try broader terms!');
          }
        } else {
          setSuggestions([]);
          setError('No movies found—try broader terms!');
        }
      } catch (err) {
        console.error('[useAutocomplete] Broad search error:', err);
        setSuggestions([]);
        setError(err instanceof Error ? err.message : 'Search hiccup—retry soon');
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_DELAY_MS);

    // Cleanup function - cancel timer if query changes
    return () => {
      clearTimeout(timer);
      setLoading(false);
    };
  }, [query]);

  const clearSuggestions = () => {
    setSuggestions([]);
    setError(null);
    setFocusedIndex(-1);
  };

  return {
    query,
    setQuery,
    suggestions,
    loading,
    error,
    clearSuggestions,
    focusedIndex,
    setFocusedIndex,
  };
}
