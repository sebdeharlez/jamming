const clientId = '2e94f52c91f14292b2c53b2f9974178a';
const redirectUri = "http://spotiseb.surge.sh/";
let accessToken;

const Spotify = {
  getAccessToken() {
    if(accessToken) {
      return accessToken;
    }

    const newAccessToken = window.location.href.match(/access_token=([^&]*)/);
    const newExpiresIn = window.location.href.match(/expires_in=([^&]*)/);

    if (newAccessToken && newExpiresIn) {
      accessToken = newAccessToken[1];
      const expiresIn = Number(newExpiresIn[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      window.location = "https://accounts.spotify.com/authorize?client_id=" + clientId + "&response_type=token&scope=playlist-modify-public&redirect_uri=" + redirectUri;
    }

  },

  search(searchTerm) {
     const accessToken = this.getAccessToken();
     const headers = {
       Authorization: `Bearer ${accessToken}`
     };
     return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
       headers: headers}).then(response => {
       if (response.ok) {
         return response.json();
       }
       throw new Error('Sorry folk, It didn\'t worked!');
     }, networkError => {
       console.log(networkError.message);
     }).then(jsonResponse => {
       if (!jsonResponse.tracks) {
         return [];
       }
       return jsonResponse.tracks.items.map(track => ({
         id: track.id,
         name: track.name,
         artist: track.artists[0].name,
         album: track.album.name,
         uri: track.uri}));
     });
   },

  savePlaylist(playlistName, trackURIs) {
    if(playlistName && trackURIs.length) {

      const accessToken = this.getAccessToken();
      const headers = {
        Authorization: `Bearer ${accessToken}`
      };
      let userId;
      let playlistId;

      return fetch('https://api.spotify.com/v1/me', {headers: headers}).then(response => {
        if (response.ok) {
          return response.json();
        } throw new Error('Error requesting user name.')
      }, networkError => console.log(networkError.message)
      ).then(jsonResponse => {
        userId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({name: playlistName})
        }).then(response => {
          if (response.ok) {
            return response.json();
          } throw new Error ('Error while saving Playlist')
        }, networkError => console.log(networkError.message)
        ).then(jsonResponse => {
          playlistId = jsonResponse.id;
          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({uris: trackURIs})
          }).then(response => {
            if (response.ok) {
              return response.json();
            } throw new Error ('Error in saving tracks')
          }, networkError => console.log(networkError.message)
        ).then(jsonResponse => jsonResponse)
      })
    })

  } else {
    return;
  }
}
}

export default Spotify;
