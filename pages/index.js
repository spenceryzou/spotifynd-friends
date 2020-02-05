import React, { Component } from 'react'
import Router from 'next/router'
//import { spotifyWebApiURL } from '../constants/'

var querystring = require('querystring');

var client_id = '2923d79235804ea58633989710346f3d'; // Your client id
var client_secret = 'd4813d196edf4940b58ba0aeedbf9ebc'; // Your secret
var redirect_uri = 'https://spotifynd-friends.herokuapp.com/';
var scope = 'user-read-private user-read-email';

class Spotify extends Component {

    constructor(props) {
        super(props);
        this.state = {
            access_token: ''
        }
    }

    
    componentDidMount = () => {
        let url = window.location.href
        if(url.indexOf('code')>-1){            
            let access_token = url.split('_token=')[1].split("&")[0].trim()
            this.setState({ access_token })
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

export default Spotify;