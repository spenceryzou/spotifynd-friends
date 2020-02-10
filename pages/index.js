import React, { Component } from 'react'
import Router from 'next/router'

var querystring = require('querystring');
var request = require('request')
var client_id = 'd96a1f34720b4d76b1ca3888aeb13bae';
var client_secret = '59a44667122e493ca8b244a7624bce4e';
var redirect_uri = 'http://localhost:3000/';
var scope = 'user-read-private user-read-email';

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
        query: { access_token }
      })
    }
  }

  render() {
    const { access_token } = this.state
    return (

      <div className="row justify-content-center mt-5">
        <button onClick={event => this.makeSpotifyProfileCall(event)} className="btn btn-success">
          {access_token !== '' ? 'Click to enter Spotifynd' : 'Login'}
        </button>
      </div>
    );
  }
}

export default Spotify;