import React, { Component } from 'react'
import Router from 'next/router'
var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library


 export default (req, res) => {
   var code = req.query.code || null;
   var state = req.query.state || null;
   var storedState = req.cookies ? req.cookies[stateKey] : null;

   if (state === null || state !== storedState) {
     res.redirect('/#' +
     querystring.stringify({
      error: 'state_mismatch'
    }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    json: true
  };
 }
