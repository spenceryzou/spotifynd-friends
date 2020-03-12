//import 'jsdom-global/register';
import { configure, mount, render, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';
import Spotify from '../pages/index.js';
import User from '../pages/user.js';
let jsdom = require('jsdom-global')(
    undefined,
    {
        url: "http://localhost"
    }
);

configure({ adapter: new Adapter() });

describe('<Spotify />', () => {
    const comp = <Spotify />;
    it('generateRandomString produces string of correct length', () => {
        const wrapper = shallow(comp);
        const instance = wrapper.instance();
        let length1 = 0;
        let length2 = 1;
        let length3 = 2;
        let length4 = 5;
        let length5 = 12;
        let length6 = 48;
        expect(instance.generateRandomString(length1).length).equal(length1);
        expect(instance.generateRandomString(length2).length).equal(length2);
        expect(instance.generateRandomString(length3).length).equal(length3);
        expect(instance.generateRandomString(length4).length).equal(length4);
        expect(instance.generateRandomString(length5).length).equal(length5);
        expect(instance.generateRandomString(length6).length).equal(length6);
        expect(instance.generateRandomString(-1).length).equal(0);
    })
    it('home page shows title \"spotifynd friends\"', () => {
        const wrapper = render(comp);
        expect(wrapper.text()).to.contain('spotifynd');
        expect(wrapper.text()).to.contain('friends');
    })
    // it('button displays text \'Enter\' when user is logged in and access code is set', () => {
    //     const wrapper = mount(comp);
    //     wrapper.setState({ access_token: "thisIsAFakeAccessToken" });
    //     console.log(wrapper.state().access_token);
    //     expect(wrapper.render().text()).to.contain('Enter');
    // })
});

describe('<User />', () => {
    const comp = <User />;
    let componentDidMountStub = null;
    beforeEach(() => {
        // componentDidMountStub = sinon.stub(comp, 'componentDidMount').callsFake(function() {
        //     // Does nothing
        // });
        User.prototype.componentDidMount = () => {

        }
    });
    // afterEach(() => {
    //     componentDidMountStub.restore();
    // });

    it('assignPlaylistTracksNames returns no playlists to display when items is empty', () => {
        const wrapper = mount(comp);
        const instance = wrapper.instance();
        let items = [];
        instance.assignPlaylistTracksName(items);
        let state = wrapper.state().playlisttracknames;
        console.log(state)
        expect(wrapper.state().playlisttracknames.equal(<p>No playlists to display</p>));
    })


    it('convertToInt returns array of same length as argument', () => {
        const wrapper = shallow(comp);
        const instance = wrapper.instance();
        let arr1 = [];
        for(let i = 0; i < 2; i++){
            arr1.push({key: i});
        }
        let arr2 = [];
        for(let i = 0; i < 10; i++){
            arr2.push({key: i});
        }
        let arr3 = [];
        for(let i = 0; i < 50; i++){
            arr3.push({key: i});
        }
        let emptyArr = [];
        expect(instance.convertToInt(arr1).length).equal(arr1.length);
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
//                 sinon.stub(component, 'getUserPlaylists').callsFake(function fakeFn() {
//                     wrapper.setState({
//                         playlists: [
//                             {
//                                 "collaborative": false,
//                                 "description": "",
//                                 "external_urls": {
//                                     "spotify": "https://open.spotify.com/playlist/2wqFuQ1MKD050WqGKbnv70"
//                                 },
//                                 "href": "https://api.spotify.com/v1/playlists/2wqFuQ1MKD050WqGKbnv70",
//                                 "id": "2wqFuQ1MKD050WqGKbnv70",
//                                 "images": [
//                                     {
//                                         "height": 640,
//                                         "url": "https://i.scdn.co/image/53de6cd3ae807bb4e41cbd8697d76adbdc1599de",
//                                         "width": 640
//                                     }
//                                 ],
//                                 "name": "SPENCER PUBLIC STUB PLAYLIST FOR CS PROJECT",
//                                 "owner": {
//                                     "display_name": "danielxzou",
//                                     "external_urls": {
//                                         "spotify": "https://open.spotify.com/user/danielxzou"
//                                     },
//                                     "href": "https://api.spotify.com/v1/users/danielxzou",
//                                     "id": "danielxzou",
//                                     "type": "user",
//                                     "uri": "spotify:user:danielxzou"
//                                 },
//                                 "primary_color": null,
//                                 "public": true,
//                                 "snapshot_id": "NCw3Yjk2ZjNmOWQyNzViNjM0YTg1NWNkNzEzZTQyOWY1ZmJlZmQxYTU5",
//                                 "tracks": {
//                                     "href": "https://api.spotify.com/v1/playlists/2wqFuQ1MKD050WqGKbnv70/tracks",
//                                     "total": 3
//                                 },
//                                 "type": "playlist",
//                                 "uri": "spotify:playlist:2wqFuQ1MKD050WqGKbnv70"
//                             }
//                         ]
//                     })
//                 });
//                 sinon.stub(component, 'get100').callsFake(function fake() {
//                     wrapper.setState({
//                         playlistTracks: playlists.default.tracks.items
//                     })
//                 });
//                 component.componentDidMount();
//                 sinon.stub(component, 'comparePlaylists').callsFake(async function fakeFn1() {
//                     console.log("clicked button")
//                     wrapper.setState({trackFeatures: playlists.playlist1.success.body.trackFeatures,
//                                       artistID: playlists.playlist1.success.body.artistID,
//                                       artist: playlists.playlist1.success.body.artist, 
//                                       name: playlists.playlist1.success.body.name,
//                                       genres: playlists.playlist1.success.body.genres,
//                                       top100trackFeatures: playlists.playlist2.success.body.trackFeatures,
//                                       top100artistID: playlists.playlist2.success.body.artistID,
//                                       top100artist: playlists.playlist2.success.body.artist,
//                                       top100name: playlists.playlist2.success.body.name,
//                                       top100genres: playlists.playlist2.success.body.genres
//                                     })
//                     wrapper.setState({status: "Calculating score"})
//                     var key = 'null'
//                     let compatibility = component.calculateScore(key)
//                         wrapper.setState({compatibility: compatibility,
//                             loading: false});
//                     console.log(wrapper.state().compatibility)
//                 })
//                 wrapper.find('.click').prop('onClick')()               
//                 let compatibility = await Promise.resolve(wrapper.state().compatibility)
//                 wrapper.setState({compatibility: compatibility})
//                 expect(wrapper.state().compatibility).to.equal(64);
//                 //expect(wrapper.render().text()).to.contain('64');
//                 })
//             });
//         })
//     })


