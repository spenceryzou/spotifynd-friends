import React, { Component } from 'react'
import Router from 'next/router'
import User from '../pages/user'
import styles from '../pages/index.module.css'

var firebase = require('firebase/app');
var querystring = require('querystring');
var request = require('request')
var client_id = '2923d79235804ea58633989710346f3d';
var client_secret = 'd4813d196edf4940b58ba0aeedbf9ebc';
var redirect_uri = 'https://spotifynd-friends.herokuapp.com/';
var scope = 'user-read-private user-read-email playlist-read-private';

class Spotify extends Component {

  constructor(props) {
    super(props);
    this.state = {
      access_token: '',
      refresh_token: ''
    }
    const firebaseConfig = {
      apiKey: "AIzaSyCBmjWVAetSGAQ2E7uE0oh5_lG--ogkWbc",
      authDomain: "spotifynd-friends.firebaseapp.com",
      databaseURL: "https://spotifynd-friends.firebaseio.com",
      projectId: "spotifynd-friends",
      storageBucket: "spotifynd-friends.appspot.com",
      messagingSenderId: "775203379545",
      appId: "1:775203379545:web:2e74554d15a4b1c3675448",
      measurementId: "G-QL50LT5KSH"
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig)
    }
  }

  componentDidMount = () => {
    let url = window.location.href;
    let access_token = '';
    let refresh_token = '';
    if (url.indexOf('localhost') > -1) {
      redirect_uri = 'http://localhost:3000/index'
    }
    if (url.indexOf('code') > -1) {
      let code = url.split('code=')[1].split("&")[0].trim();

      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
      };

      request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {

          access_token = body.access_token,
          refresh_token = body.refresh_token;
          this.setState({
            access_token: access_token,
            refresh_token: refresh_token
          });
          var options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
          };

          // use the access token to access the Spotify Web API
          request.get(options, (error, response, body) => {
            this.writeAccessToken(body.id, access_token);
            console.log(body);
          });
        }
      });
    }
  }

  writeAccessToken = (userid, access_token) => {
    let userRef = firebase.database().ref('users/' + userid);
    userRef.update({
        'access_token': access_token
      }, function (error) {
        if (error) {
          // The write failed...
        } else {
          console.log("Updated access token: " + access_token);
        }
      }
    );
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
    } else {
      Router.push({
        pathname: '/user',
        query: { access_token } //may be unnecessary
      })
    }
  }

  render() {
    const { access_token } = this.state

    // if(access_token !== ''){
    //     <User access_token={ this.state.access_token} />
    // }

    return (
      <div>
        <h1 className={styles.center}> Welcome to Spotifynd Friends! </h1>
        <div className="row justify-content-center mt-5">
          <button onClick={event => this.makeSpotifyProfileCall(event)} className={styles.button}>
            {access_token !== '' ? 'Enter' : 'Login'}
          </button>
        </div>
      </div>
    );
  }
}

export default Spotify;
