import { useEffect, useMemo, useState } from 'react';
import { fetchPosterUrl } from '../../utils/poster';

interface PosterWithFallbackProps {
  imdbID: string;
  title: string;
  poster: string;
  className?: string;
}

const PLACEHOLDER_INITIALS = '??';

export function PosterWithFallback({ imdbID, title, poster, className }: PosterWithFallbackProps) {
  const [posterSrc, setPosterSrc] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function resolvePoster() {
      try {
        const resolved = await fetchPosterUrl(imdbID, poster);
        if (isMounted) {
          setPosterSrc(resolved);
        }
      } catch (error) {
        console.warn('[PosterWithFallback] Poster lookup failed:', error);
        if (isMounted) {
          setPosterSrc(null);
        }
      }
    }

    resolvePoster();

    return () => {
      isMounted = false;
    };
  }, [imdbID, poster]);

  const initials = useMemo(() => {
    return (
      title
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word.charAt(0).toUpperCase())
        .join('') || PLACEHOLDER_INITIALS
    );
  }, [title]);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800 shadow-lg ${className ?? ''}`}
    >
      {posterSrc ? (
        <img
          src={posterSrc}
          alt={`${title} poster`}
          className="w-full h-full object-cover"
          loading="eager"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-12 h-12 mb-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 3v18m12-18v18M3 7h4m10 0h4M3 12h18M3 17h4m10 0h4"
            />
          </svg>
          <span className="text-sm font-semibold tracking-wide">{initials}</span>
        </div>
      )}
    </div>
  );
}
