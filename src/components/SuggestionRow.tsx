import { useEffect, useMemo, useState } from 'react';
import type { SuggestionListItem } from '../types/movie';
import { buildPosterCandidates } from '../utils/poster';

interface SuggestionRowProps {
  suggestion: SuggestionListItem;
  isActive: boolean;
  onSelect: (suggestion: SuggestionListItem) => void;
  onHover: () => void;
  optionId?: string;
}

const PLACEHOLDER_INITIALS = '??';

export function SuggestionRow({ suggestion, isActive, onSelect, onHover, optionId }: SuggestionRowProps) {
  const [posterIndex, setPosterIndex] = useState(0);

  const posterCandidates = useMemo(
    () => buildPosterCandidates(suggestion.imdbID, suggestion.Poster),
    [suggestion.imdbID, suggestion.Poster],
  );

  useEffect(() => {
    setPosterIndex(0);
  }, [suggestion.imdbID]);

  const posterSrc = posterCandidates[posterIndex] ?? null;

  const handlePosterError = () => {
    setPosterIndex((prev) => prev + 1);
  };

  const initials = useMemo(() => {
    return (
      suggestion.Title
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word.charAt(0).toUpperCase())
        .join('') || PLACEHOLDER_INITIALS
    );
  }, [suggestion.Title]);

  return (
    <button
      type="button"
      onClick={() => onSelect(suggestion)}
      onMouseEnter={onHover}
      onFocus={onHover}
      id={optionId}
      role="option"
      aria-selected={isActive}
      className={`w-full px-4 py-3 flex flex-col sm:flex-row gap-3 text-left min-h-[72px] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 rounded-none ${
        isActive
          ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
          : 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      <div className="w-18 h-24 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-300 shadow-inner">
        {posterSrc ? (
          <img
            src={posterSrc}
            alt={`${suggestion.Title} poster`}
            loading="lazy"
            onError={handlePosterError}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="uppercase tracking-wide">{initials}</span>
        )}
      </div>

      <div className="flex-1">
        <p className="font-semibold text-sm sm:text-base truncate">{suggestion.Title}</p>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          {suggestion.Year} • {suggestion.Type}
        </p>
        {suggestion.snippet && (
          <span className="inline-flex items-center px-2 py-0.5 mt-2 text-xs font-medium text-blue-700 dark:text-blue-100 bg-blue-50 dark:bg-blue-900/40 rounded-full">
            …{suggestion.snippet.match}…
          </span>
        )}
      </div>
    </button>
  );
}
