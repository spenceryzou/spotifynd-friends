import React, { Component } from 'react'
import Router from 'next/router'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'

var querystring = require('querystring');

var request = require('request')
//default setting of top playlist object and location are set to null
//taking in user input and setting to variables which will be inputted into database later on
//when plalist is null, then user will need to change

class Settings extends Component{
  constructor(props) {
      super(props);
      this.state = {
        access_token: this.props.url.query.access_token,
        refresh_token: '',

      }
    }
    componentDidMount = () => {

    }

    render(){

      return (
        <div>
        <head>
          <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossorigin="anonymous"
            />
        </head>
        <div className="row justify-content-center mt-5">

        <DropdownButton id="dropdown-basic-button" title="Dropdown button">
          <Dropdown.Item eventKey="1">Action</Dropdown.Item>
          <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
          <Dropdown.Item eventKey="3" active>
            Active Item
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item eventKey="4">Other</Dropdown.Item>
        </DropdownButton>

        </div>


        </div>


      )






    }



}
export default Settings;
