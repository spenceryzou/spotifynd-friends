import React, { Component } from 'react'
import Router from 'next/router'

var querystring = require('querystring');
var request = require('request')
var client_id = '2923d79235804ea58633989710346f3d';
var client_secret = 'd4813d196edf4940b58ba0aeedbf9ebc';
var redirect_uri = 'https://spotifynd-friends.herokuapp.com/';
var scope = 'user-read-private user-read-email playlist-read-private';
var top100 = '37i9dQZF1DXcBWIGoYBM5M';


class User extends Component{
    constructor(props) {
        super(props);
        this.state = {
          access_token: this.props.url.query.access_token,
          refresh_token: '',
          user: '',
          playlists: [],
          playlist: null,
          playlistName: '',
          playlistDescription: '',
          playlistTracks: [],
          top100tracknames: [],
          playlisttracknames: [],
          count: -1
        }
    }

    componentDidMount = () => {
        this.getUserPlaylists();
        this.get100();
    }

    getUserPlaylists = () => {
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
                    for(var i = 0; i < this.state.playlists.length; i++){
                        this.state.playlists[i].key = i.id
                        console.log(this.state.playlists[i].key)
                    }
                    console.log('this.state.playlists' + this.state.playlists)
                });
            });

        }
    }
    assignPlaylistTracksName = (items) => {
        if(typeof(items) != 'undefined'){
            if(items != 0){
                this.state.playlisttracknames = items.map((i) =>
                <li>{i.track.id}</li>
                )
            }else{
                this.state.playlisttracknames = <p>No playlists to display</p>
            }
        }
    }    
    
    comparePlaylists = () => {
        let c = 0;
        for(let i = 0; i < this.state.playlisttracknames.length; i++){
            for(let j = 0; j < this.state.top100tracknames.length; j++){
                if(this.state.playlisttracknames[i].props.children == this.state.top100tracknames[j].props.children){
                    c++;
                }
            }
        }
        this.setState({count: c});
    }
    
    getPlaylistTracks = (i) => {
        console.log(this.state.playlists[i].tracks.href)
        var tracksOptions = {
            url: this.state.playlists[i].tracks.href,
            headers: { 'Authorization': 'Bearer ' + this.state.access_token },
            json: true
        };

        console.log('user right before tracks request: ' + this.state.user)

        // use the access token to access the Spotify Web API
        request.get(tracksOptions, (error, response, body) => {
            console.log(body);
            // this.setState({playlists: body.items})
            // for(var i = 0; i < this.state.playlists.length; i++){
            //     this.state.playlists[i].key = i.id
            //     console.log(this.state.playlists[i].key)
            // }
            console.log('this.state.playlists' + this.state.playlists)
            this.assignPlaylistTracksName(body.items);
            this.comparePlaylists();       
            console.log(this.state.count);
            console.log(this.state.playlisttracknames);
        }); 

    }


    refresh = () => {
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        form: {
          grant_type: 'refresh_token',
          refresh_token: this.state.refresh_token,
        },
        json: true
      };

    request.post(authOptions, (error, response, body) => {
      console.log(error);
      if (!error && response.statusCode === 200) {

        this.setState({
          access_token: body.access_token
          });
        }
      });
      console.log("This is the new access_token"+ this.state.access_token);
    } 

    get100 = () =>{
      //if(this.state.access_token == undefined){
      //  console.log("Is undefined");
      //  this.refresh();
      //}
      let url = window.location.href;
      if(url.indexOf('localhost') > -1){
          redirect_uri = 'http://localhost:3000/index'
      }
      if (url.indexOf('token') > -1) {
          let access_token = url.split('token=')[1];

          this.setState({access_token})

          var options  = {
            url: 'https://api.spotify.com/v1/playlists/'+ top100,
            headers: { 'Authorization': 'Bearer ' + this.state.access_token },
            json:true
          };

          request.get(options, (error, response, body) =>{
            console.log(error);
            console.log(body);

            this.setState({
              playlist: body,
              playlistName: body.name,
              playlistDescription: body.description,
              playlistTracks: body.tracks.items
            })

          });
        }
    }



    assigntop100tracknames = () => {
      if(typeof(this.state.playlistTracks) != 'undefined'){
           if(this.state.playlistTracks != 0){
               this.state.top100tracknames = this.state.playlistTracks.map((i) =>
               <li>{i.track.id}</li>
               )
           }else{
               this.state.top100tracknames= <p>No playlists to display</p>
           }
       }
    };

    goToSettings = () => {
        let access_token = this.state.access_token;
        Router.push({
            pathname: '/settings',
            query: { access_token } 
        })
    }

    render(){
        let playlists;
        if(typeof(this.state.playlists) != 'undefined'){
            if(this.state.playlists.length != 0){
                playlists = this.state.playlists.map((i, index) =>
                <div>
                    <li>
                        {i.name}
                        <button onClick={() => this.getPlaylistTracks(index)}>
                            Select
                        </button>
                    </li>
                </div>
                )
            }else{
                playlists = <p>No playlists to display</p>
            }
        }
        this.assigntop100tracknames();
        var message = `Songs in common: ${this.state.count}`
        if (this.state.count == 0){
            message = "This playlist has no songs in common with \"Today\'s Top Hits\"."
        } else if(this.state.count < 0){
            message = ''
        }
        

        return (
            <div>
                <button onClick={() => this.goToSettings()}>
                    Settings
                </button>
                <p>This is where user information will be displayed.</p>
                <p>Access Token: {this.state.access_token}</p>
                <p>User ID: {this.state.user}</p>
                <p>Playlists:</p>
                <ul>{playlists}</ul>
                <p>{message}</p>
            </div>
        )
    }
};

export default User
