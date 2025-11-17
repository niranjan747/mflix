import type { PosterPanelState } from '../../types/movie';

interface PosterSidebarProps {
  title: string;
  imdbID: string;
  website?: string;
  posterPanel: PosterPanelState;
}

const FALLBACK_BG = '#1e293b';

export function PosterSidebar({ title, imdbID, website, posterPanel }: PosterSidebarProps) {
  const assetUrl = posterPanel.mediaAsset.primaryUrl ?? posterPanel.mediaAsset.fallbackUrl;
  const placeholderColor = posterPanel.mediaAsset.dominantColor ?? FALLBACK_BG;
  const initials = buildInitials(title);
  const stickyClasses = posterPanel.isSticky ? 'lg:sticky lg:top-6 lg:self-start' : '';

  return (
    <aside
      className={`flex flex-col gap-4 ${stickyClasses} detail-poster`}
      aria-label="Movie poster"
    >
      <div
        className="overflow-hidden rounded-[28px] shadow-2xl ring-1 ring-white/10 lg:max-h-[calc(100vh-4rem)]"
        style={{ backgroundColor: placeholderColor }}
      >
        {assetUrl ? (
          <img
            src={assetUrl}
            alt={`${title} poster`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-3 text-white/80">
            <span className="text-4xl font-semibold tracking-widest">{initials}</span>
            <p className="text-xs uppercase tracking-[0.3em]">Poster unavailable</p>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200/40 bg-white/80 p-4 text-sm text-slate-700 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">More details</p>
        <div className="mt-3 flex flex-col gap-2">
          <a
            href={`https://www.imdb.com/title/${imdbID}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-900/20 px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-900/10 dark:border-slate-100/20 dark:text-slate-100 dark:hover:bg-white/10"
          >
            <span>View on IMDb</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </a>

          {website && website !== 'N/A' && (
            <a
              href={website}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-500 underline transition hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
            >
              Official site
            </a>
          )}
        </div>
      </div>
    </aside>
  );
}

function buildInitials(value: string): string {
  return (
    value
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((segment) => segment.charAt(0).toUpperCase())
      .join('') || '??'
  );
}
