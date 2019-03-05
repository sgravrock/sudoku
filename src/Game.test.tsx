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

	it('highlights cells with the currently selected number', () => {
		const puzzle = [...arbitraryPuzzle];
		puzzle[0] = 0;
		puzzle[1] = 1;
		const {container} = renderSubject({puzzle});
		const cells = () => container.querySelectorAll('.Grid td');

		selectRegularNumTool(container, 1);
		expect(cells()[0]).toHaveClass('GridCell-current');
		expect(cells()[1]).not.toHaveClass('GridCell-current');

		selectPencilTool(container, 2);
		expect(cells()[0]).not.toHaveClass('GridCell-current');
		expect(cells()[1]).toHaveClass('GridCell-current');
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

		describe('With a pencil tool selected', () => {
			it('pencils in the selected number', () => {
				const puzzle = [...arbitraryPuzzle];
				puzzle[0] = null;
				const {container} = renderSubject({puzzle});

				selectPencilTool(container, 1);
				const cell = clickFirstCell(container);
				expect(cell.textContent).toEqual('(1)');
			});

			it('allows multiple pencil marks in the same cell', () => {
				const puzzle = [...arbitraryPuzzle];
				puzzle[0] = null;
				const {container} = renderSubject({puzzle});

				selectPencilTool(container, 1);
				clickFirstCell(container);
				selectPencilTool(container, 2);
				const cell = clickFirstCell(container);
				expect(cell.textContent).toEqual('(1,2)');

			});

			it('does not change cells with given values', () => {
				const puzzle = [...arbitraryPuzzle];
				puzzle[0] = 5;
				const {container} = renderSubject({puzzle});

				selectPencilTool(container, 1);
				const cell = clickFirstCell(container);
				expect(cell.textContent).toEqual('6');
			});

			it('does not change cells with entered regular numbers', () => {
				const puzzle = [...arbitraryPuzzle];
				puzzle[0] = null;
				const {container} = renderSubject({puzzle});

				selectRegularNumTool(container, 1);
				clickFirstCell(container);
				selectPencilTool(container, 2);
				const cell = clickFirstCell(container);
				expect(cell.textContent).toEqual('1');
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

	it('supports undo', () => {
		const puzzle = [...arbitraryPuzzle];
		puzzle[0] = null;
		const {container} = renderSubject({puzzle});

		selectRegularNumTool(container, 1);
		clickFirstCell(container);
		selectRegularNumTool(container, 2);
		clickFirstCell(container);

		const undo = () => RTL.queryByText(container, 'Undo')!!.click();
		undo();
		expect(firstCell(container).textContent).toEqual('1');
		undo();
		expect(firstCell(container).textContent).toEqual('');
	});

	it('disables numbers that are fully entered', () => {
		const puzzle = [
			null, 0, 0, 0, 0, 0, 0, 0, 0,
			null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null,
		];

		const {container} = renderSubject({puzzle});

		selectRegularNumTool(container, 1);
		clickFirstCell(container);
		expect(regularNumButton(container, 1).disabled).toBeTruthy();
		expect(regularNumButton(container, 1).disabled).toBeTruthy();
	});

	it('does not disable numbers when some entries are pencil marks', () => {
		const puzzle = [
			null, 1, 1, 1, 1, 1, 1, 1, 1,
			null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null,
		];

		const {container} = renderSubject({puzzle});

		selectPencilTool(container, 1);
		clickFirstCell(container);
		expect(regularNumButton(container, 1).disabled).toBeFalsy();
		expect(regularNumButton(container, 1).disabled).toBeFalsy();
	});
});

function selectRegularNumTool(container: HTMLElement, num: number) {
	regularNumButton(container, num).click();
}

function regularNumButton(container: HTMLElement, num: number): HTMLInputElement {
	const regular = container.querySelector('.NumberPicker-regular') as HTMLElement;
	return RTL.queryByLabelText(regular, num + '',) as HTMLInputElement;
}

function selectPencilTool(container: HTMLElement, num: number) {
	pencilButton(container, num).click();
}

function pencilButton(container: HTMLElement, num: number): HTMLInputElement {
	const pencil = container.querySelector('.NumberPicker-pencil') as HTMLElement;
	return RTL.queryByLabelText(pencil, num + '',) as HTMLInputElement;
}

function selectEraserTool(container: HTMLElement) {
	const button = RTL.queryByLabelText(container, 'Erase')!;
	button.click();
}

function clickFirstCell(container: HTMLElement): HTMLElement {
	firstCell(container).click();
	return firstCell(container);
}

function firstCell(container: HTMLElement): HTMLElement {
	return container.querySelector('.Grid td') as HTMLElement;
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