import React, { Component } from 'react'
import Router from 'next/router'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import { FormGroup, ControlLabel, FormControl, Card ,Container, Row, Col} from "react-bootstrap";
import {Modal} from "react-bootstrap";
import Image from 'react-bootstrap/Image'
import Header from '../components/Header'
import axios from 'axios';
import { runInThisContext } from 'vm'
import Footer from '../components/Footer'

var auth = require('firebase/auth');
var database = require('firebase/database');
var firebase = require('firebase/app');
//var admin = require("firebase-admin");
var redirect_uri;



var querystring = require('querystring');
var request = require('request')
//default setting of top playlist object and location are set to null
//taking in user input and setting to variables which will be inputted into database later on
//when plalist is null, then user will need to change

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      access_token: '',
      refresh_token: '',
      playlists: [],
      playlistTracks: [],
      playlisttracknames: [],
      topPlaylist: null,
      instagram: '',
      location: 'no location set, please set on below',
      image: '',
      userImage: '',
      displayName: '',
      display:  null,
      playlistUpdated: false,
      percentage:0,
      data: {

        labels: [
            'Dancibility',
            'Energy',
            'Acousticness',
            'Liveness',
            'Valence'
        ],
        datasets: [{
            hidden: true,
            data: [0, 0, 0, 0, 0],
            backgroundColor: [
                '#66c2a4',
                '#41ae76',
                '#238b45',
                '#006d2c',
                '#00441b'
                ],
                hoverBackgroundColor: [
                '#edf8fb',
                '#edf8fb',
                '#edf8fb',
                '#edf8fb',
                '#edf8fb'
            ]
        }]
    },
    trackFeatures: [],
    genres: [],
    artistID: [],
    name: [],
    artist: [],

    }
    const firebaseConfig = {
      apiKey: "AIzaSyCBmjWVAetSGAQ2E7uE0oh5_lG--ogkWbc",
      authDomain: "spotifynd-friends.firebaseapp.com",
      databaseURL: "https://spotifynd-friends.firebaseio.com",
      projectId: "spotifynd-friends",
      storageBucket: "spotifynd-friends.appspot.com",
      messagingSenderId: "775203379545",
      appId: "1:775203379545:web:2e74554d15a4b1c3675448",
      measurementId: "G-QL50LT5KSH"
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig)
    }
    console.log(firebase)
  }

  static getInitialProps({query}){
    console.log("query " + JSON.stringify({query}))
    return {query}
  }

  componentDidMount = () => {

    //var userRef = firebase.database().ref("users/" + this.state.user + '/spotify_id')
    if(!window.sessionStorage.access_token){
      Router.push({pathname: '/'})
    } else{
      this.getUserPlaylists();
    }

  }

  writeUserDisplayName = (userid, displayName) => {
    firebase.database().ref('users/' + this.state.user).update({
        'displayName': displayName,

      }, function (error) {
        if (error) {
          // The write failed...
        } else {
          console.log("Updated displayName: " + displayName);
        }
      }
    );
  }

  writeUserLocation = (userid, userlocation) => {
    firebase.database().ref('users/' + this.state.user).update({
        'location': userlocation,

      }, function (error) {
        if (error) {
          // The write failed...
        } else {
          console.log("Updated location: " + userlocation);
        }
      }
    );
  }

  writeUserImage = (userid, userImage) => {
    firebase.database().ref('users/' + this.state.user).update({
        'image': userImage,
        
      }, function (error) {
        if (error) {
          // The write failed...
        } else {
          console.log("Updated location: " + userImage);
        }
      }
    );
  }

  writeUserTopPlaylist = (userid, top_playlist) => {
    var database = firebase.database();
    firebase.database().ref('users/' + userid).update({
        'topPlaylist': top_playlist,
      }, function (error) {
        if (error) {
          // The write failed...
        } else {
          console.log("Updated top playlist: " + top_playlist);
        }
      }
    );
  }

  displayImage = () => {
    playlistImage = (<img src={this.state.image} />)
  }

  handlePlaylistChange = async(event) => {

    let playlist = this.state.playlists.find(p => p.name === event.target.value)
    console.log("value: " + event.target.value)
    console.log("playlist: " + playlist.name)
    this.state.topPlaylist = playlist
    this.writeUserTopPlaylist(this.state.user, this.state.topPlaylist.id)

    let url = window.location.href;
    if (url.indexOf('localhost') > -1) {
        redirect_uri = 'http://localhost:3000/index'
    }

    let access_token = window.sessionStorage.access_token

    if (access_token != "") {
        var options = {
            url: 'https://api.spotify.com/v1/playlists/' + this.state.topPlaylist.id,
            headers: { 'Authorization': 'Bearer ' + window.sessionStorage.access_token },
            json: true
        };

        request.get(options, (error, response, body) => {
            console.log(error);
            console.log(body);

            this.setState({
                playlistTracks: body.tracks.items
            })

        });
    }
    this.getPlaylistTracks()
    console.log(this.state.playlisttracknames)
    this.updatePlaylistStatus();



    console.log(JSON.stringify(event.target.value))
    console.log("top: " + this.state.topPlaylist.name)
    //this.state.image = playlist.images[0].url
    //this.state.display = playlist
    this.setState({
      image: playlist.images[0].url,
      display: playlist
    })
    console.log(this.state.image)
    //this.forceUpdate();
  }


  getPlaylistTracks = () => {
    this.setState({data: {
        labels: [
            'Dance',
            'Energy',
            'Acoustic',
            'Live',
            'Valence'
        ],
        datasets: [{
            data: [0, 0, 0, 0, 0],
            backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            'Green',
            'Orange',
            'Purple'
            ],
            hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            'Grey',
            'Cyan',
            'Brown'
            ]
        }]}})
    console.log(this.state.topPlaylist)
    var tracksOptions = {
        url: this.state.topPlaylist.tracks.href,
        headers: { 'Authorization': 'Bearer ' + window.sessionStorage.access_token },
        json: true
    };

    console.log('user right before tracks request: ' + this.state.user)

    // use the access token to access the Spotify Web API
    request.get(tracksOptions, (error, response, body) => {
        console.log(body);
        console.log('this.state.playlists' + this.state.topPlaylist)
        this.assignPlaylistTracksName(body.items);

      });


}

assignPlaylistTracksName = async(items) => {
  if (typeof (items) != 'undefined') {
      if (items != 0) {
          this.state.playlisttracknames = items.map((i) =>
              <li>{i.track.id}</li>
          )
      } else {
          this.state.playlisttracknames = <p>No playlists to display</p>
      }
      console.log("playlist track names: " + this.state.playlisttracknames.length)


      this.setState({
        trackFeatures: [],
        genres: [],
        artistID: [],
        name: [],
        artist: []

    })
    //create arrays with selected playlist attributes
    var plstL = this.state.playlisttracknames.length - 1;
    this.state.percentage = 0;
    for (let i = 0; i < this.state.playlisttracknames.length; i++) {
      this.state.percentage = (i/plstL)*100
      this.state.percentage = this.state.percentage.toFixed(1)


        var id = this.state.playlisttracknames[i].props.children;
        var trackOptions = {
            method: 'GET',
            url: `https://api.spotify.com/v1/tracks/${id}`,
            headers: { 'Authorization': 'Bearer ' + window.sessionStorage.access_token },
            json: true
        };
        var audioFeaturesOptions = {
            method: 'GET',
            url: `https://api.spotify.com/v1/audio-features/${id}`,
            headers: { 'Authorization': 'Bearer ' + window.sessionStorage.access_token },
            json: true
        };
        await axios(audioFeaturesOptions)
            .then((body) => {
                this.setState({ trackFeatures: [...this.state.trackFeatures, body.data] })
                console.log(this.state.trackFeatures);
            });

        await axios(trackOptions)
            .then((body) => {
                if (body.data.artists != 0) {
                    this.setState({
                        artistID: [...this.state.artistID, body.data.artists[0].id],
                        artist: [...this.state.artist, body.data.artists[0].name],
                        name: [...this.state.name, body.data.name],
                        status: "Analyzing Playlist 1: " + body.data.name
                    })
                    console.log(this.state.artistID);
                    console.log(this.state.artist)
                    console.log(this.state.name)
                }
            });
        var artistOptions = {
            method: 'GET',
            url: `https://api.spotify.com/v1/artists/${this.state.artistID[i]}`,
            headers: { 'Authorization': 'Bearer ' + window.sessionStorage.access_token },
            json: true
        };
        await axios(artistOptions)
            .then((body) => {
                this.setState({ genres: [...this.state.genres, body.data.genres] })
                /*this.state.genres = body.genres.map((i) =>
                <li>{i}</li>)*/
                console.log(this.state.genres)
            });
    }

    firebase.database().ref('users/' + this.state.user).update({
      'trackFeatures': this.state.trackFeatures,
      'genres': this.state.genres,
      'artistID': this.state.artistID,
      'name': this.state.name,
      'artist': this.state.artist,

    }, (error) => {
      if (error) {
        // The write failed...
      } else {
        console.log("Updated trackFeatures: ");
        this.handleModal();
        // this.setState({
        //   playlistUpdated: false
        // })

      }
    }

  );



  }




}


  updatePlaylistStatus = () =>{
    this.setState({
      playlistUpdated: !this.state.updatePlaylistStatus
    })

  }

  handleLocationChange = (event) => {
    //this.state.location = event.target.value;
    console.log(event.target.value)
    this.setState({
      location: event.target.value
    })
    this.writeUserLocation(this.state.user, event.target.value)

    console.log("Location" + this.state.location)
    //this.forceUpdate();
  }



  handleInstagramChange = (event) => {
    //this.state.location = event.target.value;
    console.log(event.target.value)
    this.setState({
      instagram: event.target.value
    })
    this.writeUserInstagram(this.state.user, event.target.value)

    console.log("Instagram" + this.state.instagram)
    //this.forceUpdate();
  }


  writeUserInstagram = (userid, userInstagram) => {
    firebase.database().ref('users/' + this.state.user).update({
        'instagram': userInstagram,

      }, function (error) {
        if (error) {
          // The write failed...
        } else {
          console.log("Updated Instagram: " + userInstagram);
        }
      }
    );
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
    let access_token = window.sessionStorage.access_token
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
      if(body.images.length != 0){
        this.setState({ userImage: body.images[0].url});
        this.writeUserImage(body.id, body.images[0].url);
      } else{
        this.writeUserImage(body.id, 'https://www.palmcityyachts.com/wp/wp-content/uploads/palmcityyachts.com/2015/09/default-profile.png');
      }
      this.setState({displayName: body.display_name});
      this.writeUserDisplayName(body.id, body.display_name);
      console.log('user: ' + this.state.user)

      var dbRef = firebase.database().ref('users')
      console.log(this.state.user)

      var user_id = this.state.user

      dbRef.child(user_id).once("value", snapshot => {
        if (snapshot.exists()) {
          const userLocation = snapshot.val().location;
          const userTopPlaylist = snapshot.val().topPlaylist;
          const userInstagram = snapshot.val().instagram;
          console.log("exists!", userLocation);
          if (userLocation != null) {
            this.state.location = userLocation
            console.log(this.state.location)
          }
          if(userInstagram != null){
            this.state.instagram = userInstagram
            console.log(this.state.instagram)

          }



          if (userTopPlaylist != null) {
            var options = {
              url: 'https://api.spotify.com/v1/playlists/'+userTopPlaylist,
              headers: { 'Authorization': 'Bearer ' + window.sessionStorage.access_token },
              json: true
            };

            // use the access token to access the Spotify Web API
            request.get(options, (error, response, body) => {
              console.log(body)
              this.setState( {
                display: body,
                image: body.images[0].url,
              })
              //console.log(this.state.display)
            });

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

      // var playlistOptions = {
      //   url: 'https://api.spotify.com/v1/users/' + this.state.user + '/playlists',
      //   qs: { limit: '10' },
      //   headers: { 'Authorization': 'Bearer ' + access_token },
      //   json: true
      // };

      // console.log('user right before playlist: ' + this.state.user)

      // // use the access token to access the Spotify Web API
      // request.get(playlistOptions, (error, response, body) => {
      //   console.log(body);
      //   this.setState({ playlists: body.items })
      //   for (var i = 0; i < this.state.playlists.length; i++) {
      //     this.state.playlists[i].key = i.id
      //     console.log(this.state.playlists[i].key)
      //   }
      //   console.log('this.state.playlists' + this.state.playlists)
      // });
      console.log('user: ' + this.state.user)
      var playlistOptions = {
          url: 'https://api.spotify.com/v1/users/' + this.state.user + '/playlists',
          qs: { limit: '50' },
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

          let playlistsLeft = body.total - 50;
          let numRequests = 1;
          while(playlistsLeft > 0){
              var playlistOptions = {
                  url: 'https://api.spotify.com/v1/users/' + this.state.user + '/playlists',
                  qs: { limit: '50', offset: 50 * numRequests },
                  headers: { 'Authorization': 'Bearer ' + access_token },
                  json: true
              };

              request.get(playlistOptions, (error, response, body) => {
                  this.setState({playlists: this.state.playlists.concat(body.items)})
              });

              playlistsLeft -= 50;
              numRequests++
          }
      });
    });
  }



  handleModal = () => {
    this.setState({
        playlistUpdated: !this.state.playlistUpdated
    })
  }

    goHome = () => {
      let access_token = window.sessionStorage.access_token;
      Router.push({
          pathname: '/user',
          query: { access_token }
      }, '/user'
      )
    } 

  render() {
    let playlists = this.state.playlists;


    let locations = ["Bay Area", "Orange County", "Santa Barbara", "Other"];
    let items2 = locations.map((i) =>
      <option
        value={i}
      >
        {i}
      </option>

    );


    let formItems = playlists.filter(function(obj){
      if(obj.public){
        return obj
      }
    }).map((data) =>
      <option
        key={data.id}
        value={data.name}
      >
        {data.name}
      </option>
    );
    let displayInfo = "no playlist set, please set on below"
    if (this.state.display){
      console.log("This worked")
      displayInfo = this.state.display.name
    }


    return (
      <html>
      <div className = "testclass">

      <style jsx>{`
          .container {
              margin: 50px;
          }
          .testclass {
              background: linear-gradient(to bottom, #373737 0%, #191414 50%);
              font-family: Montserrat;
              padding-bottom: 100px;
          }

          .card {
              background-color: #121212;
              font-family: Montserrat;
          }
          .footer {
            padding-top: 25px;
            font-family: Montserrat;
            background-color: #373737;
            color: white;
        }


          `}</style>

        <Header props={''} />
        <head>
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
            integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
            crossorigin="anonymous"
          />
          <link href="https://fonts.googleapis.com/css?family=Montserrat&display=swap" rel="stylesheet" />

        </head>
        <div>

              <Modal show={this.state.playlistUpdated}  backdrop="static" keyboard={false} >
              <Modal.Header > Hi {this.state.user}</Modal.Header>
              <Modal.Body>
                  Please wait while your playlist is done being processed
                  <p>{this.state.percentage}% Done</p>

              </Modal.Body>
            </Modal>

              </div>
        <div >

        <Container className= "testclass">
          <Row>
            <Col>
            <Card className="bg-dark text-white" text="white">
                <Card.Img src="https://thumbor.forbes.com/thumbor/960x0/https%3A%2F%2Fspecials-images.forbesimg.com%2Fimageserve%2F750037840%2F960x0.jpg%3Ffit%3Dscale" alt="Card image" fluid  />
                <Card.ImgOverlay>
                  <Card.Title>Welcome, {this.state.displayName}</Card.Title>
                  <Card.Text>
                    Your current chosen top playlist is : {displayInfo}
                  </Card.Text>
                  <Card.Text>Your current location is : {this.state.location}</Card.Text>
                </Card.ImgOverlay>
                </Card>
            </Col>
            <Col>
              <img src={this.state.image} class="img-thumbnail" height="360" width="360" />
            </Col>

          </Row>
          <Row >

          <Col>
              <Form >



                <Form.Group controlId="exampleForm.ControlSelect1" style={{paddingTop: '20px'}}>
                  <Form.Label class="text-white"  >Set a new Location. You will be compared with users in your area</Form.Label>
                  <Form.Control defaultValue={-1}
                    as="select"
                    onChange={this.handleLocationChange}
                  >
                    <option disabled value={-1} key={-1}>Select a Location</option>
                    {items2}
                  </Form.Control>
                </Form.Group>

                <Form.Group controlId="exampleForm.ControlSelect2">

                  <Form.Label class="text-white">Select a new Playlist. This is the playlist others will see and be compared with</Form.Label>

                  <Form.Control defaultValue={-1}
                    as="select"

                    onChange={this.handlePlaylistChange}

                    placeholder="select a playlist">

                    <option disabled value={-1} key={-1}>Select a Playlist</option>
                    {formItems}

                  </Form.Control>




                </Form.Group>






                  <Form.Group role="form">
                  <Form.Label class="text-white">Enter Instagram Username</Form.Label>

                  <InputGroup className="mb-3">
                <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
            </InputGroup.Prepend>


                  <Form.Control  className="form-control"
                  defaultValue={this.state.instagram = null ? -1 : this.state.instagram}
                  as ="textarea"
                  rows = "1"
                  onChange ={this.handleInstagramChange}
                  placeholder="Username" >
                  </Form.Control>

                  </InputGroup>
                  </Form.Group>






              </Form>
              <Button onClick= {()=>{this.goHome()}} variant="light">
                  Back to Home
              </Button>

              </Col>
          </Row>

        </Container>


        </div>

      </div>

          <Footer />
      </html>

    )
  }
}
export default Settings;
