import React, { Component } from 'react'
import Router from 'next/router'

var request = require('request')
var client_id = '2923d79235804ea58633989710346f3d';
var client_secret = 'd4813d196edf4940b58ba0aeedbf9ebc';
var top100 = '37i9dQZF1DXcBWIGoYBM5M';
class User extend Component(){

  constructor(props) {
    super(props);
    this.state = {
      access_token: this.props.url.query,
      refresh_token: '',
      playlist: null,
    }
  }
  componentDidMount(){
    this.get100()
  }

  get100 = () =>{

    var options  = {
      url: 'https://api.spotify.com/v1/playlists/'+ top100,
      headers: { 'Authorization': 'Bearer ' + access_token },
      json:true
    }

    request.get(options, function (error, response, body){
      console.log(error)
      console.log("Access token": + access_token)
      console.log(body)

      this.setState({
        playlist: body.playlist,
        console.log("This is the playlist object"+ this.state.playlist)
      })

    });
  }




    return (
        <div>
            <p>This is where user information will be displayed.The access token is {this.state.access_token}</p>
            <p> playlist name : {this.state.playlist.name}</p>
            <p> This is the description of the playlist: {this.state.playlist.description}</p>

        </div>
    )

};

export default User
