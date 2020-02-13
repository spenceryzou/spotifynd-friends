import React, { Component } from 'react'
import Router from 'next/router'

var querystring = require('querystring');
var request = require('request')
var client_id = '2923d79235804ea58633989710346f3d';
var client_secret = 'd4813d196edf4940b58ba0aeedbf9ebc';
var redirect_uri = 'https://spotifynd-friends.herokuapp.com/';
var scope = 'user-read-private user-read-email playlist-read-private';

class User extends Component{
    constructor(props) {
        super(props);
        this.state = {
          access_token: '',
          refresh_token: '',
          user: '',
          playlists: []
        }

    }

    componentDidMount = () => {
        let url = window.location.href;
        if(url.indexOf('localhost') > -1){
            redirect_uri = 'http://localhost:3000/index'
        }
        if (url.indexOf('token') > -1) {
            let access_token = url.split('token=')[1];
    
            // var authOptions = {
            //     url: 'https://accounts.spotify.com/api/token',
            //     form: {
            //     code: code,
            //     redirect_uri: redirect_uri,
            //     grant_type: 'authorization_code'
            //     },
            //     headers: {
            //     'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            //     },
            //     json: true
            // };

        //   request.post(authOptions, (error, response, body) => {
        //     if (!error && response.statusCode === 200) {
    
        //       access_token = body.access_token,
        //         refresh_token = body.refresh_token;
        //       this.setState({
        //         access_token: access_token,
        //         refresh_token: refresh_token
        //       });
    
        //       var options = {
        //         url: 'https://api.spotify.com/v1/me',
        //         headers: { 'Authorization': 'Bearer ' + access_token },
        //         json: true
        //       };
    
        //       // use the access token to access the Spotify Web API
        //       request.get(options, function (error, response, body) {
        //           console.log('Access token:' + access_token)
        //         console.log(body);
        //       });
        //     }
        //   });

            this.setState({access_token})

            var options = {
                url: 'https://api.spotify.com/v1/me',
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
            };

            // use the access token to access the Spotify Web API
            request.get(options, (error, response, body) => {
                console.log('Access token:' + access_token)
                console.log(body);
                this.setState({user: body.id})
                console.log('user: ' + this.state.user)
                var playlistOptions = {
                    url: 'https://api.spotify.com/v1/users/' + this.state.user + '/playlists',
                    qs: {limit: '10'},
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                };

                console.log('user right before playlist: ' + this.state.user)

                // use the access token to access the Spotify Web API
                request.get(playlistOptions, (error, response, body) => {
                    console.log(body);
                    this.setState({playlists: body.items})
                    for(var i = 0; i < this.state.playlists.length; i++){
                        this.state.playlists[i].key = i.id
                        console.log(this.state.playlists[i].key)
                    }
                    console.log('this.state.playlists' + this.state.playlists)
                }); 
            });    

        }
    }

    createButton = (i) => {
        console.log(this.state.playlists[i].tracks.href)
    }

    render(){
        let playlists;
        if(typeof(this.state.playlists) != 'undefined'){
            if(this.state.playlists.length != 0){
                playlists = this.state.playlists.map((i, index) =>
                <div>
                    <li>
                        {i.name}
                        <button onClick={() => this.createButton(index)}>
                            Select
                        </button>
                    </li>
                </div>
                )
            }else{
                playlists = <p>No playlists to display</p>
            }
        } 

        return (
            <div>
                <p>This is where user information will be displayed.</p>
                <p>Access Token: {this.state.access_token}</p>
                <p>User ID: {this.state.user}</p>
                <p>Playlists:</p>
                <ul>{playlists}</ul>
            </div>
        )
    }
};

/* User.getInitialProps = async function(context){
    console.log(context.rawHeaders)
    let access_token = context.query.access_token;
    let refresh_token = '';
    let user = '';
    let playlists = [];
    //if(context.headers.host.indexOf('localhost') > -1){
        redirect_uri = 'http://localhost:3000/index'
    //}

    var options = {
        url: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
    };

        // use the access token to access the Spotify Web API
    await request.get(options, (error, response, body) => {
        console.log('Access token:' + access_token);
        console.log(body);
        user = body.display_name;
        var playlistOptions = {
            url: 'https://api.spotify.com/v1/users/' + user + '/playlists',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
        };

        console.log('user right before playlist: ' + user)

        // use the access token to access the Spotify Web API
        request.get(playlistOptions, (error, response, body) => {
            console.log(body);
            playlists = body.items
            console.log(playlists)
        }); 

    

    });

    console.log('user at end of init: ' + user)
    
    return {
        user,
        playlists,
        access_token
    }
} */

export default User