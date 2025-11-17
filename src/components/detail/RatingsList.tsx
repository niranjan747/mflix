import type { RatingBreakdown } from '../../types/movie';

interface RatingsListProps {
  ratings: RatingBreakdown[];
}

export function RatingsList({ ratings }: RatingsListProps) {
  if (!ratings || ratings.length === 0) {
    return null;
  }

  return (
    <section>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Critic ratings</h3>
      <ul className="space-y-2">
        {ratings.map((rating) => (
          <li
            key={`${rating.Source}-${rating.Value}`}
            className="flex items-center justify-between rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 px-4 py-2"
          >
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{rating.Source}</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{rating.Value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
