import 'jsdom-global/register';
import { configure, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';
import Spotify from '../pages/index.js';
import User from '../pages/user.js';
var request = require('request')
var axios = require('axios')
const playlists = require('./fixtures/playlists.json');

configure({ adapter: new Adapter() });

let getAccessTokenFromCode = () => {
    //hard coded code for access token
    return new Promise(resolve => {
        var client_id = '2923d79235804ea58633989710346f3d';
        var client_secret = 'd4813d196edf4940b58ba0aeedbf9ebc';
        //var redirect_uri = 'https://spotifynd-friends.herokuapp.com/';
        let url = window.location.href;
        let access_token = '';
        console.log(url + "this is the url")
        if (url.indexOf('localhost') > -1)
            redirect_uri = 'http://localhost:3000/index'
        //let code = 'AQAYSoXom2WbjXa4fx_r1WYJqm1jfmFWv59EmIZiExZGbUgQYG8Ut-rkkZ3CZUDf1V5-RhGIc3NuNYCNR7JFqXD4UhOqDN9xwWGrMEfjzDsZX0Ao_e3KjJY65EO8r6AZ40DMwnXrz0HuB16_WmuEiU3AMCcAfBM9FvjOQzCxjsFP_U8jkRjgdwjNRKOMWyt_aKCfT6f75SOOUzZieYpZb5C2nTFuu0KLYxhgR0cWgY3qJGjNpv9H8dGlfwFT5M38e1HiWvyVeODHTFws'
        var authOptions = {
            method: 'POST',
            url: 'https://accounts.spotify.com/api/token',
            form: {
                //code: code,
                //redirect_uri: redirect_uri,
                grant_type: 'client_credential'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };
        request.post(authOptions, (error, response, body) => {
            console.log(body.access_token)
            if (!error && response.statusCode === 200) {

                access_token = body.access_token
                //refresh_token = body.refresh_token;
                //wrapper.setState({
                //access_token: access_token,
                //refresh_token: refresh_token
                //});  
            }
            resolve(access_token)
        })
    })
}

let getPlaylists = (wrapper, access_token) => {
    return new Promise(resolve => {
        var options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, (error, response, body) => {
            console.log('Access token:' + access_token)
            console.log(body);
            wrapper.setState({ user: body.id })
            console.log('user: ' + wrapper.state().user)
            var playlistOptions = {
                url: 'https://api.spotify.com/v1/users/' + wrapper.state().user + '/playlists',
                qs: { limit: '10' },
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
            };

            console.log('user right before playlist: ' + wrapper.state().user)

            // use the access token to access the Spotify Web API
            request.get(playlistOptions, (error, response, body) => {
                console.log(body);
                wrapper.setState({ playlists: body.items })
                for (var i = 0; i < wrapper.state().playlists.length; i++) {
                    wrapper.state().playlists[i].key = i.id
                    console.log(wrapper.state().playlists[i].key)
                }
                console.log('this.state.playlists' + wrapper.state().playlists)
            });
        });
        resolve()
    })
}
describe('<Spotify />', () => {
    const comp = <Spotify />;
    it('button displays text \'Login\' when user is not logged in', () => {
        const wrapper = render(comp);
        expect(wrapper.text()).to.contain('Login');
    })
    it('button displays text \'Enter\' when user is logged in and access code is set', () => {
        const wrapper = mount(comp);
        wrapper.setState({ access_token: "thisIsAFakeAccessToken" });
        console.log(wrapper.state().access_token);
        expect(wrapper.render().text()).to.contain('Enter');
    })
});


describe('<User />', () => {
    let props = { url: { query: { access_token: "" } } }
    const comp = <User {...props} />;
    describe('when stubbed', () => {
        const wrapper = mount(comp);
        const component = wrapper.instance()
        let callback;
        beforeEach(() => {
            callback = sinon.stub(request, 'get')
            callback.onCall(0).yields(null, { statusCode: 200 },{href: "https://api.spotify.com/v1/playlists/2wqFuQ1MKD050WqGKbnv70/tracks?offset=0&limit=100", items: [{ track: { id: '0nbXyq5TXYPCO7pr3N8S4I' } }, { track: { id: '6RRNNciQGZEXnqk8SQ9yv5' } }, { track: { id: '14LnbVqMEasGX48zJsPrvG' } }], limit: 100, next: null, offset: 0})
        });
        afterEach(() => {
            callback.restore();
        });
        describe('select button functional test for user.js', (done) => {
            it('functional test: produces correct compatibility score given demo playlists', async () => {
                sinon.stub(component, 'getUserPlaylists').callsFake(function fakeFn() {
                    wrapper.setState({
                        playlists: [
                            {
                                "collaborative": false,
                                "description": "",
                                "external_urls": {
                                    "spotify": "https://open.spotify.com/playlist/2wqFuQ1MKD050WqGKbnv70"
                                },
                                "href": "https://api.spotify.com/v1/playlists/2wqFuQ1MKD050WqGKbnv70",
                                "id": "2wqFuQ1MKD050WqGKbnv70",
                                "images": [
                                    {
                                        "height": 640,
                                        "url": "https://i.scdn.co/image/53de6cd3ae807bb4e41cbd8697d76adbdc1599de",
                                        "width": 640
                                    }
                                ],
                                "name": "SPENCER PUBLIC STUB PLAYLIST FOR CS PROJECT",
                                "owner": {
                                    "display_name": "danielxzou",
                                    "external_urls": {
                                        "spotify": "https://open.spotify.com/user/danielxzou"
                                    },
                                    "href": "https://api.spotify.com/v1/users/danielxzou",
                                    "id": "danielxzou",
                                    "type": "user",
                                    "uri": "spotify:user:danielxzou"
                                },
                                "primary_color": null,
                                "public": true,
                                "snapshot_id": "NCw3Yjk2ZjNmOWQyNzViNjM0YTg1NWNkNzEzZTQyOWY1ZmJlZmQxYTU5",
                                "tracks": {
                                    "href": "https://api.spotify.com/v1/playlists/2wqFuQ1MKD050WqGKbnv70/tracks",
                                    "total": 3
                                },
                                "type": "playlist",
                                "uri": "spotify:playlist:2wqFuQ1MKD050WqGKbnv70"
                            }
                        ]
                    })
                });
                sinon.stub(component, 'comparePlaylists').callsFake(function fakeFn1() {
                    wrapper.setState({trackFeatures: playlists.playlist1.success.body.trackFeatures,
                                      artistID: playlists.playlist1.success.body.artistID,
                                      artist: playlists.playlist1.success.body.artist, 
                                      name: playlists.playlist1.success.body.name,
                                      genres: playlists.playlist1.success.body.genres,
                                      top100trackFeatures: playlists.playlist2.success.body.trackFeatures,
                                      top100artistID: playlists.playlist2.success.body.artistID,
                                      top100artist: playlists.playlist2.success.body.artist,
                                      top100name: playlists.playlist2.success.body.name,
                                      top100genres: playlists.playlist2.success.body.genres
                                    })
                component.componentDidMount();
                
                // before(done) ->
                //     sinon.stub(request, 'get').yields(null, { statusCode: 200 },
                //         {
                //             href: "https://api.spotify.com/v1/playlists/2wqFuQ1MKD050WqGKbnv70/tracks?offset=0&limit=100", items: [{ track: { id: '0nbXyq5TXYPCO7pr3N8S4I' } }, { track: { id: '6RRNNciQGZEXnqk8SQ9yv5' } }, { track: { id: '14LnbVqMEasGX48zJsPrvG' } }], limit: 100, next: null, offset: 0
                //         })
                // done()
                // after(done) ->
                //     request.get.restore()
                // done()
                sinon.stub(component, 'comparePlaylists').callsFake(function fakeFn1() {
                    wrapper.setState({trackFeatures: playlists.playlist1.success.body.trackFeatures,
                                      artistID: playlists.playlist1.success.body.artistID,
                                      artist: playlists.playlist1.success.body.artist, 
                                      name: playlists.playlist1.success.body.name,
                                      genres: playlists.playlist1.success.body.genres,
                                      top100trackFeatures: playlists.playlist2.success.body.trackFeatures,
                                      top100artistID: playlists.playlist2.success.body.artistID,
                                      top100artist: playlists.playlist2.success.body.artist,
                                      top100name: playlists.playlist2.success.body.name,
                                      top100genres: playlists.playlist2.success.body.genres
                                    })
                    wrapper.setState({status: "Calculating score"})
                    var compatibility = wrapper.calculateScore()
                    wrapper.setState({compatibility: compatibility,
                                      loading: false});
                })
                    //     trackFeatures: [{
                    //         danceability: 0.896,
                    //         energy: 0.586,
                    //         key: 10,
                    //         loudness: -6.687,
                    //         mode: 0,
                    //         speechiness: 0.0559,
                    //         acousticness: 0.104,
                    //         instrumentalness: 0,
                    //         liveness: 0.79,
                    //         valence: 0.642,
                    //         tempo: 116.971,
                    //         type: "audio_features",
                    //         id: "0nbXyq5TXYPCO7pr3N8S4I",
                    //         uri: "spotify:track:0nbXyq5TXYPCO7pr3N8S4I",
                    //         track_href: "https://api.spotify.com/v1/tracks/0nbXyq5TXYPCO7pr3N8S4I",
                    //         analysis_url: "https://api.spotify.com/v1/audio-analysis/0nbXyq5TXYPCO7pr3N8S4I",
                    //         duration_ms: 196653,
                    //         time_signature: 4
                    //     },
                    //     {
                    //         danceability: 0.771,
                    //         energy: 0.671,
                    //         key: 2,
                    //         loudness: -5.617,
                    //         mode: 1,
                    //         speechiness: 0.0553,
                    //         acousticness: 0.00929,
                    //         instrumentalness: 0,
                    //         liveness: 0.0637,
                    //         valence: 0.714,
                    //         tempo: 85.026,
                    //         type: "audio_features",
                    //         id: "6RRNNciQGZEXnqk8SQ9yv5",
                    //         uri: "spotify:track:6RRNNciQGZEXnqk8SQ9yv5",
                    //         track_href: "https://api.spotify.com/v1/tracks/6RRNNciQGZEXnqk8SQ9yv5",
                    //         analysis_url: "https://api.spotify.com/v1/audio-analysis/6RRNNciQGZEXnqk8SQ9yv5",
                    //         duration_ms: 171360,
                    //         time_signature: 4
                    //     },
                    //     {
                    //         danceability: 0.343,
                    //         energy: 0.00528,
                    //         key: 1,
                    //         loudness: -30.074,
                    //         mode: 0,
                    //         speechiness: 0.0524,
                    //         acousticness: 0.993,
                    //         instrumentalness: 0.867,
                    //         liveness: 0.0888,
                    //         valence: 0.226,
                    //         tempo: 140.213,
                    //         type: "audio_features",
                    //         id: "14LnbVqMEasGX48zJsPrvG",
                    //         uri: "spotify:track:14LnbVqMEasGX48zJsPrvG",
                    //         track_href: "https://api.spotify.com/v1/tracks/14LnbVqMEasGX48zJsPrvG",
                    //         analysis_url: "https://api.spotify.com/v1/audio-analysis/14LnbVqMEasGX48zJsPrvG",
                    //         duration_ms: 257507,
                    //         time_signature: 4}
                    //     ],
                    //     artistID: ["757aE44tKEUQEqRuT6GnEB", "06HL4z0CvFAxyc27GXpf02", "7y97mc3bZRFXzT2szRM4L4"],
                    //     artist: ["Roddy Ricch", "Taylor Swift", "Frédéric Chopin"],
                    //     name: ["The Box", "You Need To Calm Down", "Nocturne in C-Sharp Minor, B. 49"],
                    //     genres: [["melodic rap", "rap"],["dance pop", "pop", "post-teen pop"],["classical", "early romantic era", "polish classical"]]
                    // });
                component.find('.button').prop('onClick')()
                expect(wrapper.render().text()).to.contain('64');
        // await axios(authOptions)
        //     .then((body) => {
        //             let access_token = body.access_token;
        //             wrapper.setState({
        //                 access_token: access_token
        //             });
        //         }
        //     )
        //console.log(wrapper.state().access_token)
        //wrapper.setState({access_token:})
                })
            });
        })
    })
})

