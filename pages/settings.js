import React, { Component } from 'react'
import Router from 'next/router'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { FormGroup, ControlLabel, FormControl } from "react-bootstrap";
import Image from 'react-bootstrap/Image'
import Header from '../components/Header'


var auth = require('firebase/auth');
var database = require('firebase/database');
var firebase = require('firebase/app');
//var admin = require("firebase-admin");


var querystring = require('querystring');

var request = require('request')
//default setting of top playlist object and location are set to null
//taking in user input and setting to variables which will be inputted into database later on
//when plalist is null, then user will need to change

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      access_token: this.props.url.query.access_token,
      refresh_token: '',
      playlists: [],
      topPlaylist: null,
      location: 'teststring',
      image: ''
    }

    let firebaseConfig = {
      apiKey: "AIzaSyALCCNzdyD4Apeqk3N-yl8tS4XY4VAes2o",
      authDomain: "spotifynder-5789e.firebaseapp.com",
      databaseURL: "https://spotifynder-5789e.firebaseio.com",
      projectId: "spotifynder-5789e",
      storageBucket: "spotifynder-5789e.appspot.com",
      messagingSenderId: "638228066900",
      appId: "1:638228066900:web:bdefeb93c221a1280d33c1",
      measurementId: "G-D2B3QV491R"
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig)
    }
    console.log(firebase)
  }



  componentDidMount = () => {

    //var userRef = firebase.database().ref("users/" + this.state.user + '/spotify_id')

    this.getUserPlaylists();

    // var aDatabase = firebase.database();
    // var mDatabase = aDatabase.ref();

    // var myRef =  mDatabase.child('gubybean').child('location');
    // console.log(myRef)

    // userRef.on("value", snapshot => {
    //   const userid = snapshot.val();
    //   console.log(userid);
    //   this.setState(() => ({ location: userid }));
    // });





    //console.log(userid)
    //  this.state.location = locationVal




  }


  writeUserLocation = (userid, userlocation) => {
    var database = firebase.database();


    firebase.database().ref('users/' + this.state.user).set({
      spotify_id: this.state.user,
      location: userlocation,
      topPlaylist: ''


    }, function (error) {
      if (error) {
        // The write failed...
      } else {
        // Data saved successfully!
      }
    }

    );


  }





  writeUserTopPlaylist = (userid, top_playlist) => {
    var database = firebase.database();
    firebase.database().ref('users/' + userid).set({
      spotify_id: this.state.user,
      location: this.state.location,
      topPlaylist: top_playlist


    }, function (error) {
      if (error) {
        // The write failed...
      } else {
        // Data saved successfully!
      }
    }

    );
  }



  displayImage = () => {

    playlistImage = (<img src={this.state.image} />)
  }

  handlePlaylistChange = (event) => {
    let playlist = this.state.playlists.find(p => p.name === event.target.value)
    console.log("value: " + event.target.value)
    console.log("playlist: " + playlist.name)
    this.state.topPlaylist = playlist
    console.log(JSON.stringify(event.target.value))
    console.log("top: " + this.state.topPlaylist.name)
    this.state.image = playlist.images[0].url
    console.log(this.state.image)
    this.forceUpdate();
  }

  handleLocationChange = (event) => {
    this.state.location = event.target.value;
    console.log("Location" + this.state.location)
  }

  setTopPlaylist = (data) => {
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
      this.setState({ user: body.id })
      console.log('user: ' + this.state.user)

      var dbRef = firebase.database().ref('users')
      console.log(this.state.user)

      var user_id = this.state.user

      dbRef.child(user_id).once("value", snapshot => {
        if (snapshot.exists()) {
          const userLocation = snapshot.val().location;
          const userTopPlaylist = snapshot.val().playlist;
          console.log("exists!", userLocation);
          if (userLocation != null) {
            this.state.location = userLocation
            console.log(this.state.location)
          }
          if (userTopPlaylist != null) {
            this.state.topPlaylist = userTopPlaylist
          }


        }
      });

      // var locationVal

      // firebase.database().ref('/users/' + this.state.user).once('value').then(function(snapshot)  {
      //    locationVal = ( snapshot.val().location) 
      //    console.log(locationVal)
      //  }
      //  );
      //  console.log(locationVal)
      //  this.state.location = locationVal

      var playlistOptions = {
        url: 'https://api.spotify.com/v1/users/' + this.state.user + '/playlists',
        qs: { limit: '10' },
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
      };

      console.log('user right before playlist: ' + this.state.user)

      // use the access token to access the Spotify Web API
      request.get(playlistOptions, (error, response, body) => {
        console.log(body);
        this.setState({ playlists: body.items })
        for (var i = 0; i < this.state.playlists.length; i++) {
          this.state.playlists[i].key = i.id
          console.log(this.state.playlists[i].key)
        }
        console.log('this.state.playlists' + this.state.playlists)
      });
    });
  }

  render() {
    let playlists = this.state.playlists;

    let locations = ["Bay Area", "Orange Country", "Santa Barbara", "Other"];
    let items2 = locations.map((i) =>
      <option
        value={i}
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
        <Header />
        <head>
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
            integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
            crossorigin="anonymous"
          />
        </head>

        <div className="row justify-content-center mt-5">
          <h1>{this.state.user}</h1>
        </div>

        <div className="row justify-content-center mt-4">

          <Form>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Location</Form.Label>
              <Form.Control defaultValue={-1}
                as="select"
                onChange={this.handleLocationChange}
              >
                <option disabled value={-1} key={-1}>Select a Location</option>
                {items2}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Select Playlist</Form.Label>
              <Form.Control defaultValue={-1}
                as="select"
                onChange={this.handlePlaylistChange}
                placeholder="select a playlist">
                <option disabled value={-1} key={-1}>Select a Playlist</option>
                {formItems}
              </Form.Control>
            </Form.Group>
          </Form>
        </div>

        <div className="row justify-content-center mt-5">
          <img src={this.state.image} />
        </div>
      </div>

    )
  }



}
export default Settings;
