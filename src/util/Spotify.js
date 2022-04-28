let accessToken;
const clientID = '63a93490877d4665ba5cc9d90fd5e5fa';
const redirectURI = 'http://localhost:3000/callback/';

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    let tokenURL = window.location.href.match(/access_token=([^&]*)/);
    let expiresIn = window.location.href.match(/expires_in=([^&]*)/);
    if (tokenURL && expiresIn) {
      accessToken = tokenURL[1];
      expiresIn = expiresIn[1];
      window.setTimeout(() => (accessToken = ''), expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    }
  },

  search(searchTerm) {
    accessToken = this.getAccessToken();
    return fetch(
      `https://api.spotify.com/v1/search?type=track&q=${searchTerm}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (!data.tracks) return [];
        const trackItems = data.tracks.items.map((track) => {
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri,
          };
        });
        return trackItems;
      });
  },

  savePlaylist(playlistName, trackURIs) {
    if (!(playlistName && trackURIs)) return;
    const accessToken = this.getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    let userId;
    let playlistId;
    return fetch('https://api.spotify.com/v1/me', { headers: headers })
      .then((response) => response.json())
      .then((data) => (userId = data.id))
      .then(() => {
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            name: playlistName,
          }),
        });
      })
      .then((response) => response.json())
      .then((data) => (playlistId = data.id))
      .then(() => {
        return fetch(
          `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
          {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
              uris: trackURIs,
            }),
          }
        );
      });
  },
};

export default Spotify;
