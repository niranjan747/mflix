// ResultsGrid component for responsive movie card layout
// Based on spec.md User Story 3 and research.md responsive grid decisions

import type { ReactNode } from 'react';

interface ResultsGridProps {
  children: ReactNode;
}

export function ResultsGrid({ children }: ResultsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {children}
    </div>
  );
}
