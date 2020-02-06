const express = require('express'); // Express web server framework
const next = require('next');
const port = process.env.PORT || 5000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');
const request = require('request'); // "Request" library
const querystring = require('querystring');

var credentials = {
    clientId : '2923d79235804ea58633989710346f3d',
    clientSecret : 'd4813d196edf4940b58ba0aeedbf9ebc',
    redirectUri : 'https://spotifynd-friends.herokuapp.com/'
};
const spotifyApi = new SpotifyWebApi(credentials); 

var client_id = '2923d79235804ea58633989710346f3d'; // Your client id
var client_secret = 'd4813d196edf4940b58ba0aeedbf9ebc'; // Your secret
var redirect_uri = 'https://spotifynd-friends.herokuapp.com/'; // Your redirect uri
app.prepare()
   .then(() => {
       const server = express();

       server.get('/access', (req, res) => {
            var code = req.query.code || null;
            spotifyApi.authorizationCodeGrant(code).then(
            function(data) {
          // Set the access token on the API object to use it in later calls
                spotifyApi.setAccessToken(data.body['access_token']);
                spotifyApi.setRefreshToken(data.body['refresh_token']);
                res.json({ at: data.body['access_token'] })
                //res.send({access_token : data.body['access_token']});
                /*res.redirect('/#' +
                querystring.stringify({
                access_token: access_token,
                refresh_token: refresh_token
                }));*/
            })
       });

       server.get('*', (req, res) => {
           return handle(req, res);
       });

       server.listen(port, err => {
           if (err) throw err;
           console.log(`> Ready on ${port}`);
       });
   })
   .catch(ex => {
       console.error(ex.stack);
       process.exit(1);
    });
/*app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/code', (req, res) => {
    
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});


app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());

  
app.get('/refresh_token', function(req, res) {
  
    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };
  
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        res.send({
          'access_token': access_token
        });
      }
    });
  });
  
const port = process.env.PORT || 5000;
app.listen(port);
console.log(`Listening on ${port}`);*/