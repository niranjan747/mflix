export function DetailSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 lg:p-10 space-y-8 animate-pulse">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:max-w-xs h-64 bg-gray-200 dark:bg-gray-800 rounded-xl" />
        <div className="flex-1 space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
        </div>
      </div>

      <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={`meta-skeleton-${index}`} className="h-20 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        ))}
      </div>

      <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl" />
    </div>
  );
}
