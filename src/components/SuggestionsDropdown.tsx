// Autocomplete suggestions dropdown component
// Displays movie suggestions with keyboard navigation support

import type { SuggestionListItem } from '../types/movie';
import { SuggestionRow } from './SuggestionRow';

interface SuggestionsDropdownProps {
  suggestions: SuggestionListItem[];
  loading: boolean;
  error: string | null;
  onSelect: (suggestion: SuggestionListItem) => void;
  focusedIndex: number;
  onHoverRow: (index: number) => void;
}

export function SuggestionsDropdown({
  suggestions,
  loading,
  error,
  onSelect,
  focusedIndex,
  onHoverRow,
}: SuggestionsDropdownProps) {
  const hasResults = suggestions.length > 0;

  if (!loading && !error && !hasResults) {
    return null;
  }

  return (
    <div
      role="listbox"
      aria-label="Movie suggestions"
      aria-busy={loading}
      className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-2xl overflow-x-hidden overflow-y-auto z-50 max-h-96"
    >
      {loading && (
        <>
          <span className="sr-only" aria-live="polite">
            Loading movie suggestions
          </span>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700" aria-hidden="true">
          {[...Array(3)].map((_, index) => (
            <li key={`skeleton-${index}`} className="px-4 py-3">
              <div className="flex flex-col sm:flex-row gap-3 animate-pulse">
                <div className="w-12 h-16 rounded-md bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            </li>
          ))}
          </ul>
        </>
      )}

      {error && !loading && (
        <div
          role="alert"
          aria-live="assertive"
          className="px-4 py-3 text-sm text-red-700 dark:text-red-200 bg-red-50 dark:bg-red-900/30"
        >
          {error}
        </div>
      )}

      {!loading && !error && hasResults && (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {suggestions.map((movie, index) => (
            <li key={movie.imdbID} role="presentation">
              <SuggestionRow
                suggestion={movie}
                isActive={index === focusedIndex}
                onSelect={onSelect}
                onHover={() => onHoverRow(index)}
                optionId={`suggestion-${index}`}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
