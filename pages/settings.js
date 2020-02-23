import React, { Component } from 'react'
import Router from 'next/router'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'

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
    let items = playlists.map((data) =>
    <Dropdown.Item
        key={data.id}
        value={data.id}
        onClick={() => this.setTopPlaylist(data)}
    >
        {data.name}
    </Dropdown.Item>
    );
    let locations = ["Bay Area", "Orange Country", "Santa Barbara","Other"];
    let items2 = locations.map((i) =>
    <Dropdown.Item
      onClick={() => this.setState({location:i})}
    >
    {i}
    </Dropdown.Item>

    );
    console.log(this.state.location);

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
      <div className="row justify-content-center mt-5">

      <DropdownButton id="dropdown-basic-button" title="Dropdown button">
        {/* <Dropdown.Item eventKey="1" onClick={() => this.testMethod()}>Action</Dropdown.Item>
        <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
        <Dropdown.Item eventKey="3" active>
          Active Item
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item eventKey="4">Other</Dropdown.Item> */}
        {items}
      </DropdownButton>

      </div>
      <div className="row justify-content-center mt-4">
      <DropdownButton id ="dropdown-basic-button" title = "Location">

      {items2}
      </DropdownButton>
      </div>

      </div>


    )
  }



}
export default Settings;
