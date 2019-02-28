import React from 'react';
import {render} from 'react-testing-library'
import {Grid} from "./Grid";
import {Puzzle} from "./Puzzle";

describe('Grid', () => {
	it('renders the specified puzzle', () => {
		const puzzle = new Puzzle([
			1, null, null, null, null, null, null, null, null,
			null, 2, null, null, null, null, null, null, null,
			null, null, 3, null, null, null, null, null, null,
			null, null, null, 4, null, null, null, null, null,
			null, null, null, null, 5, null, null, null, null,
			null, null, null, null, null, 6, null, null, null,
			null, null, null, null, null, null, 7, null, null,
			null, null, null, null, null, null, null, 8, null,
			null, null, null, null, null, null, null, null, 9
		]);
		const {container} = render(<Grid puzzle={puzzle} onCellClick={() => {}} />);
		const cellTexts = mapEls(container.querySelectorAll('tr'),
			row => {
				return mapEls(row.querySelectorAll('td'),
					cell => cell.textContent);
			});
		expect(cellTexts).toEqual([
			['1', '', '', '', '', '', '', '', ''],
			['', '2', '', '', '', '', '', '', ''],
			['', '', '3', '', '', '', '', '', ''],
			['', '', '', '4', '', '', '', '', ''],
			['', '', '', '', '5', '', '', '', ''],
			['', '', '', '', '', '6', '', '', ''],
			['', '', '', '', '', '', '7', '', ''],
			['', '', '', '', '', '', '', '8', ''],
			['', '', '', '', '', '', '', '', '9']
		])
	});
});

function mapEls<T>(els: NodeListOf<HTMLElement>, tx: (el: HTMLElement) => T): T[] {
	return Array.prototype.map.call(els, tx) as T[];
}