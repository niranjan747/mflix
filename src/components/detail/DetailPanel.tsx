import type { MovieDetail, MetadataField } from '../../types/movie';
import { formatMetadataValue } from '../../utils/metadata';
import { DetailHeader } from './DetailHeader';
import { MetadataGrid } from './MetadataGrid';
import { RatingsList } from './RatingsList';
import { DetailFooter } from './DetailFooter';

interface DetailPanelProps {
  movie: MovieDetail;
}

const buildMetadataFields = (movie: MovieDetail): MetadataField[] => {
  const entries: Array<[string, string | undefined]> = [
    ['Rated', movie.Rated],
    ['Released', movie.Released],
    ['Runtime', movie.Runtime],
    ['Genre', movie.Genre],
    ['Director', movie.Director],
    ['Writer', movie.Writer],
    ['Actors', movie.Actors],
    ['Language', movie.Language],
    ['Country', movie.Country],
    ['Awards', movie.Awards],
    ['Metascore', movie.Metascore],
    ['IMDb Votes', movie.imdbVotes],
    ['Box Office', movie.BoxOffice],
  ];

  return entries.map(([label, value]) => formatMetadataValue(label, value));
};

export function DetailPanel({ movie }: DetailPanelProps) {
  const metadataFields = buildMetadataFields(movie);

  return (
    <article className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 lg:p-10 space-y-8">
      <DetailHeader movie={movie} />

      <section>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Plot</h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          {movie.Plot}
        </p>
      </section>

      <MetadataGrid fields={metadataFields} />

      <RatingsList ratings={movie.Ratings} />

      <DetailFooter imdbID={movie.imdbID} website={movie.Website} />
    </article>
  );
}
