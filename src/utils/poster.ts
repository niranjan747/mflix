import { OMDB_TIMEOUT_MS } from './api';

const POSTER_BASE_URL = 'http://img.omdbapi.com/';
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const NA_VALUE = 'N/A';

function normalizePosterUrl(poster?: string | null): string | null {
  const normalized = poster?.trim();
  if (!normalized || normalized.toUpperCase() === NA_VALUE) {
    return null;
  }
  return normalized;
}

/**
 * Attempt to resolve a high-resolution poster URL before falling back to the OMDb poster field.
 */
export async function fetchPosterUrl(imdbID?: string, fallbackPoster?: string | null): Promise<string | null> {
   // First, try the high-res poster from the movie data (usually from Amazon)
  const normalizedPoster = normalizePosterUrl(fallbackPoster);
  if (normalizedPoster) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), OMDB_TIMEOUT_MS);

    try {
      const response = await fetch(normalizedPoster, {
        method: 'HEAD',
        signal: controller.signal,
      });

      if (response.ok) {
        return normalizedPoster;
      }
    } catch (error) {
      console.warn('[poster] High-res poster unavailable:', error);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // Fallback to OMDb's poster service if high-res fails or is unavailable
  if (imdbID) {
    const omdbUrl = `${POSTER_BASE_URL}?apikey=${API_KEY}&i=${encodeURIComponent(imdbID)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), OMDB_TIMEOUT_MS);

    try {
      const response = await fetch(omdbUrl, {
        method: 'HEAD',
        signal: controller.signal,
      });

      if (response.ok) {
        return omdbUrl;
      }
    } catch (error) {
      console.warn('[poster] OMDb poster unavailable:', error);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return null;

  //return normalizePosterUrl(fallbackPoster);
}

/**
 * Utility to build the ordered list of poster candidates for UI components.
 */
export function buildPosterCandidates(imdbID?: string, fallbackPoster?: string | null): string[] {
  const candidates: string[] = [];
  if (imdbID) {
    candidates.push(`${POSTER_BASE_URL}?apikey=${API_KEY}&i=${encodeURIComponent(imdbID)}`);
  }
  const normalizedFallback = normalizePosterUrl(fallbackPoster);
  if (normalizedFallback) {
    candidates.push(normalizedFallback);
  }
  return candidates;
}
