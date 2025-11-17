import type { MovieDetail } from '../../types/movie';
import { PosterWithFallback } from './PosterWithFallback';

interface DetailHeaderProps {
  movie: MovieDetail;
}

export function DetailHeader({ movie }: DetailHeaderProps) {  
  return (
    <header className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:max-w-xs">
        <PosterWithFallback imdbID={movie.imdbID} poster={movie.Poster} title={movie.Title} />
      </div>

      <div className="flex-1 space-y-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">{movie.Type}</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {movie.Title}
            <span className="text-lg font-normal text-gray-500 dark:text-gray-400"> ({movie.Year})</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-gray-600 dark:text-gray-300">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 font-semibold">
            <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{movie.imdbRating}</span>
          </div>

          {movie.Genre && (
            <span className="text-sm text-gray-500 dark:text-gray-400">{movie.Genre}</span>
          )}
        </div>
        <a
          href={`https://www.imdb.com/title/${movie.imdbID}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center px-4 py-2 text-sm font-medium border border-blue-500 text-blue-600 dark:text-blue-200 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          View on IMDb
        </a>
      </div>
    </header>
  );
}
