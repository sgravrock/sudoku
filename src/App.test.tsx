import React from 'react';
import {App} from './App';
import {mount} from 'enzyme';


describe('App', () => {
	it('renders without crashing', () => {
		mount(<App />);
	});
});
