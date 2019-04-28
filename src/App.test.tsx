import React from 'react';
import {App} from './App';
import {mount} from 'enzyme';
import {findButtonByText} from "./testSupport/queries";
import {Game} from "./Game";


describe('App', () => {
	it('shows an easy puzzle', () => {
		const subject = mount(<App />);
		findButtonByText(subject, 'Easy').simulate('click');
		expect(subject.find(Game)).toExist();
	});

	it('shows a medium puzzle', () => {
		const subject = mount(<App/>);
		findButtonByText(subject, 'Medium').simulate('click');
		expect(subject.find(Game)).toExist();
	});

	it('shows a hard puzzle', () => {
		const subject = mount(<App/>);
		findButtonByText(subject, 'Hard').simulate('click');
		expect(subject.find(Game)).toExist();
	});

	it('shows an unlimited puzzle', () => {
		const subject = mount(<App/>);
		findButtonByText(subject, 'Unlimited').simulate('click');
		expect(subject.find(Game)).toExist();
	});
});
