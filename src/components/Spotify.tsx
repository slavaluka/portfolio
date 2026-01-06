import useSWR from 'swr';
import type { NowPlayingResponse } from '../types/spotify';

const fetcher = async (
  ...args: Parameters<typeof fetch>
): Promise<NowPlayingResponse> => {
  const res = await fetch(...args);

  if (!res.ok) {
    throw new Error(
      `Failed to fetch current Spotify track. Status: ${res.status}`,
    );
  }

  return res.json();
};

export const Spotify = () => {
  const { data, error } = useSWR<NowPlayingResponse>('/api/spotify', fetcher, {
    refreshInterval: 35000,
    onError: (error: Error) => {
      console.error('Error fetching Spotify data:', error);
    },
  });

  const spotifyData = error
    ? { isPlaying: false }
    : data || { isPlaying: false };

  const isPlaying = spotifyData?.isPlaying;
  const { title, artist, album, albumImageUrl, songUrl } = spotifyData || {};
  const subtitle = `${artist ?? ''}${album ? ` · ${album}` : ''}`;

  const renderContent = () => {
    if (!isPlaying) {
      return <SpotifyOffline />;
    }

    return (
      <SpotifyPlaying
        title={title}
        subtitle={subtitle}
        albumAlt={album}
        albumImageUrl={albumImageUrl}
        songUrl={songUrl}
      />
    );
  };

  return (
    <section id='spotify-container'>
      <dl>
        <dt className='dt-entry'>
          <h3 className='flex items-center gap-1 text-tertiary'>
            Spotify
            {isPlaying && <Live />}
          </h3>
        </dt>
        <dd className='dd-entry'>{renderContent()}</dd>
      </dl>
    </section>
  );
};

export default Spotify;

const SpotifyPlaying = ({
  title,
  subtitle,
  albumAlt,
  albumImageUrl,
  songUrl,
}: {
  title?: string;
  subtitle: string;
  albumAlt?: string;
  albumImageUrl?: string;
  songUrl?: string;
}) => {
  return (
    <a
      href={songUrl || '#'}
      className='group no-underline hoverable-container'
      target={songUrl ? '_blank' : undefined}
      rel={songUrl ? 'noopener noreferrer' : undefined}
    >
      {albumImageUrl ? (
        <img
          src={albumImageUrl}
          alt={albumAlt || 'Album cover'}
          className='rounded w-12 h-12 object-cover pointer-events-none group-hover:-rotate-8 transition duration-250 ease-in-out'
        />
      ) : (
        <ImageFallback />
      )}
      <div>
        <p>{title}</p>
        <p className='caption'>{subtitle}</p>
      </div>
    </a>
  );
};

const SpotifyOffline = () => {
  return (
    <div className='group hoverable-container'>
      <ImageFallback />
      <div>
        <p>Not playing</p>
        <p className='caption'>Currently I'm offline</p>
      </div>
    </div>
  );
};

const ImageFallback = () => {
  return (
    <div className='w-12 h-12 bg-white/10 rounded grid place-items-center origin-center transform-gpu will-change-transform group-hover:-rotate-8 transition-transform duration-250 ease-in-out'>
      <svg
        className='block'
        xmlns='http://www.w3.org/2000/svg'
        width='21'
        height='21'
        fill='white'
        viewBox='0 0 16 16'
        aria-label='Spotify logo'
      >
        <path d='M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.669 11.538a.5.5 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.686m.979-2.178a.624.624 0 0 1-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 0 1-.362-1.194c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 0 1 .206.858m.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 1 1-.434-1.432c2.825-.857 7.523-.692 10.492 1.07a.747.747 0 1 1-.764 1.288' />
      </svg>
    </div>
  );
};

const Live = () => {
  return (
    <div className='relative h-2 w-2 mt-0.5' aria-hidden>
      <div className='absolute inset-0 opacity-30 animate-ping rounded-full bg-green-400' />
      <div className='absolute inset-0 m-auto h-1 w-1 rounded-full bg-green-400' />
    </div>
  );
};
