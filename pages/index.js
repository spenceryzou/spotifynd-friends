import React, { Component } from 'react'
import Router from 'next/router'
import User from '../pages/user'
import styles from '../pages/index.module.css'
import Header from '../components/Header'

//var firebase = require('firebase/app');
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

  }

  componentDidMount = () => {
    let url = window.location.href;
    let access_token = '';
    let refresh_token = '';
    if(url.indexOf('localhost') > -1){
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
          request.get(options, function (error, response, body) {
            console.log(body);
          });
        }
      });
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
    } else {
      Router.push({
        pathname: '/user',
        query: { access_token } //may be unnecessary
      }, '/user'
      )
    }
  }

  render() {
    const { access_token } = this.state

    // if(access_token !== ''){
    //     <User access_token={ this.state.access_token} />
    // }

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
              <i className={styles.iconspotify}></i>{access_token !== '' ? 'Enter' : 'Continue with Spotify'}
              </button>
            </div>
        </div>
      </div>
    );
  }
}

export default Spotify;
