// Autocomplete suggestions dropdown component
// Displays movie suggestions with keyboard navigation support

import type { SearchSuggestion } from '../types/movie';

interface SuggestionsDropdownProps {
  suggestions: SearchSuggestion[];
  loading: boolean;
  error: string | null;
  onSelect: (imdbID: string) => void;
  onClose: () => void;
  focusedIndex: number;
}

export function SuggestionsDropdown({
  suggestions,
  loading,
  error,
  onSelect,
  focusedIndex,
}: SuggestionsDropdownProps) {
  // Limit to first 5 suggestions per FR-006
  const displayedSuggestions = suggestions.slice(0, 5);

  // Don't render if nothing to show
  if (!loading && !error && displayedSuggestions.length === 0) {
    return null;
  }

  return (
    <div
      role="listbox"
      className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-50 max-h-80"
    >
      {/* Loading indicator */}
      {loading && (
        <div className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">
          Searching...
        </div>
      )}

      {/* Error message */}
      {error && !loading && (
        <div className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">
          {error}
        </div>
      )}

      {/* Suggestion items */}
      {!loading && !error && displayedSuggestions.length > 0 && (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {displayedSuggestions.map((movie, index) => (
            <li
              key={movie.imdbID}
              id={`suggestion-${index}`}
              role="option"
              aria-selected={index === focusedIndex}
              onClick={() => onSelect(movie.imdbID)}
              className={`
                px-4 py-3 min-h-[44px] cursor-pointer text-sm
                transition-colors duration-150
                ${
                  index === focusedIndex
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                    : 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              {movie.Title} ({movie.Year})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
