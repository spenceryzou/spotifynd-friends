import React, { Component } from 'react'
import styles from '../pages/index.module.css'

var querystring = require('querystring');
var client_id = '2923d79235804ea58633989710346f3d';
var redirect_uri = 'https://spotifynd-friends.herokuapp.com/login';
var scope = 'user-read-private user-read-email playlist-read-private';

class Spotify extends Component {

  constructor(props) {
    super(props);
    this.state = {
      access_token: '',
      refresh_token: ''
    }

  }

  componentDidMount = () => {
    let url = window.location.href;
    if(url.indexOf('localhost') > -1){
      redirect_uri = 'http://localhost:3000/login'
    }
  }

  generateRandomString = (length) => {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  makeSpotifyProfileCall = (event) => {
    event.preventDefault()
    const { access_token } = this.state
    if (access_token === '') {
      window.location = 'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
          response_type: 'code',
          client_id: client_id,
          scope: scope,
          redirect_uri: redirect_uri,
          state: this.generateRandomString(16)

        });
    }
  }

  render() {
    return (
      <div className="background">
      <head>
        <link href="https://fonts.googleapis.com/css?family=Roboto:700&display=swap" rel="stylesheet"></link>
      </head>
      <div>
      <style jsx>{`
                    body {
                      background: #19e68c;
                      margin-left: 144px;
                      margin-top: 144px;
                      overflow-x: hidden;
                    }
                `}</style>
            <a className={styles.title}> spotifynd <br></br> friends</a>

            <div>
              <button style={{fontFamily: 'Roboto'}} onClick={event => this.makeSpotifyProfileCall(event)} className={styles.button}>
              <i className={styles.iconspotify}></i>{'Continue with Spotify'}
              </button>
            </div>
        </div>
      </div>
    );
  }
}

export default Spotify;
