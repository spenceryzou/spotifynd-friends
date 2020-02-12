import React, { Component } from 'react'
import Router from 'next/router'

var querystring = require('querystring');
var request = require('request')
var client_id = 'd96a1f34720b4d76b1ca3888aeb13bae';
var client_secret = '59a44667122e493ca8b244a7624bce4e';
var redirect_uri = 'http://localhost:3000/';
var scope = 'user-read-private user-read-email playlist-read-private';

class User extends Component{
    constructor(props) {
        super(props);
        this.state = {
          access_token: '',
          refresh_token: '',
          user: '',
          playlists: [],
          tracks: [],
          singleId: ''

        }

    }

    componentDidMount = () => {
        let url = window.location.href;
        if(url.indexOf('localhost') > -1){
            redirect_uri = 'http://localhost:3000/index'
        }
        if (url.indexOf('token') > -1) {
            let access_token = url.split('token=')[1];
    
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
                    
                    
                    console.log('this.state.playlists' + this.state.playlists)
                }); 

                
                
            var playlistTracks = {
                url: 'https://api.spotify.com/v1/playlists/34dbi6yGa8UfkFryC4rmhx/tracks' ,
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
            };

           

            request.get(playlistTracks, (error, response, body) => {
                console.log(body);
                this.setState({tracks: body.items})
                console.log('this.state.tracks' + this.state.tracks)
            }); 

            
            });    

        }
    }



  
      
        getButtonsUsingForLoop = (num) => {
          const array = []
      
          for(var i = 1; i <= num; i++){
            array.push(<button>{i}</button>)
          }
      
          return array
        }


    render(){
         const playlists = this.state.playlists.map((i) => 
             <plaintext>{i.tracks.href}</plaintext>
         )

        
        const tracks = this.state.tracks.map((x) => 
        <li>{x.track.artists[0].id}</li> )

        const JSON = require('circular-json');

        const plists = JSON.stringify(playlists);

        
    

        return (
            <div>
                <p>This is where user information will be displayed.</p>
                {/* <p className="text-center">username: {user.display_name}</p>
                    <p className="text-center">email: {user.email}</p>
                    <p className="text-center">follower count: {user.followers.total}</p> */}
                <p>Access Token: {this.state.access_token}</p>
                <p>User ID: {this.state.user}</p>
                <p>Playlists:</p>
                <ul>{playlists}</ul>

                <p>Playlist Artist Tracks Id's: </p>
                <ul>{tracks}</ul>


                <p>random test: {plists}</p>
               
                
            </div>
        )
    }
};



export default User

