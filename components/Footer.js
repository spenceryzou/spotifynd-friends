import React, {Component} from 'react'
import Link from 'next/link'
import {Navbar, Nav, NavDropdown, Form, FormControl, Button} from 'react-bootstrap'

const linkStyle = {
  marginRight: 15
};

const Footer = (props) => {
  let access_token = props.props
  return(
    <footer className="footer">

    <div class="container-fluid text-center text-md-left">

        <div class="row">

            <div class="col-md-6 mt-md-0 mt-3">

                <h5 class="text-uppercase">Spotifynd Friends</h5>
                <p></p>

            </div>

            <hr class="clearfix w-100 d-md-none pb-3"></hr>

        </div>

    </div>
    <div class="footer-copyright text-center py-3">© 2020 Copyright:
        <a href="https://spotifynd-friends.herokuapp.com/"> Spotifynd Friends</a>
    </div>

    </footer>
  );
};

export default Footer;
