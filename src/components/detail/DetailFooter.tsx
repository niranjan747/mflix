interface DetailFooterProps {
  imdbID: string;
  website?: string;
}

export function DetailFooter({ imdbID, website }: DetailFooterProps) {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600 dark:text-gray-400">
      <div>
        <span className="font-semibold text-gray-800 dark:text-gray-200">IMDb ID:</span> {imdbID}
      </div>
      {website && website !== 'N/A' && (
        <a
          href={website}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
        >
          Visit official site
        </a>
      )}
    </footer>
  );
}
