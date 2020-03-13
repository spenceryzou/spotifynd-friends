import React, { Component } from 'react'
import Router from 'next/router'
import { css } from "@emotion/core"
import ScaleLoader from "react-spinners/ScaleLoader"
import Header from '../components/Header'
import { FormGroup, ControlLabel, FormControl, Card ,Container, Row, Col} from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Image from 'react-bootstrap/Image'
import { Doughnut } from 'react-chartjs-2';
import 'chartjs-plugin-labels'
import styles from '../pages/profile.module.css'
import Footer from '../components/Footer'


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
            user: this.props.query.user,
            displayName: this.props.query.displayName,
            userImage: 'https://www.palmcityyachts.com/wp/wp-content/uploads/palmcityyachts.com/2015/09/default-profile.png',
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
            progress_ms: 0,
            instagram: '',
            instagramUrl: '',
            hasInstagram:'',
            location: ''

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
        console.log("access: " + this.state.access_token);
        console.log("user: " + this.state.user)
        // let url = window.location.href;
        // var res = url.split("/");

        // this.setState({ user: res[4] })
        this.getUserPlayer(this.state.user);
        this.getURIandImage(this.state.user);
    }

    getURIandImage = (user) => {
        console.log("in geturi user: " + this.state.access_token);

        let access_token = this.state.access_token
        var options = {
            url: 'https://api.spotify.com/v1/users/' + user,
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
        };
        if (access_token != "") {
            // use the access token to access the Spotify Web API
            request.get(options, (error, response, body) => {
                console.log('Access token:' + access_token)
                console.log(body);
                console.log(body.uri);
                this.setState({ uri: body.uri});
                if(body.images.length != 0){
                    this.setState({userImage: body.images[0].url});
                }
            });
        }
        console.log(this.state.uri);
    }

    getUserPlayer = (user) => {
        var dbRef = firebase.database().ref('users')
        console.log(user)



        dbRef.child(user).once("value", snapshot => {
            if (snapshot.exists()) {

                const userInstagram = snapshot.val().instagram;
                const userTopPlaylist = snapshot.val().topPlaylist;
                const userLocation = snapshot.val().location;

                console.log(snapshot.key)
                console.log(snapshot.val().topPlaylist)
                

                if(userTopPlaylist != null){
                this.setState({topID: snapshot.val().topPlaylist})
                }

                if(userInstagram != null){
                    this.setState({instagram: snapshot.val().instagram})

                }

                if(userLocation != null){
                    this.setState({location: snapshot.val().location})
                }
                console.log(this.state.listOfUsers)

            }

        });
    }


    checkIfInstagramLinked = (instagramUsername) => {

        
        if(instagramUsername != ''){
            return (<div>
            <h1><b>{this.state.displayName}</b></h1>
            <a><b>{this.state.location}</b></a>
            <button style={{fontFamily: 'Roboto'}} onClick={ event => window.open(this.state.instagramUrl, "_blank")} className={styles.button}>
              <i className={styles.iconinstagram}></i>{this.state.hasInstagram}
            </button>
            </div>                
        )}

        return (<div>
            <h1><b>{this.state.user}</b></h1>
            <a><b>{this.state.location}</b></a>
                                     
             <p >{this.state.hasInstagram}</p> </div>
            
            )
        

        
    }



    render() {
        
        var playlist = '';
        playlist = "https://open.spotify.com/embed/playlist/" + this.state.topID 
        console.log(playlist);

        this.state.hasInstagram = "User hasn't linked their instagram"
        var instagramUser = this.state.instagram

        let uri = this.state.uri;
        console.log(uri);
        let followURL = "https://open.spotify.com/follow/1/?uri=" + `${uri}` + "&size=detail&theme=dark";
        console.log(followURL);

        if(instagramUser != ''){

            this.state.hasInstagram = this.state.instagram 

            this.state.instagramUrl = 'https://www.instagram.com/' + instagramUser

        }






        
        return (

            <html>
                <div className="testclass">
                <div>
                <style jsx>{`
                    .container {
                        margin: 50px;
                    }
                    .bg-primary {
                        background-color: #373737;
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
                    <link href="https://fonts.googleapis.com/css?family=Roboto:700&display=swap" rel="stylesheet"></link>
                  <link href="https://fonts.googleapis.com/css?family=Montserrat&display=swap" rel="stylesheet" /> 
                </head>
                <Header props={''} />
                

                <div>
                    
                  <Container>
                                      
                  <Row>
                            <Col md="auto" style={{}}>
                                <Image src={this.state.userImage} roundedCircle style={{marginTop:'150px', marginLeft: '80px'}}/>
                            </Col>
                            <Col style={{color: 'white', paddingTop: '120px'}}>

                            <Row>
                                {this.checkIfInstagramLinked(this.state.instagram)}
                            </Row>
                            
                            <Row>
                                <iframe src={'https://open.spotify.com/follow/1/?uri=' + `${uri}` + '&size=detail&theme=dark'
                                } style={{border: 'none', overflow: 'hidden', allowtransparency: 'true', padding: '0px'}}
                                ></iframe>
                            </Row>
                                
                            </Col>
                            <Col>
                            <div className="overflow-auto" style={{  maxHeight:"480px", marginTop: '20px' }}>
                            <Card.Body>
                              <Card.Text>
                                  <iframe src={playlist} width="500px" height="400px" frameborder="100" allowtransparency="true" 
                                  allow="encrypted-media" className={styles.centeri} ></iframe>
                              </Card.Text>
                            </Card.Body>
                            </div>
                      </Col>
                    </Row>
 
                    

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


export default Profile;


