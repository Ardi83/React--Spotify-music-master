import React, { Component } from 'react';
import { FormGroup, FormControl, InputGroup} from 'react-bootstrap';
import './App.css'
import Spotify from 'spotify-web-api-js';
import Profile from './profile';
import Gallery from './Gallery';

const spotifyWebApi = new Spotify();
class App extends Component {
    constructor (props) {
        super(props);
        const params = this.getHashParams();
        this.state = {
            query: '',
            artist: null,
            artistId: null,
            tracks: [],
            loggedIn: params.access_token ? true : false,
            }
        
        if (this.state.loggedIn) {
            spotifyWebApi.setAccessToken(params.access_token);
        }
    }
    getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while ( e = r.exec(q)) {
           hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
      }


    getArtist() {
        spotifyWebApi.searchArtists(this.state.query)
        .then(data => {   
            const artistId = data.artists.items[0].id;
            const artist = data.artists.items[0];
            console.log("artist", artist);
            this.setState({artist: artist});
            this.setState({artistId: artistId});
            this.getAlbum()
        }, (err) => {
            console.error(err);
        })
    }
    getAlbum() {
        spotifyWebApi.getArtistAlbums(this.state.artistId, 
        {limit: 10, offset: 20}, (err, data) => {
            const tracks = data.items;
            this.setState({tracks});
            if (err) console.error(err);
          });
        
    }

    search() {
        this.getArtist()
    }
      
   
            render() {
                return (
            <div className="App">
                <a className="Spotify-link" href="http://localhost:8888">
                    <button>Login with Spotify</button>
                </a>
                <div className="App-title">Music Master</div>
                <FormGroup>
                    <InputGroup>
                        <FormControl 
                        type="text"
                        placeholder="search an artist..."
                        query={this.state.query}
                        onChange={event => {this.setState({query: event.target.value})}}
                        onKeyPress={event => { if (event.key === 'Enter'){this.search()}}}
                        />
                        <button onClick={() => this.search()}><i className="fas fa-search"></i></button>
                    </InputGroup>
                </FormGroup>
                {
                    this.state.artist !== null 
                    ?
                    <div>
                        <Profile 
                        artist = {this.state.artist}
                        />
                        <Gallery 
                        tracks={this.state.tracks}
                        />
                    </div> 
                    : <div></div>
                }
            </div>

        )
    }
}

export default App;