import { useEffect, useState } from 'react';

interface NowPlayingResponse {
  album?: string;
  albumImageUrl?: string;
  artist?: string;
  isPlaying: boolean;
  songUrl?: string;
  title?: string;
}

const fetchSpotifyData = async (): Promise<NowPlayingResponse> => {
  try {
    const response = await fetch('/api/spotify');

    if (!response.ok) {
      throw new Error(
        `Failed to fetch current Spotify track. Status: ${response.status}`,
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Spotify data:', error);
    return {
      isPlaying: false,
    };
  }
};

export const Spotify = () => {
  const [data, setData] = useState<NowPlayingResponse | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchSpotifyData();
      setData(result);
    };

    loadData();

    // Set up polling
    const interval = setInterval(() => {
      fetchSpotifyData().then(setData);
    }, 35000);

    return () => clearInterval(interval);
  }, []);

  if (!data || !data.isPlaying) {
    return (
      <section id='spotify-container'>
        <dl>
          <dt className='dt-entry'>
            <h3 className='flex items-center gap-1 text-tertiary'>Spotify</h3>
          </dt>
          <dd className='dd-entry'>
            <div className='flex items-start sm:items-center gap-3 sm:gap-4 group cursor-pointer hover:opacity-80 transition duration-250 ease-in-out'>
              <div className='w-12 h-12 bg-white/10 rounded content-center justify-items-center group-hover:-rotate-8 transition duration-250 ease-in-out'>
                <SpotifyIcon />
              </div>
              <div>
                <p className='text-gray-400'>Not playing</p>
                <p className='caption'>Currently I'm offline</p>
              </div>
            </div>
          </dd>
        </dl>
      </section>
    );
  }

  const { title, artist, album, albumImageUrl, songUrl } = data;
  const subtitle = `${artist ?? ''}${album ? ` · ${album}` : ''}`;

  return (
    <section id='spotify-container'>
      <dl>
        <dt className='dt-entry'>
          <h3 className='flex items-center gap-1 text-tertiary'>
            Spotify
            <Live />
          </h3>
        </dt>
        <dd className='dd-entry'>
          <a
            href={songUrl || '#'}
            className='flex items-start sm:items-center gap-3 sm:gap-4 no-underline group hover:opacity-80 transition duration-250 ease-in-out'
            target={songUrl ? '_blank' : undefined}
            rel={songUrl ? 'noopener noreferrer' : undefined}
          >
            <img
              src={albumImageUrl || ''}
              alt={album || 'Album cover'}
              className='rounded w-12 h-12 object-cover pointer-events-none group-hover:-rotate-8 transition duration-250 ease-in-out'
              onError={(e) => {
                e.currentTarget.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23333'/%3E%3C/svg%3E";
              }}
            />
            <div>
              <p>{title || 'Unknown'}</p>
              <p className='caption'>{subtitle || 'Unknown artist'}</p>
            </div>
          </a>
        </dd>
      </dl>
    </section>
  );
};

export default Spotify;

const SpotifyIcon = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='21'
      height='21'
      fill='white'
      viewBox='0 0 16 16'
    >
      <path d='M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.669 11.538a.5.5 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.686m.979-2.178a.624.624 0 0 1-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 0 1-.362-1.194c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 0 1 .206.858m.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 1 1-.434-1.432c2.825-.857 7.523-.692 10.492 1.07a.747.747 0 1 1-.764 1.288' />
    </svg>
  );
};

const Live = () => {
  return (
    <div
      className='relative flex h-2 w-2 items-center justify-center mt-0.5'
      aria-hidden
    >
      <div className='opacity-85 absolute inline-flex h-full w-full animate-ping rounded-full bg-green-600 dark:bg-green-400 dark:opacity-30'></div>
      <div className='relative inline-flex h-1 w-1 rounded-full bg-green-600 dark:bg-green-400'></div>
    </div>
  );
};
