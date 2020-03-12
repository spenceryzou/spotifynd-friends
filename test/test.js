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

describe('<Spotify />', () => {
    const comp = <Spotify />;
    it('button displays text \'Continue With Spotify\' when user is not logged in', () => {
        const wrapper = render(comp);
        expect(wrapper.text()).to.contain('Continue with Spotify');
    })
    it('button displays text \'Enter\' when user is logged in and access code is set', () => {
        const wrapper = mount(comp);
        wrapper.setState({ access_token: "thisIsAFakeAccessToken" });
        console.log(wrapper.state().access_token);
        expect(wrapper.render().text()).to.contain('Enter');
    })
});



describe('<User />', () => {
    let props = { query: { access_token: "" }}
    var comp = <User {...props} />;
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
        describe('select button functional test for user.js', () => {
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
                sinon.stub(component, 'get100').callsFake(function fake() {
                    wrapper.setState({
                        playlistTracks: playlists.default.tracks.items
                    })
                });
                component.componentDidMount();
                sinon.stub(component, 'comparePlaylists').callsFake(async function fakeFn1() {
                    console.log("clicked button")
                    wrapper.setState({      
                        trackFeatures: playlists.playlist1.success.body.trackFeatures,
                        artistID: playlists.playlist1.success.body.artistID,
                        genres: playlists.playlist1.success.body.genres,
                        playlisttracknames: playlists.playlist1.success.body.name,
                        otherTrackFeatures: playlists.playlist2.success.body.trackFeatures,
                        otherArtistID: playlists.playlist2.success.body.artistID,
                        otherGenres: playlists.playlist2.success.body.genres,
                        otherLength: 3
                                    })
                    wrapper.setState({status: "Calculating score"})
                    var key = ' '
                    let compatibility = component.calculateUserScore(key)
                        wrapper.setState({compatibility: compatibility,
                            loading: false});
                    console.log(wrapper.state().compatibility)
                })
                wrapper.find('.click').prop('onClick')()               
                let compatibility = await Promise.resolve(wrapper.state().compatibility)
                wrapper.setState({compatibility: compatibility})
                expect(wrapper.state().compatibility).to.equal(64);
                //expect(wrapper.render().text()).to.contain('64');
                })
            });
        })
    })


// describe('<User />', () => {
//     let props = { query: { access_token: "" }}
//     var comp = <User {...props} />;
//     describe('when stubbed', () => {
//         const wrapper = mount(comp);
//         const component = wrapper.instance()
//         let callback;
//         beforeEach(() => {
//             callback = sinon.stub(request, 'get')
//             callback.onCall(0).yields(null, { statusCode: 200 },{href: "https://api.spotify.com/v1/playlists/2wqFuQ1MKD050WqGKbnv70/tracks?offset=0&limit=100", items: [{ track: { id: '0nbXyq5TXYPCO7pr3N8S4I' } }, { track: { id: '6RRNNciQGZEXnqk8SQ9yv5' } }, { track: { id: '14LnbVqMEasGX48zJsPrvG' } }], limit: 100, next: null, offset: 0})
//         });
//         afterEach(() => {
//             callback.restore();
//         });
//         describe('select button functional test for user.js', () => {
//             it('functional test: produces correct compatibility score given demo playlists', async () => {
        
              
//                 component.componentDidMount();
//                 sinon.stub(component, 'compareWithOtherUser').callsFake(async function fakeFn1() {
//                     console.log("clicked button")
//                     wrapper.setState({
                                      
//                                       trackFeatures: playlists.playlist1.success.body.trackFeatures,
//                                       artistID: playlists.playlist1.success.body.artistID,
//                                       genres: playlists.playlist1.success.body.genres,
//                                       playlisttracknames: playlists.playlist1.success.body.name,
//                                       otherTrackFeatures: playlists.playlist2.success.body.trackFeatures,
//                                       otherArtistID: playlists.playlist2.success.body.artistID,
//                                       otherGenres: playlists.playlist2.success.body.genres,
//                                       otherLength: 3
                                      
//                                     })
//                     wrapper.setState({status: "Calculating score"})
//                     var key = 'null'
//                     let compatibility =  component.calculateUserScore(key)
//                         wrapper.setState({listOfUserCompatibilities: this.state.listOfUserCompatibilities.concat(compatibility),
//                             loading: false});
//                             expect(wrapper.state().listOfUserCompatibilities).to.equal(64);

//                     console.log(wrapper.state().compatibility)
//                 })
//                 // wrapper.find('.click').prop('onClick')()               
//                 // let listOfUserCompatibilities = await Promise.resolve(wrapper.state().listOfUserCompatibilities)
//                 // wrapper.setState({listOfUserCompatibilities: listOfUserCompatibilities})
//                 //expect(wrapper.state().listOfUserCompatibilities).to.equal(64);
//                 //expect(wrapper.render().text()).to.contain('64');
//                 })
//             });
//        })
//     })


