// Custom hook for autocomplete functionality
// Manages debounced search suggestions with loading and error states

import { useState, useEffect, useMemo } from 'react';
import { searchMovieBroad } from '../utils/api';
import type { SearchResult, SuggestionListItem } from '../types/movie';

const DEBOUNCE_DELAY_MS = 300;
const MIN_QUERY_LENGTH = 2;
const MAX_VISIBLE = 5;

interface UseAutocompleteReturn {
  query: string;
  setQuery: (query: string) => void;
  visibleSuggestions: SuggestionListItem[];
  loading: boolean;
  error: string | null;
  clearSuggestions: () => void;
  focusedIndex: number;
  setFocusedIndex: React.Dispatch<React.SetStateAction<number>>;
}

const buildSnippet = (title: string, query: string): SuggestionListItem['snippet'] => {
  const normalizedQuery = query.trim();
  if (normalizedQuery.length < MIN_QUERY_LENGTH) {
    return undefined;
  }

  const lowerTitle = title.toLowerCase();
  const lowerQuery = normalizedQuery.toLowerCase();
  const matchIndex = lowerTitle.indexOf(lowerQuery);

  if (matchIndex === -1) {
    return undefined;
  }

  return {
    prefix: title.slice(0, matchIndex),
    match: title.slice(matchIndex, matchIndex + normalizedQuery.length),
    suffix: title.slice(matchIndex + normalizedQuery.length),
  };
};

export function useAutocomplete(): UseAutocompleteReturn {
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const visibleSuggestions = useMemo<SuggestionListItem[]>(() => {
    if (suggestions.length === 0) {
      return [];
    }

    return suggestions.slice(0, MAX_VISIBLE).map((suggestion) => ({
      ...suggestion,
      snippet: buildSnippet(suggestion.Title, query),
    }));
  }, [suggestions, query]);

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
    visibleSuggestions,
    loading,
    error,
    clearSuggestions,
    focusedIndex,
    setFocusedIndex,
  };
}
