import React, { Component } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import { css } from "@emotion/core"
import ScaleLoader from "react-spinners/ScaleLoader"
import Header from '../components/Header'
import Footer from '../components/Footer'
import {Modal,Button, Container, Row, Col, Card, Carousel} from "react-bootstrap";
import Image from 'react-bootstrap/Image'
import { Doughnut } from 'react-chartjs-2';
import 'chartjs-plugin-labels';
import styles from './user.module.css';
import {MdKeyboardBackspace} from 'react-icons/md'
import Profile from './profile'

var auth = require('firebase/auth');
var database = require('firebase/database');


var firebase = require('firebase/app');
var querystring = require('querystring');
var request = require('request')
var axios = require("axios");
var Chart = require('chart.js');
var client_id = '2923d79235804ea58633989710346f3d';
var client_secret = 'd4813d196edf4940b58ba0aeedbf9ebc';
var redirect_uri = 'https://spotifynd-friends.herokuapp.com/';
var scope = 'user-read-private user-read-email playlist-read-private';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            access_token: '',
            user: '',
            displayName: '',
            userImage: 'https://www.palmcityyachts.com/wp/wp-content/uploads/palmcityyachts.com/2015/09/default-profile.png',
            location: '',
            playlists: [],
            playlist: null,
            playlistName: '',
            playlistDescription: '',
            playlistTracks: [],
            playlisttracknames: [],
            danceCount: 0,
            energyCount: 0,
            acousticCount: 0,
            liveCount: 0,
            valenceCount: 0,
            danceNames: [],
            energyNames: [],
            acousticNames: [],
            liveNames: [],
            valenceNames: [],
            showDance: false,
            showEnergy: false,
            showAcoustic: false,
            showLive: false,
            showValence: false,
            trackFeatures: [],
            genres: [],
            artistID: [],
            name: [],
            artist: [],
            compatibility: -1,
            max: -1,
            mostCompatibleIndex: -1,
            attribute: '',
            attributeScore: -1,
            status: '',
            loading: false,
            listOfUsers: [],
            listOfUserCompatibilities: [],
            show: false,
            showOtherUsers: false,
            showChart: false,
            beforeSelection: true,
            showPlaylists: true,
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
            }
        }
        this.chartReference = React.createRef();
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
    }
    getData = () => ({
        labels: [
            'Dancibility',
            'Energy',
            'Acousticness',
            'Liveness',
            'Valence'
        ],
        datasets: [{
            hidden: false,
            data: [this.state.danceCount,this.state.energyCount, this.state.acousticCount, this.state.liveCount, this.state.valenceCount],
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
    })

    static getInitialProps({ query }) {
        console.log("query " + JSON.stringify({ query }))
        return { query }
    }

    showDBusers = () => {
        var dbRef = firebase.database().ref('users')
        console.log(this.state.user)

        var myLocation;
        dbRef.orderByValue().startAt(0).on("child_added", snapshot => {
            console.log('first');
            if(snapshot.exists() && snapshot.key == this.state.user){
                this.setState({
                    location: snapshot.child("location").val(),
                    userImage: snapshot.child("image").val()
                })
                // console.log(this.state.location)
                myLocation = snapshot.child("location").val();
                console.log(myLocation);
                console.log(this.state.userImage);
            }
        });

        dbRef.orderByValue().startAt(0).on("child_added", snapshot => {

            //ignore key if it is you
            if (snapshot.exists() && snapshot.key != this.state.user) {
                let otherLocation = snapshot.child("location").val();

                console.log(snapshot.key + " location: " + otherLocation);
                console.log(myLocation)
                console.log(snapshot.child("trackFeatures").val())

                if(otherLocation == myLocation){
                    this.setState({ listOfUsers: [...this.state.listOfUsers, snapshot.key] })
                }
                console.log(this.state.listOfUsers)
            }

        });
    }
    convertToInt= (previousArray) => {
      var arr = new Map();
      for(var i =0;i<previousArray.length;i++){
        arr.set(previousArray[i].key,previousArray[i].value);//set the value as the int
      }
      var intArray = [];

    for(var i = 0; i < previousArray.length; i++){
        intArray.push(parseInt(previousArray[i].key));
    }

    this.orderUsers(previousArray, 0, previousArray.length-1);
    return previousArray;

    }
    orderUsers = (arr,low,high) => {
      //Quicksort by the compatability score but for now, pseuodo sort by alphabet
      //in the future will map with a key of the name maybe access the database for the compatability score?


      //given an array of compatability scores sort that array

      if(low < high){
        //pi is partiioining index
        let pi = this.partition(arr, low, high);

        this.orderUsers(arr, low, pi - 1);//before pi
        this.orderUsers(arr, pi+1, high);//after pi

      }
    }

    partition = (arr,low,high) => {
      //pivot = element to placed at right position
      let pivot = arr[high];
      let i = low -1; //index of the smaller element

      for(var j= low; j<= high-1;j++){
        // if current element is smaller than the pivot
        if(arr[j].key > pivot.key){
          i++;
          //swap arr[i] and arr[j]
          let temp;
          temp = arr[i];
          arr[i] = arr[j];
          arr[j]= temp;
              }
      }
      //swap arr[i+1] and arr[high]
      let temp;
      temp = arr[i+1];
      arr[i+1] = arr[high];
      arr[high]= temp;
      return (i+1);

    }

    writeUserData = (spotifyid) => {
        var database = firebase.database();

        var dbRef = firebase.database().ref('users')
        console.log(this.state.user)

        var user_id = this.state.user

        dbRef.child(user_id).once("value", snapshot => {
            if (snapshot.exists()) {
                const userLocation = snapshot.val().location;
                this.setState({location: userLocation});
                const userTopPlaylist = snapshot.val().topPlaylist;
                const userSpotifyId = snapshot.val().spotify_id;
                console.log("exists!", userData);


            }
        });

        if (userSpotifyId == null && userTopPlaylist == null && userLocation == null) {
            console.log("had to create one")
            firebase.database().ref('users/' + spotifyid).set({
                spotify_id: spotifyid,
                location: '',
                topPlaylist: '',
                trackFeatures: [],
                genres: [],
                artistID: [],
                name: [],
                artist: []


            }, function (error) {
                if (error) {
                    // The write failed...
                } else {
                    // Data saved successfully!
                }
            }

            );
            //Add an alert to go to settings right here after creating there
            //this.AlertDismissible();

        }
    }


    componentDidMount = () => {
        this.getUserPlaylists();
    }


    getUserPlaylists = () => {

        let url = window.location.href;
        if (url.indexOf('localhost') > -1) {
            redirect_uri = 'http://localhost:3000/index'
        }

        let access_token = window.sessionStorage.access_token;
        this.setState({access_token})
        var options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
        };
        if (access_token != "") {
            // use the access token to access the Spotify Web API
            request.get(options, (error, response, body) => {
                console.log('Access token:' + access_token)
                console.log(body);
                this.setState({ user: body.id })
                if(this.checkUserName(this.state.user)){
                this.setState({displayName: body.display_name})
                  var exist;
                  firebase.database().ref(`users/${this.state.user}/location`).once("value", snapshot => {
                      if (snapshot.exists()) {
                          //checking if the account alrady exists
                          console.log("exists!");
                          firebase.database().ref(`users/${this.state.user}/topPlaylist`).once("value", snapshot => {
                              if (snapshot.exists()) {
                                  console.log("top playlist also exists")
                              }
                              else {
                                  console.log("top playlist doesnt exist but location does")
                                  this.handleModal();
                              }
                          });

                      }
                      else {

                          console.log("does not exist");
                          //if accont doesn't exit then open Modal
                          this.handleModal();
                      }
                  });

                  this.showDBusers()
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
                      while (playlistsLeft > 0) {
                          var playlistOptions = {
                              url: 'https://api.spotify.com/v1/users/' + this.state.user + '/playlists',
                              qs: { limit: '50', offset: 50 * numRequests },
                              headers: { 'Authorization': 'Bearer ' + access_token },
                              json: true
                          };

                          request.get(playlistOptions, (error, response, body) => {
                              this.setState({ playlists: this.state.playlists.concat(body.items) })
                          });

                          playlistsLeft -= 50;
                          numRequests++
                      }
                  });
                }


            });
        }
    }
    assignPlaylistTracksName = (items) => {
        if (typeof (items) != 'undefined') {
            if (items != 0) {
                this.state.playlisttracknames = items.map((i) =>
                    <li>{i.track.id}</li>
                )
            } else {
                this.state.playlisttracknames = <p>No playlists to display</p>
            }
        }
    }
    assignTrackFeatures = (items) => {
        if (typeof (items) != 'undefined') {
            if (items != 0) {
                this.state.trackFeatures = items.map((i) =>
                    <li>{i.track.id}</li>
                )
            } else {
                this.state.playlisttracknames = <p>No playlists to display</p>
            }
        }
    }

    compareWithOtherUser = async (key) => {

        this.setState({ status: "Calculating score" })
        let compatibility = await this.calculateUserScore(key);
        this.setState({
            listOfUserCompatibilities: this.state.listOfUserCompatibilities.concat(compatibility),
            loading: false
        });

        console.log('user compatibilities: ' + this.state.listOfUserCompatibilities);
    }

    calculateUserScore = (key) => {
        return new Promise(resolve => {
            var playlist1Total = 0;
            var playlist2Total = 0;

            var otherDisplayName;
            var otherLength;
            var otherTrackFeatures;
            var otherArtistID;
            var otherGenres;

            var danceCount = 0;
            var energyCount = 0;
            var acousticCount = 0;
            var liveCount = 0;
            var valenceCount = 0;
            var danceNames = [];
            var energyNames = [];
            var acousticNames = [];
            var liveNames = [];
            var valenceNames = [];
            var image = ''

            var dbRef = firebase.database().ref('users')

            dbRef.orderByValue().startAt(0).on("child_added", snapshot => {
                if(snapshot.exists() && snapshot.key == key){
                    //HERE CAN DO AN IF
                    otherDisplayName = snapshot.child("displayName").val();
                    otherLength = snapshot.child("name").val().length;
                    otherTrackFeatures = snapshot.child("trackFeatures").val();
                    otherArtistID = snapshot.child("artistID").val();
                    otherGenres = snapshot.child("genres").val();
                    image = snapshot.child("image").val();
                }
            });

            console.log("comparing with " + key);
            console.log("display name: " + otherDisplayName);
            console.log("TRACK FEATURES: " + otherTrackFeatures);
            console.log("playlisttracknames.length: " + this.state.playlisttracknames.length);
            console.log("other genres: " + otherGenres[0]);
            console.log("genres length: " + otherGenres.length)
            console.log("other length: " + otherLength)

            var max = -1;
            var mostCompatibleIndex = -1;

            for (let i = 0; i < this.state.playlisttracknames.length; i++) {
                console.log('calculating')
                console.log('LENGTH: ' + otherLength)
                //var songDifferenceScore = 0;
                var imin = 100;
                for (let j = 0; j < otherTrackFeatures.length; j++) {
                    var differenceScore = 0, dance = 0, energy = 0, acoustic = 0, live = 0, valence = 0
                    differenceScore += Math.abs(this.state.trackFeatures[i].danceability - otherTrackFeatures[j].danceability) * 5
                    dance += Math.abs(this.state.trackFeatures[i].danceability - otherTrackFeatures[j].danceability) * 5
                    differenceScore += Math.abs(this.state.trackFeatures[i].energy - otherTrackFeatures[j].energy) * 5
                    energy += Math.abs(this.state.trackFeatures[i].energy - otherTrackFeatures[j].energy) * 5
                    differenceScore += Math.abs(this.state.trackFeatures[i].acousticness - otherTrackFeatures[j].acousticness) * 5
                    acoustic += Math.abs(this.state.trackFeatures[i].acousticness - otherTrackFeatures[j].acousticness) * 5
                    differenceScore += Math.abs(this.state.trackFeatures[i].liveness - otherTrackFeatures[j].liveness) * 5
                    live += Math.abs(this.state.trackFeatures[i].liveness - otherTrackFeatures[j].liveness) * 5
                    differenceScore += Math.abs(this.state.trackFeatures[i].valence - otherTrackFeatures[j].valence) * 5
                    valence += Math.abs(this.state.trackFeatures[i].valence - otherTrackFeatures[j].valence) * 5
                    differenceScore += 75;
                    if (this.state.artistID[i] == otherArtistID[j])
                        differenceScore -= 20;
                    if (!(this.state.genres[i].length === 0)) {
                        for (let k = 0; k < this.state.genres[i].length; k++) {
                            let found = false;
                            if(otherGenres[j] != null){
                                if (!(otherGenres[j].length === 0)) {
                                    for (let l = 0; l < otherGenres[j].length; l++) {
                                        if (this.state.genres[i][k] == otherGenres[j][l]) {
                                            differenceScore -= 55;
                                            found = true;
                                            console.log("same genre")
                                            break;
                                        }
                                    }
                                    if (found == true)
                                        break;
                                }
                            }
                        }
                    }
                    if (differenceScore < imin) {
                        imin = differenceScore;
                    }
                }

                var attributeMin = Math.min(dance, energy, acoustic, live, valence)



                switch (attributeMin) {
                    case dance:
                        danceCount++
                        // danceNames = [...danceNames, this.state.name[i]];
                        danceNames = danceNames.concat(this.state.name[i]);
                        console.log('danceNames: ' + danceNames);
                        break;
                    case energy:
                        energyCount++
                        energyNames = [...energyNames, this.state.name[i]];
                        console.log('energyNames: ' + energyNames);
                        break;
                    case acoustic:
                        acousticCount++
                        acousticNames = [...acousticNames, this.state.name[i]];
                        console.log('acousticNames: ' + acousticNames);
                        break;
                    case live:
                        liveCount++
                        liveNames = [...liveNames, this.state.name[i]];
                        console.log('liveNames: ' + liveNames);
                        break;
                    case valence:
                        valenceCount++
                        valenceNames = [...valenceNames, this.state.name[i]];
                        console.log('valenceNames: ' + valenceNames);
                        break;
                }
                imin = 100 - imin;
                console.log(this.state.name[i] + ": " + imin)
                playlist1Total += imin;
                if(max < imin){
                    mostCompatibleIndex = i;
                    // max = Math.round(imin);
                    max = imin;
                }
                console.log("playlist1 running total: " + playlist1Total)
            }
            playlist1Total /= this.state.playlisttracknames.length;
            console.log("playlist1 total: " + playlist1Total);
            for (let j = 0; j < otherTrackFeatures.length; j++) {
                console.log('calculating')
                var jmin = 100;

                for (let i = 0; i < this.state.playlisttracknames.length; i++) {
                    var differenceScore = 0, dance = 0, energy = 0, acoustic = 0, live = 0, valence = 0
                    differenceScore += Math.abs(this.state.trackFeatures[i].danceability - otherTrackFeatures[j].danceability) * 5
                    dance += Math.abs(this.state.trackFeatures[i].danceability - otherTrackFeatures[j].danceability) * 5
                    differenceScore += Math.abs(this.state.trackFeatures[i].energy - otherTrackFeatures[j].energy) * 5
                    energy += Math.abs(this.state.trackFeatures[i].energy - otherTrackFeatures[j].energy) * 5
                    differenceScore += Math.abs(this.state.trackFeatures[i].acousticness - otherTrackFeatures[j].acousticness) * 5
                    acoustic += Math.abs(this.state.trackFeatures[i].acousticness - otherTrackFeatures[j].acousticness) * 5
                    differenceScore += Math.abs(this.state.trackFeatures[i].liveness - otherTrackFeatures[j].liveness) * 5
                    live += Math.abs(this.state.trackFeatures[i].liveness - otherTrackFeatures[j].liveness) * 5
                    differenceScore += Math.abs(this.state.trackFeatures[i].valence - otherTrackFeatures[j].valence) * 5
                    valence += Math.abs(this.state.trackFeatures[i].valence - otherTrackFeatures[j].valence) * 5
                    differenceScore += 75;
                    if (this.state.artistID[i] == otherArtistID[j])
                        differenceScore -= 20;
                    if(otherGenres[j] != null){
                        if (!(otherGenres[j].length === 0)) {
                            for (let l = 0; l < otherGenres[j].length; l++) {
                                let found = false;
                                if (!(this.state.genres[i].length === 0)) {
                                    for (let k = 0; k < this.state.genres[i].length; k++) {
                                        if (this.state.genres[i][k] == otherGenres[j][l]) {
                                            differenceScore -= 55;
                                            found = true;
                                            console.log("same genre")
                                            break;
                                        }
                                    }
                                }
                                if (found == true)
                                    break;
                            }
                        }
                    }
                    if (differenceScore < jmin) {
                        jmin = differenceScore;
                    }
                }
                jmin = 100 - jmin;
                playlist2Total += jmin;
                console.log("playlist2 running total: " + playlist2Total)
            }
            playlist2Total /= otherLength;
            console.log("playlist2 total: " + playlist2Total);
            console.log("Your songs are closest by: \n" + danceCount + "/" + this.state.playlisttracknames.length + " dancibility\n" +
                energyCount + "/" + this.state.playlisttracknames.length + " energy\n" +
                acousticCount + "/" + this.state.playlisttracknames.length + " acousticness\n" +
                liveCount + "/" + this.state.playlisttracknames.length + " liveness\n" +
                valenceCount + "/" + this.state.playlisttracknames.length + " valence\n"
            )

            var total;
            if (playlist1Total > playlist2Total)
                // total = Math.round(playlist2Total)
                total = playlist2Total;
            else
                // total = Math.round(playlist1Total)
                total = playlist1Total;

            var otherCompatibility = {
                danceCount: danceCount,
                energyCount: energyCount,
                acousticCount: acousticCount,
                liveCount: liveCount,
                valenceCount: valenceCount,
                danceNames: danceNames,
                energyNames: energyNames,
                acousticNames: acousticNames,
                liveNames: liveNames,
                valenceNames: valenceNames,
                key: total,
                value: key,
                mostCompatibleIndex: mostCompatibleIndex,
                max: max,
                image: image,
                displayName: otherDisplayName
            };

            console.log(otherCompatibility);


            this.setState({ status: "All done! Click on a user's name to see their profile, or click the compatibility score to see more details."})
            resolve(otherCompatibility);

        })
    }

    getPlaylistTracks = (i) => {
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
            }]},
            danceNames: [],
            energyNames: [],
            acousticNames: [],
            liveNames: [],
            valenceNames: [],
            showDance: false,
            showEnergy: false,
            showAcoustic: false,
            showLive: false,
            showValence: false
        })
        console.log(this.state.playlists[i])
        var tracksOptions = {
            url: this.state.playlists[i].tracks.href,
            headers: { 'Authorization': 'Bearer ' + window.sessionStorage.access_token },
            json: true
        };

        console.log('user right before tracks request: ' + this.state.user)

        // use the access token to access the Spotify Web API
        request.get(tracksOptions, (error, response, body) => {
            console.log(body);
            console.log('this.state.playlists' + this.state.playlists)
            this.assignPlaylistTracksName(body.items);

            //TAKING OUT TOP 50 TEST
            //this.comparePlaylists();

            this.closeNav();
            this.getSelectedPlaylist();

        });



    }

    //compare selected playlist with users
    getSelectedPlaylist = async () => {
        //clear arrays
        this.setState({
            trackFeatures: [],
            genres: [],
            artistID: [],
            name: [],
            artist: [],
            max: -1,
            mostCompatibleIndex: -1,
            danceCount: 0,
            energyCount: 0,
            acousticCount: 0,
            liveCount: 0,
            valenceCount: 0,
            compatibility: 'generating',
            status: '',
            loading: true
        })

        //create arrays with selected playlist attributes
        for (let i = 0; i < this.state.playlisttracknames.length; i++) {
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

        this.setState({listOfUserCompatibilities: []})
        console.log("LENGTH FROM HERE: " + this.state.playlisttracknames.length)
        for(var i = 0; i < this.state.listOfUsers.length; i++){
            this.compareWithOtherUser(this.state.listOfUsers[i]);
        }

        this.setState({
            showOtherUsers: true,
            beforeSelection: false,
            showPlaylists: false,
            showCompData: true
        })

    }

    refresh = () => {
        console.log(this.state.refresh_token);

        var authOptions = {
              url: 'https://accounts.spotify.com/api/token',
              headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
              form: {
                grant_type: 'refresh_token',
                refresh_token: this.state.refresh_token
              },
              json: true
        };

        request.post(authOptions, (error, response, body) => {
            console.log(error);
            console.log(body.expires_in);
            if (!error && response.statusCode === 200) {

                this.setState({
                    access_token: body.access_token
                });
            }
        });
    }

    goToSettings = () => {
        let access_token = window.sessionStorage.access_token;
        Router.push({
            pathname: '/settings',
            query: { access_token }
        }, '/settings'
        )
    }

    goToProfile = (i) => {
        // let profile = (
        //     <div className="modal">
        //         <div className="modal_content">
        //         <span className="close" onClick={this.handleClick}>&times;    </span>
        //         <p>I'm A Pop Up!!!</p>
        //         </div>
        //     </div>
        // );

        // this.setState({profile: profile})

        console.log(this.state.listOfUsers)
        let access_token = window.sessionStorage.access_token;
        console.log(access_token)
        let user = this.state.listOfUserCompatibilities[i].value;
        console.log(user)
        Router.push({
            pathname: '/profile',
            query: { access_token, user },
        }, "/profile/" + user
        )
    }

    handleModal = () => {
        this.setState({
            show: !this.state.show
        })
    }

    generateUserCompButtons = () => {
        // let list = this.convertToInt(this.state.listOfUserCompatibilities);
        let list = this.state.listOfUserCompatibilities;
        // this.state.showCompData = true;
        let access_token = this.state.access_token;

        let compButtons = list.map((i, index) =>
        <div className = 'usercard'>

            <style jsx>{`

                .profile-link:hover{
                    color: #1ed760;
                    cursor: pointer;

                }
                .profile-link{
                  text-align: center;
                    font-size: 1.25vw;
                    overflow-x: auto;
                }
                .profile-link:hover .tooltiptext{
                    visibility: visible;
                }

                .profile-link .tooltiptext{
                    visibility: hidden;
                    width: 120px;
                    background-color: black;
                    color: #fff;
                    text-align: center;
                    padding: 5px 0;
                    border-radius: 6px;
                    font-size: 10pt;

                    /* Position the tooltip text - see examples below! */
                    position: absolute;
                    z-index: 1;
                    // top: -3px;
                    right: 45%;
                }

                .usercard{
                  padding-bottom: 30px;

                }
                .usercardphoto{
                  text-align: center;
                }
                .percent{
                  padding-left: 50px;
                  padding-top:10px;
                  font-size:120px ;
                }
                .percent:hover{
                    color: #1ed760;
                    cursor: pointer;
                }

                .percent:hover .tooltiptext{
                    visibility: visible;
                }

                .percent .tooltiptext{
                    visibility: hidden;
                    width: 120px;
                    background-color: black;
                    color: #fff;
                    text-align: center;
                    padding: 5px 0;
                    border-radius: 6px;
                    font-size: 10pt;

                    /* Position the tooltip text - see examples below! */
                    position: absolute;
                    z-index: 1;
                }



                .cardimage-top{
                  object-fit:cover;
                }

            `}</style>


              <Card border="dark" style={{ height: '200px'}} text="white">
              <Card.Img className = "cardimage" src="https://media.gettyimages.com/photos/colorful-clouds-on-dramatic-sunset-sky-picture-id888845986?b=1&k=6&m=888845986&s=612x612&w=0&h=IyxUtRdQEQGV-DwLn9HaGJdhZRGZFVg3vXcefQRrIqI=" alt="Card image" style={{ height: '200px'}}/>
              <Card.ImgOverlay>
                <Row>

                    <Col onClick={() => this.setOtherUsersDetails(index)} >

                        <div className = 'percent' >
                            {Math.round(i.key)}
                            <span className="tooltiptext">View Compatibility Details</span>
                        </div>

                    </Col>

                    <Col style={{fontSize: '1.1vw', paddingTop: '20px', whiteSpace: 'nowrap', overflowX: 'auto'}}>
                        <Link href={{
                            pathname: '/profile',
                            query: { access_token: access_token, user: i.value, displayName: i.displayName}} }
                            passHref>
                            <a target="_blank">
                                <div className="profile-link" style={{color: 'white', overflowY:'hidden', overflowX:'hidden'}}>
                                    <span className="tooltiptext">View User Profile</span>
                                    {i.displayName}
                                </div>
                            </a>
                        </Link>
                        <div className = "usercardphoto">
                        <Image src={list[index].image} roundedCircle/>
                        </div>

                    </Col>


                  </Row>
                   </Card.ImgOverlay>
                </Card>


        </div>
        )//return
        return compButtons;
    }

    setOtherUsersDetails = (i) => {
        console.log("setting other users data")
        let list = this.state.listOfUserCompatibilities;
        let danceNames = list[i].danceNames;
        let energyNames = list[i].energyNames;
        let acousticNames = list[i].acousticNames;
        let liveNames = list[i].liveNames;
        let valenceNames = list[i].valenceNames;
        let danceCount = list[i].danceCount;
        let energyCount = list[i].energyCount;
        let acousticCount = list[i].acousticCount;
        let liveCount = list[i].liveCount;
        let valenceCount = list[i].valenceCount;
        this.setState({
            showChart: true,
            data: {
                labels: [
                    'Dancibility',
                    'Energy',
                    'Acousticness',
                    'Liveness',
                    'Valence'
                ],
                datasets: [{
                    hidden: false,
                    data: [danceCount, energyCount, acousticCount, liveCount, valenceCount],
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
            danceNames: danceNames,
            energyNames: energyNames,
            acousticNames: acousticNames,
            liveNames: liveNames,
            valenceNames: valenceNames,
            showDance: false,
            showEnergy: false,
            showAcoustic: false,
            showLive: false,
            showValence: false,
            compatibility: list[i].key,
            mostCompatibleIndex: list[i].mostCompatibleIndex,
            max: list[i].max,
            danceCount: list[i].danceCount,
            energyCount: list[i].energyCount,
            acousticCount: list[i].acousticCount,
            liveCount: list[i].liveCount,
            valenceCount: list[i].valenceCount,

        })
    }

    generateUserChart = () => {
        console.log(this.state.data)
        let status;
        let message;
        // status = ''
        // message = `These playlists are ${this.state.compatibility}% compatible!`
        // message += "\n" + this.state.name[this.state.mostCompatibleIndex] + " by "
        // + this.state.artist[this.state.mostCompatibleIndex]
        // + ` is the most compatible song by ${this.state.max}%.`
        return (
            <Row>
                <Col style={{textAlign: 'center'}}>
                    <div style={{textAlign: 'center'}}>
                        {status}
                    </div>
                    {message}
                </Col>
                <Col>
                    <Doughnut data={this.state.data}
                        width={300}
                        height={300}
                        options={{
                            maintainAspectRatio: false,
                            plugins: {
                                        labels: { render: 'label',
                                            fontColor: 'white'}
                            },
                            legend: {
                                display: false
                            }
                        }}
                        getElementsAtEvent={elems =>{
                            if(elems.length != 0){
                                if(elems[0]._index == 0){
                                    console.log(elems[0]._index);
                                    this.state.showDance = true;
                                    this.state.showEnergy = false;
                                    this.state.showAcoustic = false;
                                    this.state.showLive = false;
                                    this.state.showValence = false;
                                    console.log('showDance: ' + this.state.showDance);
                                    this.forceUpdate();
                                } else if(elems[0]._index == 1){
                                    this.state.showDance = false;
                                    this.state.showEnergy = true;
                                    this.state.showAcoustic = false;
                                    this.state.showLive = false;
                                    this.state.showValence = false;
                                    this.forceUpdate();
                                } else if(elems[0]._index == 2){
                                    this.state.showDance = false;
                                    this.state.showEnergy = false;
                                    this.state.showAcoustic = true;
                                    this.state.showLive = false;
                                    this.state.showValence = false;
                                    this.forceUpdate();
                                } else if(elems[0]._index == 3){
                                    this.state.showDance = false;
                                    this.state.showEnergy = false;
                                    this.state.showAcoustic = false;
                                    this.state.showLive = true;
                                    this.state.showValence = false;
                                    this.forceUpdate();
                                } else if(elems[0]._index == 4){
                                    this.state.showDance = false;
                                    this.state.showEnergy = false;
                                    this.state.showAcoustic = false;
                                    this.state.showLive = false;
                                    this.state.showValence = true;
                                    this.forceUpdate();
                                }
                            }
                        }}
                        />
                </Col>
            </Row>
        )
    }
    checkUserName = (userID) =>{
      var chars = ['.','#','$','*','[',']'];
      for(let x of chars){
        if(userID.includes(x)){
          Router.push({pathname: '/loginError'});
          return false;
        }
      }
      return true;

    }
    setUserCompList = () => {
        this.convertToInt(this.state.listOfUserCompatibilities);
    }

    openNav() {
        // document.getElementById("mySidepanel").style.width = "250px";
        this.setState({showPlaylists: true,
        showCompData: false})
    }

        /* Set the width of the sidebar to 0 (hide it) */
    closeNav() {
        // document.getElementById("mySidepanel").style.width = "0";
        this.setState({showPlaylists: false,
        showCompData: true})
    }

    render() {
        let playlists;
        if (typeof (this.state.playlists) != 'undefined') {
            if (this.state.playlists.length != 0) {
                playlists = this.state.playlists.map((i, index) =>

                <div>
                    <Row>
                        <Col>
                        <Button className = "button" onClick={() => this.getPlaylistTracks(index)} variant="success" size="sm">
                            {i.name}
                        </Button>

                        </Col>
                    </Row>
                    </div>
                )
            } else {
                playlists = <p>No playlists to display</p>
            }
        }

        let list_ofUsers;

        if (typeof (this.state.listOfUsers) != 'undefined') {
            if (this.state.listOfUsers.length != 0) {

                list_ofUsers = this.state.listOfUsers.map((i, index) =>
                <div>
                    <li>
                      <Row>
                        <Col>  {i} </Col>
                        <Col>
                        <Button className = "button" onClick={() => this.goToProfile(index) }  variant="outline-secondary">
                            Select User
                        </Button>
                        </Col>
                        </Row>
                        </li>
                    </div>
                )
            } else {
                playlists = (
                <div>
                    <p>No users to compare with...there may be no users in your location, maybe you should choose a new location?</p>
                    <p>Please go to Settings to change location or top playlist</p>
                    <Button onClick= {()=>{this.goToSettings()}} variant="light">
                          Settings
                    </Button>
                </div>
                )
            }
        }

        let userCompButtons;
        if(this.state.showOtherUsers){
            console.log("SHOWING OTHER USERS")
            this.setUserCompList();
            userCompButtons = this.generateUserCompButtons();
        } else{
            userCompButtons = "no users yet";
            // userCompButtons = this.state.listOfUsers.map((i, index) =>
            // <div>
            //     <li>
            //       <Row>
            //         <Col>  {i} </Col>
            //         </Row>
            //         </li>
            //         </div>
            //       )

        }

        // let userDetailsChart;
        // if(this.state.showChart){
        //     console.log("generating chart");
        //     userDetailsChart = this.generateUserChart();
        // }

        var message = ''
        var status = ''
        let details;
        if (this.state.compatibility < 0) {
            message = ''
        } else if ((this.state.compatibility) == 'generating') {
            if(this.state.loading){
                // message = `Generating compatibility. Status:`
                message = '';
            } else{
                message = '';
            }
            status = `${this.state.status}`
        } else if (this.state.compatibility > 0) {
            status = ''
            message = `These playlists are ${Math.round(this.state.compatibility)}% compatible!`
            message += "\n" + this.state.name[this.state.mostCompatibleIndex] + " by " + this.state.artist[this.state.mostCompatibleIndex] + ` is the most compatible song by ${Math.round(this.state.max)}%.`
            message+= " Click on each slice of the donut! You'll be able to see exactly which songs you have in common with the chosen user."
        }

        let danceList;
        if (typeof (this.state.danceNames) != 'undefined') {
            if (this.state.danceNames.length != 0) {
                danceList = this.state.danceNames.map((i, index) =>

                <div>
                    <li>
                        {i}
                    </li>
                </div>
                )
            }
        }

        let energyList;
        if (typeof (this.state.energyNames) != 'undefined') {
            if (this.state.energyNames.length != 0) {
                energyList = this.state.energyNames.map((i, index) =>

                <div>
                    <li>
                        {i}
                    </li>
                </div>
                )
            }
        }

        let acousticList;
        if (typeof (this.state.acousticNames) != 'undefined') {
            if (this.state.acousticNames.length != 0) {
                acousticList = this.state.acousticNames.map((i, index) =>

                <div>
                    <li>
                        {i}
                    </li>
                </div>
                )
            }
        }

        let liveList;
        if (typeof (this.state.liveNames) != 'undefined') {
            if (this.state.liveNames.length != 0) {
                liveList = this.state.liveNames.map((i, index) =>

                <div>
                    <li>
                        {i}
                    </li>
                </div>
                )
            }
        }

        let valenceList;
        if (typeof (this.state.valenceNames) != 'undefined') {
            if (this.state.valenceNames.length != 0) {
                valenceList = this.state.valenceNames.map((i, index) =>

                <div>
                    <li>
                        {i}
                    </li>
                </div>
                )
            }
        }

        let visibleList;
        if(this.state.showDance){
            visibleList = (
                <div>
                    <p>{this.state.danceCount} {this.state.danceCount == 1 ? 'song is': 'songs are'} most compatibility in Dancibility:</p>
                    {danceList}
                </div>
            );
        } else if(this.state.showEnergy){
            visibleList = (
                <div>
                    <p>{this.state.energyCount} {this.state.energyCount == 1 ? 'song is': 'songs are'} most compatibility in Energy:</p>
                    {energyList}
                </div>
            );
        } else if(this.state.showAcoustic){
            visibleList = (
                <div>
                    <p>{this.state.acousticCount} {this.state.acousticCount == 1 ? 'song is': 'songs are'} most compatibility in Acousticness:</p>
                    {acousticList}
                </div>
            );
        } else if(this.state.showLive){
            visibleList = (
                <div>
                    <p>{this.state.liveCount} {this.state.liveCount == 1 ? 'song is': 'songs are'} most compatibility in Liveness:</p>
                    {liveList}
                </div>
            );
        } else if(this.state.showValence){
            visibleList = (
                <div>
                    <p>{this.state.valenceCount} {this.state.valenceCount == 1 ? 'song is': 'songs are'} most compatibility in Valence:</p>
                    {valenceList}
                </div>
            );
        }

        let playlistsBox = (
            <Col xs={6}>
                <Card style={{ height: '550px', backgroundColor: '#121212' }} text="white" >
                    <Card.Header>Playlists: </Card.Header>
                        <div className="overflow-auto" style={{  maxHeight:"480px" }}>
                    <Card.Body>
                        <Card.Text>


                            <ul>{playlists}</ul>

                        </Card.Text>
                    </Card.Body>
                        </div>
                </Card>
            </Col>
        );

        let leftSide;
        let rightSide;
        if(this.state.beforeSelection){
            leftSide = (
                // {playlistsBox}
                <Col>
                <Card style={{ height: '550px', backgroundColor: '#121212' }} text="white" >
                    <Card.Header>Playlists: </Card.Header>
                        <div className="overflow-auto" style={{  maxHeight:"480px" }}>
                    <Card.Body>
                        <Card.Text>


                            <ul>{playlists}</ul>

                        </Card.Text>
                    </Card.Body>
                        </div>
                </Card>
                </Col>
            );
            if(!this.state.loading){
                rightSide = (
                    <Col>
                        <p style={{color: 'white', fontSize: '50pt'}}>Choose a playlist to find compatible users near you</p>
                        <p style={{color: '#dedede', fontSize: '25pt'}}>Your selected playlist will be compared with the favorite playlists of people in your area</p>
                        {/* <br/>
                        <MdKeyboardBackspace style={{color: 'white'}} size={150}/></p> */}
                        <p></p>
                    </Col>
                );
            }
        } else{
            let toggle;
            if(this.state.showPlaylists){
                console.log("toggle true")
                toggle = (
                    <Col md="auto">
                        <div id="mySidepanel" className="sidepanel" style={{width: '20vw'}}>
                            <Row>
                                <a className="closebtn" onClick={() => this.closeNav()} style={{color: 'white'}}>&times;</a>
                            </Row>
                            <Row style={{paddingTop: '20px', paddingRight: '20px'}}>
                                <ul>{playlists}</ul>
                            </Row>
                        </div>
                    </Col>
                );
            } else{
                console.log("toggle false")
                toggle = (
                    <Col md="auto">
                        <button className="openbtn" onClick={() => this.openNav()}>
                            &#9776;
                            <span className="tooltiptext">Playlists</span>
                        </button>
                    </Col>
                );
            }

            leftSide = (
                <Col md="auto">
                    <style jsx> {`
                         /* The sidepanel menu */
                        .sidepanel {
                            // height: 250px; /* Specify a height */
                            // width: 0; /* 0 width - change this with JavaScript */
                            // position: fixed; /* Stay in place */
                            // z-index: 1; /* Stay on top */
                            // top: 0;
                            // left: 0;
                            // background-color: #111; /* Black*/
                            // overflow-x: hidden; /* Disable horizontal scroll */
                            // padding-top: 60px; /* Place content 60px from the top */
                            // transition: 0.5s; /* 0.5 second transition effect to slide in the sidepanel */

                            border: 3px solid black;
                            padding: 15px;
                            background-color: #111;
                            // width: 50%;
                            height: 75vh;
                            position: -webkit-sticky;
                            position: sticky;
                            top: 0;
                            overflow-y: scroll;
                        }

                         /* The sidepanel links */
                        .sidepanel a {
                            padding: 8px 8px 8px 32px;
                            text-decoration: none;
                            font-size: 25px;
                            color: #818181;
                            display: block;
                            transition: 0.3s;
                        }

                         /* When you mouse over the navigation links, change their color */
                        .sidepanel a:hover {
                            color: #f1f1f1;
                        }

                         /* Position and style the close button (top right corner) */
                        .sidepanel .closebtn {
                            position: absolute;
                            top:-10px;
                            right:-10px;
                            left:-10px;
                            bottom:-10px;
                            font-size: 36px;
                            margin-right: 15%;
                            margin-left: 80%;
                            margin-top: 5px;
                            text-align: right;
                            cursor: pointer;
                        }

                         /* Style the button that is used to open the sidepanel */
                        .openbtn {
                            font-size: 20px;
                            cursor: pointer;
                            background-color: #111;
                            color: white;
                            padding: 10px 15px;
                            border: none;
                        }

                        .openbtn:hover {
                            background-color: #444;
                        }

                        .openbtn:hover .tooltiptext{
                            visibility: visible;
                        }

                        .openbtn .tooltiptext{
                            visibility: hidden;
                            width: 120px;
                            background-color: black;
                            color: #fff;
                            text-align: center;
                            padding: 5px 0;
                            border-radius: 6px;

                            /* Position the tooltip text - see examples below! */
                            position: absolute;
                            z-index: 1;
                        }
                    `}
                    </style>
                        {toggle}
                </Col>
            );
            rightSide = (
                <Col>
                    <Card bg="dark" style={{ height: '550px', width: '35vw' }} text="white" >
                    <Card.Header>Compatible Users:</Card.Header>
                    <div className="overflow-auto" style={{  maxHeight:"480px" }}>

                        <Card.Body>
                            <Card.Text>
                                {userCompButtons}
                            </Card.Text>
                        </Card.Body>
                        </div>
                    </Card>
                </Col>
            );
        }

        let compData;
        if(this.state.showCompData){
            if(!this.state.hideCompData){
                compData = (
                    <Col style={{width: '30vw', color: 'white'}}>
                        <div className="sweet-loading">
                            <ScaleLoader
                                css={override}
                                size={5}
                                height={30}
                                width={10}
                                radius={5}
                                //size={"150px"} this also works
                                color={"#1DB954"}
                                loading={this.state.loading}
                                />
                            </div>
                            {/* <Col> */}
                            <Row style={{textAlign: 'center'}}>
                                <div style={{textAlign: 'center'}}>
                                    {status}

                                </div>
                                {message}

                            </Row>

                            <Row style={{padding: '30px'}}>
                                <Doughnut data={this.state.data}
                                    width={300}
                                    height={300}
                                    options={{
                                        maintainAspectRatio: false,
                                        plugins: {
                                                    labels: { render: 'label',
                                                        fontColor: 'white'}
                                        },
                                        legend: {
                                            display: false
                                        }
                                    }}
                                    getElementsAtEvent={elems =>{
                                        if(elems.length != 0){
                                            if(elems[0]._index == 0){
                                                console.log(elems[0]._index);
                                                this.state.showDance = true;
                                                this.state.showEnergy = false;
                                                this.state.showAcoustic = false;
                                                this.state.showLive = false;
                                                this.state.showValence = false;
                                                console.log('showDance: ' + this.state.showDance);
                                                this.forceUpdate();
                                            } else if(elems[0]._index == 1){
                                                this.state.showDance = false;
                                                this.state.showEnergy = true;
                                                this.state.showAcoustic = false;
                                                this.state.showLive = false;
                                                this.state.showValence = false;
                                                this.forceUpdate();
                                            } else if(elems[0]._index == 2){
                                                this.state.showDance = false;
                                                this.state.showEnergy = false;
                                                this.state.showAcoustic = true;
                                                this.state.showLive = false;
                                                this.state.showValence = false;
                                                this.forceUpdate();
                                            } else if(elems[0]._index == 3){
                                                this.state.showDance = false;
                                                this.state.showEnergy = false;
                                                this.state.showAcoustic = false;
                                                this.state.showLive = true;
                                                this.state.showValence = false;
                                                this.forceUpdate();
                                            } else if(elems[0]._index == 4){
                                                this.state.showDance = false;
                                                this.state.showEnergy = false;
                                                this.state.showAcoustic = false;
                                                this.state.showLive = false;
                                                this.state.showValence = true;
                                                this.forceUpdate();
                                            }
                                        }
                                    }}
                                />
                            </Row>
                        <Row style={{color: 'white', paddingTop: '35px', paddingLeft: '100px'}}>
                            {visibleList}
                        </Row>
                    </Col>

                );
            } else {
                console.log("hiding chart")
                compData = (
                <div>
                    <style jsx>{`
                        .comp-data{
                            transition: '0.5s'
                            x-index: '1200px'
                        }
                    `}</style>
                    <Col style={{width: '30vw', color: 'white'}} className="comp-data">
                        <div className="sweet-loading">
                            <ScaleLoader
                                css={override}
                                size={5}
                                height={30}
                                width={10}
                                radius={5}
                                //size={"150px"} this also works
                                color={"#1DB954"}
                                loading={this.state.loading}
                                />
                            </div>
                            {/* <Col> */}
                            <Row style={{textAlign: 'center'}}>
                                <div style={{textAlign: 'center'}}>
                                    {status}
                                </div>
                                {message}
                            </Row>
                            {/* </Col>
                            <Col> */}
                            <Row style={{padding: '30px'}}>
                                <Doughnut data={this.state.data}
                                    width={300}
                                    height={300}
                                    options={{
                                        maintainAspectRatio: false,
                                        plugins: {
                                                    labels: { render: 'label',
                                                        fontColor: 'white'}
                                        },
                                        legend: {
                                            display: false
                                        }
                                    }}
                                    getElementsAtEvent={elems =>{
                                        if(elems.length != 0){
                                            if(elems[0]._index == 0){
                                                console.log(elems[0]._index);
                                                this.state.showDance = true;
                                                this.state.showEnergy = false;
                                                this.state.showAcoustic = false;
                                                this.state.showLive = false;
                                                this.state.showValence = false;
                                                console.log('showDance: ' + this.state.showDance);
                                                this.forceUpdate();
                                            } else if(elems[0]._index == 1){
                                                this.state.showDance = false;
                                                this.state.showEnergy = true;
                                                this.state.showAcoustic = false;
                                                this.state.showLive = false;
                                                this.state.showValence = false;
                                                this.forceUpdate();
                                            } else if(elems[0]._index == 2){
                                                this.state.showDance = false;
                                                this.state.showEnergy = false;
                                                this.state.showAcoustic = true;
                                                this.state.showLive = false;
                                                this.state.showValence = false;
                                                this.forceUpdate();
                                            } else if(elems[0]._index == 3){
                                                this.state.showDance = false;
                                                this.state.showEnergy = false;
                                                this.state.showAcoustic = false;
                                                this.state.showLive = true;
                                                this.state.showValence = false;
                                                this.forceUpdate();
                                            } else if(elems[0]._index == 4){
                                                this.state.showDance = false;
                                                this.state.showEnergy = false;
                                                this.state.showAcoustic = false;
                                                this.state.showLive = false;
                                                this.state.showValence = true;
                                                this.forceUpdate();
                                            }
                                        }
                                    }}
                                />
                            </Row>
                        <Row style={{color: 'white', paddingTop: '35px', paddingLeft: '100px'}}>
                            {visibleList}
                        </Row>
                    </Col>
                </div>
                );
            }
        } else if(this.state.loading){
            compData = (
                <Col style={{width: '30vw', color: 'white'}}>
                    <div className="sweet-loading">
                        <ScaleLoader
                            css={override}
                            size={5}
                            height={30}
                            width={10}
                            radius={5}
                            //size={"150px"} this also works
                            color={"#1DB954"}
                            loading={this.state.loading}
                            />
                    </div>
                    <Row style={{textAlign: 'center'}}>
                        <div style={{textAlign: 'center'}}>
                            {status}
                        </div>
                        {message}
                    </Row>
                </Col>
            );
        }

        return (
            <html>
                <div className="testclass">
                <div>
                <style jsx>{`
                    .container {
                        margin: 50px;
                    }
                    .testclass {
                        background: linear-gradient(to bottom, #373737 0%, #191414 50%);
                        font-family: Montserrat;
                        padding-bottom: 100px;
                    }
                    .footer {
                        padding-top: 25px;
                        font-family: Montserrat;
                        background-color: #373737;
                        color: white;
                    }
                    img {
                        object-fit: cover;
                        width:120px;
                        height:120px;
                    }
                    //https://stackoverflow.com/questions/15167545/how-to-crop-a-rectangular-image-into-a-square-with-css

                `}</style>
                <head>
                  <link
                    rel="stylesheet"
                    href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
                    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
                    crossorigin="anonymous"
                  />
                  <link href="https://fonts.googleapis.com/css?family=Montserrat&display=swap" rel="stylesheet" />
                </head>
                <Header props={''} />
                <div>

                    {/* <Button onClick= {()=>{this.handleModal()}}> open modal </Button>*/}

                    <Modal show={this.state.show} onHide={() => { this.handleModal() }} backdrop="static" keyboard={false} >
                        <Modal.Header > Hi {this.state.user}!! Welcome to Spotifynd Friends </Modal.Header>
                        <Modal.Body>
                            Before you do anything else, there are a few steps you need to take.
                            1. Go to Settings
                            2. Set your personal location and choose your favorite playlist.
                            The location will help us connect you with people also in your area and the playlist will
                            be displayed to these people!


                        </Modal.Body>
                        <Modal.Footer>
                        <Button onClick= {()=>{this.goToSettings()}} variant="light">
                          Settings
                        </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
                <div>
                  <Container>
                        <Row>
                            <Col md="auto" style={{paddingBottom: '20px'}}>
                                <Image src={this.state.userImage} roundedCircle/>
                            </Col>
                            <Col style={{color: 'white', paddingBottom: '20px'}}>
                                <p style={{fontSize: 'small'}}>USER</p>
                                <h1><b>{this.state.displayName}</b></h1>
                            </Col>
                        </Row>
                    <Row>
                        {leftSide}
                        {rightSide}
                        {compData}



                    </Row>
                    <Row>

                    </Row>
                    {/* <Row>
                        <Col>
                            <div style={{paddingTop: '150px!important'}}>
                                <Doughnut data={this.state.data}
                                width={500}
                                height={500}
                                options={{
                                    maintainAspectRatio: false,
                                    plugins: {
                                                labels: { render: 'label',
                                                    fontColor: 'white'}
                                    },
                                    legend: {
                                        display: false
                                    }
                                }}
                                getElementsAtEvent={elems =>{
                                    if(elems.length != 0){
                                        if(elems[0]._index == 0){
                                            console.log(elems[0]._index);
                                            this.state.showDance = true;
                                            this.state.showEnergy = false;
                                            this.state.showAcoustic = false;
                                            this.state.showLive = false;
                                            this.state.showValence = false;
                                            console.log('showDance: ' + this.state.showDance);
                                            this.forceUpdate();
                                        } else if(elems[0]._index == 1){
                                            this.state.showDance = false;
                                            this.state.showEnergy = true;
                                            this.state.showAcoustic = false;
                                            this.state.showLive = false;
                                            this.state.showValence = false;
                                            this.forceUpdate();
                                        } else if(elems[0]._index == 2){
                                            this.state.showDance = false;
                                            this.state.showEnergy = false;
                                            this.state.showAcoustic = true;
                                            this.state.showLive = false;
                                            this.state.showValence = false;
                                            this.forceUpdate();
                                        } else if(elems[0]._index == 3){
                                            this.state.showDance = false;
                                            this.state.showEnergy = false;
                                            this.state.showAcoustic = false;
                                            this.state.showLive = true;
                                            this.state.showValence = false;
                                            this.forceUpdate();
                                        } else if(elems[0]._index == 4){
                                            this.state.showDance = false;
                                            this.state.showEnergy = false;
                                            this.state.showAcoustic = false;
                                            this.state.showLive = false;
                                            this.state.showValence = true;
                                            this.forceUpdate();
                                        }
                                    }
                                }}
                                />
                            </div>
                        </Col>
                        <Col style={{color: 'white', paddingTop: '35px', paddingLeft: '100px'}}>
                            {visibleList}
                        </Col>
                    </Row> */}
                    {/* <Row>
                        {userDetailsChart}
                    </Row> */}

                  </Container>


                </div>

            </div>
            </div>
                  {/* <footer className="testclass">
                      {/* <div class="container"> */}
                        {/* <Col>
                            <p>Spotifynd Friends</p>
                        </Col> */}
                      {/* </div> */}
                  {/* </footer> */}
                  <Footer />
        </html>
        )
    }
};
//user 2 name clickable, goes to profile,
//compatibility score next to name clickable, displays details on bottom
//clicking another score updates the details
//Details:
//Here's how your songs stack up with {playlist2Name}
//{songName} is the most compatible song by {percentage}
//categories for chart, reflects the attribute of the song that most closely resembles the attributes of the playlist.
//think of better blurb, ^this sucks
//Your songs are most similar to {user2}'s playlist in terms of...
//get plugin to show number of tracks in the middle: i.e 70 songs
export default User
