// MovieCard component to display movie details
// Based on spec.md FR-010, FR-011, FR-012 and data-model.md

import { useState } from 'react';
import type { MovieDetail } from '../types/movie';
import { truncatePlot } from '../utils/helpers';

interface MovieCardProps {
  movie: MovieDetail;
}

export function MovieCard({ movie }: MovieCardProps) {
  const [imageError, setImageError] = useState(false);
  const hasPoster = movie.Poster && movie.Poster !== 'N/A' && !imageError;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden 
                    transition-transform duration-200 hover:scale-105">
      {/* Poster Image or Placeholder */}
      <div className="relative w-full h-96 bg-gray-200 dark:bg-gray-700">
        {hasPoster ? (
          <img
            src={movie.Poster}
            alt={movie.Title}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            {/* Film reel icon placeholder */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 text-gray-400 dark:text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
            <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">No poster available</p>
          </div>
        )}
      </div>

      {/* Movie Details */}
      <div className="p-6">
        {/* Title and Year */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {movie.Title} ({movie.Year})
        </h2>

        {/* IMDb Rating */}
        {movie.imdbRating && movie.imdbRating !== 'N/A' && (
          <div className="flex items-center mb-4">
            <svg
              className="h-5 w-5 text-yellow-400 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {movie.imdbRating}
            </span>
            <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">/ 10</span>
          </div>
        )}

        {/* Plot */}
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {truncatePlot(movie.Plot, 300)}
        </p>
      </div>
    </div>
  );
}
