import { mount } from 'enzyme';
import { expect } from 'chai';
import { spy } from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';
import Spotify from '../pages/index.js';

let assert = require('assert')

describe('Login Page', function() {
    describe('Login Button', function() {
        it('button displays text \'Login\' when user is not logged in', () => {
            const wrapper = mount(<Spotify />)
            
        }
    });
  });