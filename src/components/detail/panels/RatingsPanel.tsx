import type { RatingsPanelContent } from '../../../types/movie';

interface RatingsPanelProps {
  content: RatingsPanelContent;
}

const ratingFields: Array<{ key: keyof RatingsPanelContent; label: string }> = [
  { key: 'imdbRating', label: 'IMDb' },
  { key: 'metacritic', label: 'Metacritic' },
  { key: 'rottenTomatoes', label: 'Rotten Tomatoes' },
  { key: 'userScore', label: 'Audience' },
];

export function RatingsPanel({ content }: RatingsPanelProps) {
  return (
    <section className="space-y-4 rounded-3xl border border-white/10 bg-white/70 p-6 text-slate-900 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-100 motion-safe:transition-all motion-safe:duration-hero motion-safe:ease-hero">
      <div className="grid gap-4 sm:grid-cols-2">
        {ratingFields.map((field) => {
          const value = content[field.key];
          return (
            <div key={field.key} className="rounded-2xl border border-slate-200/60 p-4 dark:border-white/10">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">{field.label}</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">
                {value ?? 'N/A'}
              </p>
            </div>
          );
        })}
      </div>

      {content.lastUpdated && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Ratings last updated {content.lastUpdated}
        </p>
      )}
    </section>
  );
}
