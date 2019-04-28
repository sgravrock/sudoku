import React from 'react';
import {App} from './App';
import {mount} from 'enzyme';
import {findButtonByText} from "./testSupport/queries";
import {Game} from "./Game";
import {Grid} from "./Grid";


describe('App', () => {
	it('shows a blank puzzle', () => {
		const subject = mount(<App />);
		findButtonByText(subject, 'Blank').simulate('click');
		expect(subject.find(Game)).toExist();
		const puzzle = subject.find(Grid).prop('puzzle');

		for (let x = 0; x < 9; x++) {
			for (let y = 0; y < 9; y++) {
				expect(puzzle.cell({x, y}).entry)
					.withContext(`entry at x=${x} y=${y}`)
					.toBeNull();
			}
		}
	});

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
