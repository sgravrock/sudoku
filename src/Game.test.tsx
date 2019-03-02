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
		describe('With a number tool selected', () => {
			it('fills the cell with the selected number', () => {
				const puzzle = [...arbitraryPuzzle];
				puzzle[0] = null;
				const {container} = renderSubject({puzzle});

				selectRegularNumTool(container, 1);
				const cell = clickFirstCell(container);
				expect(cell.textContent).toEqual('1');
			});

			it('does not change cells with given values', () => {
				const puzzle = [...arbitraryPuzzle];
				puzzle[0] = 1; // becomes 2
				const {container} = renderSubject({puzzle});

				selectRegularNumTool(container, 1);
				const cell = clickFirstCell(container);
				expect(cell.textContent).toEqual('2');
			});
		});

		describe('With the erase tool selected', () => {
			it('erases the cell', () => {
				const puzzle = [...arbitraryPuzzle];
				puzzle[0] = null;
				const {container} = renderSubject({puzzle});

				selectRegularNumTool(container, 1);
				clickFirstCell(container);

				selectEraserTool(container);
				const cell = clickFirstCell(container);
				expect(cell.textContent).toEqual('');
			});

			it('does not erase cells with given values', () => {
				const puzzle = [...arbitraryPuzzle];
				puzzle[0] = 0;
				const {container} = renderSubject({puzzle});

				selectEraserTool(container);
				const cell = clickFirstCell(container);
				expect(cell.textContent).toEqual('1');
			});
		});
	});
});

function selectRegularNumTool(container: HTMLElement, num: number) {
	const regular = container.querySelector('.NumberPicker-regular') as HTMLElement;
	const button = RTL.queryByLabelText(regular, num + '',)!;
	button.click();
}

function selectEraserTool(container: HTMLElement) {
	const button = RTL.queryByLabelText(container, 'Erase')!;
	button.click();
}

function clickFirstCell(container: HTMLElement): HTMLElement {
	const cell = () => container.querySelector('.Grid td') as HTMLElement;
	cell().click();
	return cell();
}

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