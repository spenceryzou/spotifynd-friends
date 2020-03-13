import React, {Component} from 'react'
import Link from 'next/link'
import {Navbar, Nav, NavDropdown, Form, FormControl, Button} from 'react-bootstrap'

const linkStyle = {
  marginRight: 15
};

const Header = (props) => {
  let access_token = props.props
  return(
    <div>
      <style jsx>{`
  .navbar {
    
    font-family: circular-light.woff2;
   
}



          
      `}</style>
    <head>
    
    <link
    
    rel="stylesheet"
    href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
    crossOrigin="anonymous"
      />
      <link src="../fonts/circular-light.woff2" rel="stylesheet" />
      
    </head>
    <Navbar bg="light" expand="lg" className="navBar" >
    <Navbar.Brand className="mr-auto">
        <Link href={`/user?access_token=${props.props}`} as='/user' passHref>
          <Nav.Link className='navLink' style={{color: 'black', font:'serif'}}>Spotifynd Friends</Nav.Link>
        </Link>
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <Link href={`/settings?access_token=${props.props}`} as='/settings' passHref>
          <Nav.Link>Settings</Nav.Link>
        </Link>
      </Nav>
      {/* <Form inline>
        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
        <Button variant="outline-success">Search</Button>
      </Form> */}
    </Navbar.Collapse>
    </Navbar>
    </div>
  );
};

export default Header;
