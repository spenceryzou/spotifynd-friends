import React, { Component } from 'react'
import Router from 'next/router'
import { css } from "@emotion/core"
import ScaleLoader from "react-spinners/ScaleLoader"
import Header from '../components/Header'
import styles from '../pages/index.module.css'

var auth = require('firebase/auth');
var database = require('firebase/database');

var topID = 0;
var firebase = require('firebase/app');
var querystring = require('querystring');
var request = require('request')
var axios = require("axios");
var client_id = '2923d79235804ea58633989710346f3d';
var client_secret = 'd4813d196edf4940b58ba0aeedbf9ebc';
var redirect_uri = 'https://spotifynd-friends.herokuapp.com/profile';
var scope = 'user-read-private user-read-email playlist-read-private';
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            access_token: this.props.query.access_token,
            refresh_token: '',
            user: '',
            playlists: [],
            item: {
                album: {
                    images: [{ url: "" }]
                },
                name: "",
                artists: [{ name: "" }],
                duration_ms: 0,
            },
            is_playing: "Paused",
            progress_ms: 0

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

    static getInitialProps({ query }) {
        console.log("query " + JSON.stringify({ query }))
        return { query }
    }


    componentDidMount = () => {
        let url = window.location.href;
        var res = url.split("/");
        this.setState({ user: res[4] })
        this.getUserPlayer(res[4]);
    }


    getUserPlayer = (user) => {
        var dbRef = firebase.database().ref('users')
        console.log(user)



        dbRef.child(user).once("value", snapshot => {
            if (snapshot.exists()) {

                console.log(snapshot.key)
                console.log(snapshot.val().topPlaylist)
                this.setState({topID: snapshot.val().topPlaylist})
                console.log(this.state.listOfUsers)

            }

        });
    }




    render() {
        var message = '';
        message = "https://open.spotify.com/embed/playlist/" + this.state.topID 
        console.log(message);
        return (

            <div className="App">
                <p>User: {this.state.user}</p>

                <iframe src={message} width="300" height="380" frameborder="100" allowtransparency="true" allow="encrypted-media" className={styles.centeri} ></iframe>


            </div >
        );

    }
}


export default Profile;
