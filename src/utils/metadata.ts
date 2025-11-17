import type { MetadataField } from '../types/movie';

const NA_VALUE = 'N/A';

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
