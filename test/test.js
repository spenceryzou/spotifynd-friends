import 'jsdom-global/register';
import { configure, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';
import { spy } from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';
import Spotify from '../pages/index.js';

configure({ adapter: new Adapter() });

describe('<Spotify />', () => {
    const comp = <Spotify />;
    it('button displays text \'Login\' when user is not logged in', () => {
        const wrapper = render(comp);
        expect(wrapper.text()).to.contain('Login');
    })
    it('button displays text \'Click to enter Spotifynd\' when user is logged in and access code is set', () => {
        const wrapper = mount(comp);
        wrapper.setState({access_token : "thisIsAFakeAccessToken"});
        expect(wrapper.render().text()).to.contain('Click to enter Spotifynd');
    })
});