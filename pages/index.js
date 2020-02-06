import React, { Component } from 'react'
import Router from 'next/router'
import fetch from 'isomorphic-unfetch';
//import { spotifyWebApiURL } from '../constants/'
const port = process.env.PORT || 5000;
var querystring = require('querystring');
var client_id ='2923d79235804ea58633989710346f3d';
var redirect_uri = 'https://spotifynd-friends.herokuapp.com/';

var scope = 'user-read-private user-read-email';

class Spotify extends Component {

  static async getInitialProps({req}) {
    let fullUrl
    if (req) {
       // Server side rendering
       fullUrl = req.protocol + '://' + req.get('host')
     } else {
       // Client side rendering
       fullUrl = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port: '')
     }
     return { fullUrl: fullUrl }
   }

    constructor(props) {
        super(props);
        this.state = {
            access_token: ''
        }
    }

    componentDidMount = () => {
         let url = window.location.href;
         if(url.indexOf('code')>-1){    
            console.log('inside if')
            this.getAccess()       
             //code = url.substring(url.indexOf('=') + 1, url.lastIndexOf('&'))
         }
    }
    
    getAccess = () => {
      const res = await fetch(this.props.fullUrl + "/access")
      const json = await res.json()
      this.setState({ access_token: json.at });
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
export default Spotify;

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


