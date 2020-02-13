import React, { Component } from 'react'
import Router from 'next/router'

var request = require('request')
var client_id = '2923d79235804ea58633989710346f3d';
var client_secret = 'd4813d196edf4940b58ba0aeedbf9ebc';
var top100 = '37i9dQZF1DXcBWIGoYBM5M';
var top100tracknames = [];
class User extends Component{
  constructor(props) {
    super(props);
    this.state = {
      access_token: this.props.url.query.access_token,
      refresh_token: this.props.url.query.refresh,
      playlist: null,
      playlistName: '',
      playlistDescription: '',
      playlistTracks: []
    }

    console.log( this.props.url.query);

}



  componentDidMount(){

    this.get100()


  }
  getTrackName= () => {

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
        playlistTracks: [...this.state.playlistTracks, ...[1,2,3]]
      })


      console.log(body.tracks.items);
      //console.log(body.tracks.items[0].track.name)
    });
    console.log("This is the old access_token:"+this.state.access_token);
    //this.refresh();


  }


  render(){

    return (

        <div>
            <p>This is where user information will be displayed.The access token is {this.state.access_token}</p>
            <p>This is the playlist name {this.state.playlistName}</p>
            <p>This is the description of said playlist {this.state.playlistDescription}</p>
            <p> top100 playlist name of tracks </p>
            <ul>{this.state.playlistTracks}</ul>

        </div>



    )
  }

};

export default User
