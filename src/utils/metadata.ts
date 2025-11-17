import type { MetadataField, MovieDetail } from '../types/movie';

const NA_VALUE = 'N/A';
const BULLET_LIMIT = 3;
const CAST_LIMIT = 5;

/**
 * Apply the canonical "N/A" fallback when OMDb returns empty or placeholder values.
 */
export function withNAFallback(value?: string | null): string {
  const normalized = value?.toString().trim();
  if (!normalized || normalized.toUpperCase() === NA_VALUE) {
    return NA_VALUE;
  }
  return normalized;
}

/**
 * Build a metadata field ready for grid rendering with fallback processing applied.
 */
export function formatMetadataValue(label: string, value?: string | null): MetadataField {
  return {
    label,
    value: withNAFallback(value),
  };
}

/**
 * Generate short highlight bullets (awards, genre, box office, etc.) for the hero overview.
 */
export function buildHighlightBullets(movie: MovieDetail): string[] {
  const bullets: string[] = [];

  pushIfPresent(bullets, movie.Awards);
  pushIfPresent(bullets, movie.Genre);
  if (movie.Director && movie.Director !== NA_VALUE) {
    bullets.push(`Directed by ${movie.Director}`);
  }
  if (movie.BoxOffice && movie.BoxOffice !== NA_VALUE) {
    bullets.push(`Box office ${movie.BoxOffice}`);
  }

  return bullets.filter(Boolean).slice(0, BULLET_LIMIT);
}

/**
 * Split comma-delimited strings into trimmed arrays (genre, actors, languages).
 */
export function splitList(value?: string | null, limit?: number): string[] {
  if (!value || value === NA_VALUE) {
    return [];
  }
  const parts = value.split(',').map((segment) => segment.trim()).filter(Boolean);
  if (typeof limit === 'number') {
    return parts.slice(0, limit);
  }
  return parts;
}

/**
 * Return a cast preview limited to five names for info panel display.
 */
export function buildCastPreview(actors?: string | null): string[] {
  return splitList(actors, CAST_LIMIT);
}

/**
 * Provide a friendly fallback string when the source value is empty or "N/A".
 */
export function fallbackText(value?: string | null, fallback = 'Not available'): string {
  const normalized = withNAFallback(value);
  return normalized === NA_VALUE ? fallback : normalized;
}

function pushIfPresent(bullets: string[], value?: string | null): void {
  if (value && value !== NA_VALUE) {
    bullets.push(value);
  }
}
