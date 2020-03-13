import React, { Component } from 'react'
import Router from 'next/router'
import Container from 'react-bootstrap/Container'

class LoginError extends Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }

    componentDidMount = () => {

    }

    render(){
        return(
            <div>
            <style jsx>{`
                html {
                    background: linear-gradient(to bottom, #373737 0%, #191414 50%);
                    background-size: cover;
                    background-repeat: no-repeat;
                    overflow-y: hidden;
                    font-family: Montserrat !important;
                }
                html, body {
                  margin: 0;
                  height: 100%;
                  font-family: Montserrat;
                  color: #fff;

              }
              .error{
                font-family: Montserrat;
              }
              .testclass{
                font-family: Montserrat;
              }
                `}</style>

          <head>
          <link href="https://fonts.googleapis.com/css?family=Montserrat&display=swap" rel="stylesheet" />
          </head>


              <div className = "testclass" style={{display:"block", width: "35%",marginLeft: "auto", marginRight: "auto", marginTop: "250px"}}>
                Sorry, it seems that you can't use Spotifynd Friends. We sincerely apologize for the inconvenience.
                Due to changes in username protocols in Spotify, your account will be unable to access our program due to differences in naming practices.
                  </div>

            </div>
        )
    }
}

export default LoginError;
