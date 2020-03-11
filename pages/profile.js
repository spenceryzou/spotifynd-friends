import React, { Component } from 'react'
import Router from 'next/router'
import { css } from "@emotion/core"
import ScaleLoader from "react-spinners/ScaleLoader"
import Header from '../components/Header'
import styles from '../pages/index.module.css'
import { FormGroup, ControlLabel, FormControl, Card ,Container, Row, Col} from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'

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
                <Header props={this.state.access_token} />

                <div>
                  <Container>

                    <Row>
                      <Col>
                        <Card bg="dark" style={{ height: '550px' }} text="white" >
                        <Card.Header>User: {this.state.user}</Card.Header>
                        <div className="overflow-auto" style={{  maxHeight:"480px" }}>

                            <Card.Body>
                              <Card.Text>
                                  
                                  <iframe src={message} width="300" height="380" frameborder="100" allowtransparency="true" 
                                  allow="encrypted-media" className={styles.centeri} ></iframe>
                              </Card.Text>
                            </Card.Body>
                            </div>
                        </Card>
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

                  <footer className="footer">

                    <div class="container-fluid text-center text-md-left">

                        <div class="row">

                            <div class="col-md-6 mt-md-0 mt-3">

                                <h5 class="text-uppercase">Footer Content</h5>
                                <p>Here you can use rows and columns to organize your footer content.</p>

                            </div>

                            <hr class="clearfix w-100 d-md-none pb-3"></hr>

                            <div class="col-md-3 mb-md-0 mb-3">

                                <h5 class="text-uppercase">Links</h5>

                                <ul class="list-unstyled">
                                <li>
                                    <a href="#!">Link 1</a>
                                </li>
                                <li>
                                    <a href="#!">Link 2</a>
                                </li>
                                <li>
                                    <a href="#!">Link 3</a>
                                </li>
                                <li>
                                    <a href="#!">Link 4</a>
                                </li>
                                </ul>

                            </div>

                            <div class="col-md-3 mb-md-0 mb-3">

                                <h5 class="text-uppercase">Links</h5>

                                <ul class="list-unstyled">
                                <li>
                                    <a href="#!">Link 1</a>
                                </li>
                                <li>
                                    <a href="#!">Link 2</a>
                                </li>
                                <li>
                                    <a href="#!">Link 3</a>
                                </li>
                                <li>
                                    <a href="#!">Link 4</a>
                                </li>
                                </ul>

                            </div>
                
                        </div>

                    </div>
                    <div class="footer-copyright text-center py-3">© 2020 Copyright:
                        <a href="https://mdbootstrap.com/"> MDBootstrap.com</a>
                    </div>

                    </footer>
        </html>
        )

    }
};


export default Profile;