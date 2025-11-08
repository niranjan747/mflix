// LoadingSpinner component for search in progress state
// Based on spec.md FR-013 and clarification session

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">
        Searching...
      </p>
    </div>
  );
}
