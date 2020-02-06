import React, { Component } from 'react'
import Router from 'next/router'

import querystring from "querystring";

const url = 'https://accounts.spotify.com/api/token';



export function getAccessToken(code){

  let fetchData = {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    code: code,
    redirect_uri: 'https://spotifynd-friends.herokuapp.com/',
    grant_type: 'authorization_code',
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
    return fetch(url, fetchData)
      .then(response => response.json())
      .then(json => json);

};
