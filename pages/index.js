import React, { Component } from 'react'
import Router from 'next/router'
import fetch from 'isomorphic-unfetch'

//import { spotifyWebApiURL } from '../constants/'

var querystring = require('querystring');
var SpotifyWebApi = require('spotify-web-api-node');
var client_id ='2923d79235804ea58633989710346f3d';
var redirect_uri = 'https://spotifynd-friends.herokuapp.com/';
var credentials = {
  clientId : '2923d79235804ea58633989710346f3d',
  clientSecret : 'd4813d196edf4940b58ba0aeedbf9ebc',
  redirectUri : 'https://spotifynd-friends.herokuapp.com/'
};
var spotifyApi = new SpotifyWebApi(credentials);

var scope = 'user-read-private user-read-email';

class Spotify extends Component {

    constructor(props) {
        super(props);
        this.state = {
            access_token: '',
            url: this.props.location
        }
    }

    
     componentDidMount = () => {
         if(url.indexOf('code')>-1){            
             //code = url.substring(url.indexOf('=') + 1, url.lastIndexOf('&'))
             let code = url.split('code=')[1].split("&")[0].trim()
             let data = {
              grant_type: 'authorization_code',
              code: code,
              redirectUri: redirectUri
             }
             const res = await fetch('https://accounts.spotify.com/api/token', {
              method: 'POST',
              headers: {
                 Authorization: 'Authorization: Basic ' + (new Buffer(client_id + ':' + clientSecret).toString('base64'))
              },
              body: JSON.stringify(data)
             })
             this.state.access_token = res.access_token
             console.log(this.state.access_token)
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
        if(access_token===''){
            window.location = 'https://accounts.spotify.com/authorize?' +
            querystring.stringify({
              response_type: 'code',
              client_id: client_id,
              scope: scope,
              redirect_uri: redirect_uri,
              state: this.generateRandomString(16)
            });
        }else{
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
                        { access_token !== '' ? 'Click to enter Spotifynd' : 'Login' }
                    </button>
                </div>
        );
    }
}


/*var SpotifyWebApi = require('spotify-web-api-node');

var credentials = {
  redirectUri : 'https://spotifynd-friends.herokuapp.com/',
  clientId : '2923d79235804ea58633989710346f3d',
  clientSecret : 'd4813d196edf4940b58ba0aeedbf9ebc'
};
var scopes = ['user-read-private', 'user-read-email'];
var state = 'some-state-of-my-choice';

var spotifyApi = new SpotifyWebApi(credentials);
var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
console.log(authorizeURL);

var code = 'AQCgJdgpnp5j0nm16PEZlbOw9rK6_XeXQyqAP4VdIuCrHTevRZMxUgNZGUYMn0SB80KT90F958ObO3vqUz9Bw5I47gC_8pUbjaFYDLnhRfrtRQJefSr8MXJKTQHrzt3L948WWi2q33Ok2fqre3BO1NKFmT10ZmX2rWqY08o3PbmCM6BjDj6gTruQ72cU4UxjNir63W2D11VrI5G3_QfYdqfA0JV7zaDLPnVikDg0DHULWT5SjuShViY2wx1-PLSkf2c'

spotifyApi.authorizationCodeGrant(code).then(
  function(data) {
    console.log('The token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);
    console.log('The refresh token is ' + data.body['refresh_token']);

    // Set the access token on the API object to use it in later calls
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);
  },
  function(err) {
    console.log('Something went wrong!', err);
  }
);*/

export default Spotify;
