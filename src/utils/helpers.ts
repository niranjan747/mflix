// Utility helper functions for Movie Flix
// Based on research.md decisions

/**
 * Truncate plot text to specified maximum length
 * @param plot - Full plot text
 * @param maxLength - Maximum character length (default 300 per spec)
 * @returns Truncated plot with "..." if exceeds maxLength
 */
export function truncatePlot(plot: string, maxLength: number = 300): string {
  if (plot.length <= maxLength) {
    return plot;
  }
  return plot.slice(0, maxLength) + '...';
}
