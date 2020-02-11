import React, { Component } from 'react'
import Router from 'next/router'

var request = require('request')
var client_id = '2923d79235804ea58633989710346f3d';
var client_secret = 'd4813d196edf4940b58ba0aeedbf9ebc';
var top100 = '37i9dQZF1DXcBWIGoYBM5M';

class User extends Component{
  constructor(props) {
    super(props);
    this.state = {
      access_token: this.props.url.query.access_token,
      refresh_token: '',
      playlist: null,
      playlistName: '',
      playlistDescription: '',
    }

}



  componentDidMount(){

    this.get100()
    //console.log(this.state.access_token)

  }

  get100 = () =>{

    var options  = {
      url: 'https://api.spotify.com/v1/playlists/'+ top100,
      headers: { 'Authorization': 'Bearer ' + this.state.access_token },
      json:true
    };

    request.get(options, (error, response, body) =>{
      console.log(error)
      //console.log("Access token:" + access_token)
      //console.log(body);

      this.setState({
        playlist: body,
        playlistName: body.name,
        playlistDescription: body.description
      })
      //console.log("This is the playlist object"+ this.state.playlist)

    });
  }


  render(){
    return (

        <div>
            <p>This is where user information will be displayed.The access token is {this.state.access_token}</p>
            <p>This is the playlist name {this.state.playlistName}</p>
            <p>This is the description of said playlist {this.state.playlistDescription}</p>
        </div>
    )
  }

};

export default User
