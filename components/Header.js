import React, {Component} from 'react'
import Link from 'next/link'
import {Navbar, Nav, NavDropdown, Form, FormControl, Button} from 'react-bootstrap'

const linkStyle = {
  marginRight: 15
};

const Header = (props) => {
  let access_token = props.props
  console.log("access token from header: " + access_token)
  return(
    <div>
      <style jsx>{`
        .navLink{
          color: 'blue';
        }
      `}</style>
    <head>
    <link
    rel="stylesheet"
    href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
    crossOrigin="anonymous"
      />
    </head>
    <Navbar bg="light" expand="lg">
    <Navbar.Brand >Spotifynd Friends</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <Link href={`/user?access_token=${props.props}`} as='/user' passHref>
          <Nav.Link className='navLink'>User</Nav.Link>
        </Link>
        <Link href={`/settings?access_token=${props.props}`} as='/settings' passHref>
          <Nav.Link>Settings</Nav.Link>
        </Link>
        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
          <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
        </NavDropdown>
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
