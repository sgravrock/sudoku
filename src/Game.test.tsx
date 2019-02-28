import React from 'react';
import * as RTL from 'react-testing-library'
import {Game} from "./Game";


describe('Game', () => {
	it('initially selects the normal 1 tool', () => {
		const {container} = renderSubject({});
		const regular = container.querySelector('.NumberPicker-regular') as HTMLElement;
		const button = RTL.queryByLabelText(regular, '1', ) as HTMLInputElement;
		expect(button.checked).toEqual(true);
		expect(container.querySelectorAll('input[type=radio][checked]').length).toEqual(1);
	});

	it('allows single selection across both tool types', () => {
		const {container} = renderSubject({});
		const pencil = container.querySelector('.NumberPicker-pencil') as HTMLElement;
		const button = () => RTL.queryByLabelText(pencil, '1', ) as HTMLInputElement;
		button().click();
		expect(button().checked).toEqual(true);
		expect(container.querySelectorAll('input[type=radio][checked]').length).toEqual(1);
	});

	describe('When a grid cell is clicked', () => {
		it('fills the cell with the selected number', () => {
			const puzzle = [...arbitraryPuzzle];
			puzzle[0] = 2;
			const {container} = renderSubject({puzzle});

			const regular = container.querySelector('.NumberPicker-regular') as HTMLElement;
			const button = RTL.queryByLabelText(regular, '1', ) as HTMLInputElement;
			button.click();

			const cell = () => container.querySelector('.Grid td') as HTMLElement;
			cell().click();
			expect(cell().textContent).toEqual('1');
		});
	});
});

interface OptionalProps {
	puzzle?: (number | null)[];
}

function renderSubject(props: OptionalProps) {
	return RTL.render(<Game puzzleData={props.puzzle || arbitraryPuzzle} />);
}

const arbitraryPuzzle: (number | null)[] = [
	null, null, null, null, null, null, null, null, null,
	null, null, null, null, null, null, null, null, null,
	null, null, null, null, null, null, null, null, null,
	null, null, null, null, null, null, null, null, null,
	null, null, null, null, null, null, null, null, null,
	null, null, null, null, null, null, null, null, null,
	null, null, null, null, null, null, null, null, null,
	null, null, null, null, null, null, null, null, null,
	null, null, null, null, null, null, null, null, null,
];