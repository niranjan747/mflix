import type { MetadataField } from '../../types/movie';

interface MetadataGridProps {
  fields: MetadataField[];
}

export function MetadataGrid({ fields }: MetadataGridProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fields.map((field) => (
        <div key={field.label} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{field.label}</p>
          <p className="text-base font-medium text-gray-900 dark:text-gray-100">{field.value}</p>
        </div>
      ))}
    </section>
  );
}
