import { configure, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';
import { spy } from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';
import Spotify from '../pages/index.js';

configure({ adapter: new Adapter() });

describe('<Spotify />', () => {
    it('button displays text \'Login\' when user is not logged in', () => {
        const wrapper = render(<Spotify />);
        expect(wrapper.text()).to.contain('Login');
    })
});