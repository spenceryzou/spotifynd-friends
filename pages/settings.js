import React, { Component } from 'react'
import Router from 'next/router'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { FormGroup, ControlLabel, FormControl } from "react-bootstrap";


var querystring = require('querystring');

var request = require('request')
//default setting of top playlist object and location are set to null
//taking in user input and setting to variables which will be inputted into database later on
//when plalist is null, then user will need to change

class Settings extends Component{
  constructor(props) {
      super(props);
      this.state = {
        access_token: this.props.url.query.access_token,
        refresh_token: '',
        playlists: [],
        topPlaylist: null,
        location: 'teststring'
      }
    }
  componentDidMount = () => {
    this.getUserPlaylists();
  }
  handlePlaylistChange = (event) => {
    let playlist = this.state.playlists.find(p => p.name === event.target.value)
    console.log("value: " + event.target.value)
    console.log("playlist: " + playlist.name)
     //this.setState({topPlaylist: playlist})
    this.state.topPlaylist = playlist
    console.log(JSON.stringify(event.target.value))
    console.log("top: " + this.state.topPlaylist.name)
  }
  handleLocationChange = (event) => {
    this.state.location = event.target.value;
    console.log("Location"+this.state.location)
  }

  setTopPlaylist = (data) =>{
    console.log("in test")
    console.log("data" + data.name)
    // this.setState({topPlaylist: data})
    // this.setState({location: data.id})
    this.state.topPlaylist = data
    console.log(this.state.topPlaylist)
  }

  getUserPlaylists = () => {
    let access_token = this.state.access_token
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

  render(){
    let playlists = this.state.playlists;

    let locations = ["Bay Area", "Orange Country", "Santa Barbara","Other"];
    let items2 = locations.map((i) =>
    <option
      value = {i}
    >
    {i}
    </option>

    );


    let formItems = playlists.map((data) =>
    <option
        key={data.id}
        value={data.name}
    >
        {data.name}
    </option>
    );

    return (
      <div>
      <head>
        <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
        crossorigin="anonymous"
          />
      </head>

      <div className="row justify-content-center mt-4">

      <Form>
        <Form.Group controlId="exampleForm.ControlSelect1">
          <Form.Label>Location</Form.Label>
          <Form.Control
          as="select"
          onChange ={this.handleLocationChange}
          >
            {items2}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="exampleForm.ControlSelect1">
          <Form.Label>Select Playlist</Form.Label>
          <Form.Control
          as="select"
          onChange ={this.handlePlaylistChange}
          >
            {formItems}
          </Form.Control>
        </Form.Group>
      </Form>
      
      </div>


      </div>


    )
  }



}
export default Settings;
