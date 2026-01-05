export interface SpotifyAccessTokenResponse {
  access_token: string;
}

export interface SpotifyArtist {
  name: string;
}

export interface SpotifyImage {
  url: string;
}

export interface SpotifyExternalUrls {
  spotify: string;
}

export interface SpotifyAlbum {
  name: string;
  images: SpotifyImage[];
}

export interface SpotifyItem {
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  external_urls: SpotifyExternalUrls;
}

export interface SpotifyNowPlaying {
  is_playing: boolean;
  item: SpotifyItem | null;
}

export interface NowPlayingResponse {
  album?: string;
  albumImageUrl?: string;
  artist?: string;
  isPlaying: boolean;
  songUrl?: string;
  title?: string;
}
