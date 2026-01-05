import type { APIRoute } from 'astro';
import type {
  SpotifyAccessTokenResponse,
  SpotifyNowPlaying,
} from '../../types/spotify';

const clientId = import.meta.env.SPOTIFY_CLIENT_ID;
const clientSecret = import.meta.env.SPOTIFY_CLIENT_SECRET;
const refreshToken = import.meta.env.SPOTIFY_REFRESH_TOKEN;

if (!clientId || !clientSecret || !refreshToken) {
  console.error('Missing Spotify environment variables.');
}

const NOW_PLAYING_ENDPOINT =
  'https://api.spotify.com/v1/me/player/currently-playing';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

const getAccessToken = async (): Promise<SpotifyAccessTokenResponse> => {
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Missing Spotify environment variables.');
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to get access token:', response.status, errorText);
    throw new Error(`Failed to get access token: ${response.status}`);
  }

  return response.json();
};

const getNowPlaying = async (): Promise<Response> => {
  const { access_token: accessToken } = await getAccessToken();

  const response = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // Clone response for error logging without consuming the original
  if (!response.ok && response.status !== 204) {
    const clonedResponse = response.clone();
    const errorText = await clonedResponse.text();
    console.error('Error fetching now playing:', response.status, errorText);
  }

  return response;
};

export const GET: APIRoute = async () => {
  try {
    if (!clientId || !clientSecret || !refreshToken) {
      console.error('Missing Spotify environment variables');
      return new Response(JSON.stringify({ isPlaying: false }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        },
      });
    }

    const res = await getNowPlaying();

    if (res.status === 204) {
      return new Response(JSON.stringify({ isPlaying: false }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        },
      });
    }

    if (res.status > 400) {
      const errorText = await res.text();
      console.error('Error from Spotify API:', res.status, errorText);
      return new Response(JSON.stringify({ isPlaying: false }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        },
      });
    }

    const song = (await res.json()) as SpotifyNowPlaying;

    if (song.item === null) {
      return new Response(JSON.stringify({ isPlaying: false }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        },
      });
    }

    const isPlaying = song.is_playing;
    const title = song.item.name;
    const artist = song.item.artists.map((_artist) => _artist.name).join(', ');
    const album = song.item.album.name;
    const albumImageUrl = song.item.album.images[0]?.url ?? '';
    const songUrl = song.item.external_urls.spotify;

    return new Response(
      JSON.stringify({
        album,
        albumImageUrl,
        artist,
        isPlaying,
        songUrl,
        title,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        },
      },
    );
  } catch (error) {
    console.error('Error fetching Spotify data:', error);
    return new Response(JSON.stringify({ isPlaying: false }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    });
  }
};
