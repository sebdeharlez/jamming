import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistName: "",
      playlistTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name})
  }

  savePlaylist() {
    let tracks = this.state.playlistTracks;
    if(tracks.length && this.state.playlistName) {
      let trackURIs = tracks.map(trackIndex => trackIndex.uri);
      Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
        this.setState({
          playlistName: 'New Playlist',
          playlistTracks: []
        });
        //document.getElementById('Playlist-name').value = this.state.playlistName;
      });
    }
  }



  addTrack(track) {
    if(!this.state.playlistTracks.includes(track)) {
      let playlist = this.state.playlistTracks;
      playlist.push(track);
      this.setState({playlistTracks: playlist})
    }
  }

  removeTrack(track) {
    let index = this.state.playlistTracks.indexOf(track)
    let playlist = this.state.playlistTracks;
    playlist.splice(index, 1);
    this.setState({playlistTracks: playlist})
  }

  search(searchTerm) {
    Spotify.search(searchTerm).then(searchResults =>
      this.setState({searchResults: searchResults}))
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="Highlight">mm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    )
  }
}

export default App;
