import React, { Component } from 'react'
import Router from 'next/router'

import querystring from "querystring";
var client_id = '2923d79235804ea58633989710346f3d'; // Your client id
var client_secret = 'd4813d196edf4940b58ba0aeedbf9ebc'; // Your secret
const url = 'https://accounts.spotify.com/api/token';



export function getAccessToken(code){

  let fetchData = {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    code: code,
    redirect_uri: 'https://spotifynd-friends.herokuapp.com/',
    grant_type: 'authorization_code',

    headers: {
       'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
     },
      // 'Content-Type': 'application/x-www-form-urlencoded',

    //body: JSON.stringify(data)
  };
    fetch(url, fetchData)
      .then(response => response.json())
      .then(console.log(body.text()))
      .then(json => json);



};
