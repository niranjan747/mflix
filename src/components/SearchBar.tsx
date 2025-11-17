// SearchBar component with autocomplete suggestions
// Based on spec.md FR-004 through FR-035

import { useRef, useEffect } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { useAutocomplete } from '../hooks/useAutocomplete';
import { SuggestionsDropdown } from './SuggestionsDropdown';
import type { SuggestionListItem } from '../types/movie';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSelectSuggestion: (suggestion: SuggestionListItem) => void;
  onQueryChange?: (query: string) => void;
  disabled?: boolean;
}

export function SearchBar({ 
  onSearch, 
  onSelectSuggestion,
  onQueryChange,
  disabled = false 
}: SearchBarProps) {
  const {
    query,
    setQuery,
    visibleSuggestions,
    loading,
    error,
    clearSuggestions,
    focusedIndex,
    setFocusedIndex,
  } = useAutocomplete();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Hide dropdown and execute full search per FR-016
    clearSuggestions();
    
    // Trim whitespace per FR-007
    const trimmedQuery = query.trim();
    
    // Don't submit empty queries
    if (!trimmedQuery) {
      return;
    }
    
    onSearch(trimmedQuery);
  };

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    onQueryChange?.(newQuery);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Only handle keyboard navigation if dropdown is visible
    if (visibleSuggestions.length === 0) {
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => 
          prev < visibleSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => 
          prev > 0 ? prev - 1 : visibleSuggestions.length - 1
        );
        break;
      
      case 'Enter':
        if (focusedIndex >= 0 && focusedIndex < visibleSuggestions.length) {
          e.preventDefault();
          const selectedMovie = visibleSuggestions[focusedIndex];
          onSelectSuggestion(selectedMovie);
          clearSuggestions();
        }
        break;
      
      case 'Escape':
        e.preventDefault();
        clearSuggestions();
        break;
    }
  };

  // Click-outside detection
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        clearSuggestions();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [clearSuggestions]);

  const showDropdown = visibleSuggestions.length > 0 || loading || error;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 md:px-8 lg:px-16" ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for a movie..."
            disabled={disabled}
            aria-label="Search for movies"
            aria-autocomplete="list"
            aria-controls="suggestions-dropdown"
            aria-activedescendant={
              focusedIndex >= 0 ? `suggestion-${focusedIndex}` : undefined
            }
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       placeholder-gray-500 dark:placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                       disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={disabled}
            aria-label="Search"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600
                       text-white font-medium rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors duration-200
                       min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            {/* Magnifying glass icon */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </button>
        </div>

        {/* Autocomplete dropdown */}
        {showDropdown && (
          <SuggestionsDropdown
            suggestions={visibleSuggestions}
            loading={loading}
            error={error}
            onSelect={(suggestion) => {
              onSelectSuggestion(suggestion);
              clearSuggestions();
            }}
            focusedIndex={focusedIndex}
            onHoverRow={(index) => setFocusedIndex(index)}
          />
        )}
      </form>
    </div>
  );
}
