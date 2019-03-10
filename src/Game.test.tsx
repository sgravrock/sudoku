import React from 'react';
import * as RTL from 'react-testing-library'
import {Game, nextToolFromKeystroke} from "./Game";
import {Tool} from "./Tools";


describe('Game', () => {
	it('initially selects the normal 1 tool', () => {
		const {container} = renderSubject({});
		const regular = container.querySelector('.NumberPicker-regular') as HTMLElement;
		const button = RTL.queryByLabelText(regular, '1', ) as HTMLInputElement;
		expect(button.checked).toEqual(true);
		expect(container.querySelectorAll('input[type=radio][checked]').length)
			.toEqual(1);
	});

	it('allows single selection across both tool types', () => {
		const {container} = renderSubject({});
		const pencil = container.querySelector('.NumberPicker-pencil') as HTMLElement;
		const button = () => RTL.queryByLabelText(pencil, '2') as HTMLInputElement;
		button().click();
		expect(button().checked).toEqual(true);
		expect(container.querySelectorAll('input[type=radio][checked]').length)
			.toEqual(1);
	});

	it('highlights cells with the currently selected number', () => {
		const puzzle = [...arbitraryPuzzle];
		puzzle[0] = 1;
		puzzle[1] = 2;
		const {container} = renderSubject({puzzle});
		const cells = () => container.querySelectorAll('.Grid td');

		selectRegularNumTool(container, 2);
		expect(cells()[0]).toHaveClass('GridCell-current');
		expect(cells()[1]).not.toHaveClass('GridCell-current');

		selectPencilTool(container, 3);
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

				enterRegularNumInFirstCell(container, 1);
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

		enterRegularNumInFirstCell(container, 1);
		eraseFirstCell(container);
		enterRegularNumInFirstCell(container, 2);

		const undo = () => RTL.queryByText(container, 'Undo')!!.click();
		undo();
		expect(firstCell(container).textContent).toEqual('');
		undo();
		expect(firstCell(container).textContent).toEqual('1');
		undo();
		expect(firstCell(container).textContent).toEqual('');
	});

	it('can reset to the initial state', () => {
		const puzzle = [...arbitraryPuzzle];
		puzzle[0] = null;
		const {container} = renderSubject({puzzle});

		enterRegularNumInFirstCell(container, 1);
		eraseFirstCell(container);
		enterRegularNumInFirstCell(container, 2);

		RTL.queryByText(container, 'Start Over')!!.click();
		expect(firstCell(container).textContent).toEqual('');

		RTL.queryByText(container, 'Undo')!!.click();
		expect(firstCell(container).textContent).toEqual('2');
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

		enterRegularNumInFirstCell(container, 1);
		expect(firstCell(container).textContent).toEqual('1');
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

		enterPencilMarkInFirstCell(container, 1);
		expect(regularNumButton(container, 1).disabled).toBeFalsy();
		expect(regularNumButton(container, 1).disabled).toBeFalsy();
	});

	it('shows "Solved! when the puzzle is correctly solved', () => {
		const puzzle = [
			null, 2, 0, 8, 3, 1, 6, 4, 5,
			8, 3, 4, 5, 6, 0, 2, 1, 7,
			6, 5, 1, 2, 4, 7, 8, 3, 0,
			1, 8, 7, 6, 0, 5, 4, 2, 3,
			2, 0, 6, 4, 7, 3, 1, 5, 8,
			3, 4, 5, 1, 2, 8, 0, 7, 6,
			5, 1, 3, 0, 8, 4, 7, 6, 2,
			4, 6, 8, 7, 5, 2, 3, 0, 1,
			0, 7, 2, 3, 1, 6, 5, 8, 4
		];
		const {container} = renderSubject({puzzle});

		enterRegularNumInFirstCell(container, 1);
		expect(container.textContent).not.toContain('Solved!');

		eraseFirstCell(container);
		enterRegularNumInFirstCell(container, 8);
		expect(container.textContent).toContain('Solved!');
	});

	describe('nextToolFromKeystroke', () => {
		describe('When the key is p', () => {
			describe('And a number tool is selected', () => {
				it('toggles the pencil-ness of the tool', () => {
					const pencilTool: Tool = {
						type: 'number', n: 3, pencil: true
					};
					const regularTool: Tool = {
						...pencilTool, pencil: false
					};
					expect(nextToolFromKeystroke(regularTool, 'p')).toEqual(pencilTool);
					expect(nextToolFromKeystroke(pencilTool, 'p')).toEqual(regularTool);
				});
			});

			describe('And a non-number tool is selected', () => {
				it('returns the currently selected tool', () => {
					const tool: Tool = {type: 'eraser'};
					expect(nextToolFromKeystroke(tool, 'p')).toEqual(tool);
				});
			});
		});

		describe('When the key is a digit', () => {
			describe('And the same number is selected', () => {
				it('toggles the pencil-ness of the tool', () => {
					const pencilTool: Tool = {
						type: 'number', n: 4, pencil: true
					};
					const regularTool: Tool = {
						...pencilTool, pencil: false
					};
					expect(nextToolFromKeystroke(regularTool, '4')).toEqual(pencilTool);
					expect(nextToolFromKeystroke(pencilTool, '4')).toEqual(regularTool);
				});
			});

			describe('And a different number is selected', () => {
				it('changes the number and keeps the pencil-ness of the tool', () => {
					expect(nextToolFromKeystroke({
						type: 'number', n: 4, pencil: false
					}, '5')).toEqual({
						type: 'number', n: 5, pencil: false
					});
					expect(nextToolFromKeystroke({
						type: 'number', n: 4, pencil: true
					}, '5')).toEqual({
						type: 'number', n: 5, pencil: true
					});
				});
			});

			describe('And a non-number tool is selected', () => {
				it('selects the regular tool for the digit entered', () => {
					expect(nextToolFromKeystroke({
						type: 'eraser'
					}, '5')).toEqual({
						type: 'number', n: 5, pencil: false
					});
				});
			});
		});

		describe('When the key is something else', () => {
			it('returns the currently selected tool', () => {
				const tool: Tool = {type: 'eraser'};
				expect(nextToolFromKeystroke(tool, 'x')).toEqual(tool);
			});
		});
	});

	describe('When the "Undo Until Solvable" button is clicked', () => {
		it('reverts to the last state with no errors', () => {
			const puzzle = [
				null, null, 0, 8, 3, 1, 6, 4, 5,
				8, 3, 4, 5, 6, 0, 2, 1, 7,
				6, 5, 1, 2, 4, 7, 8, 3, 0,
				1, 8, 7, 6, 0, 5, 4, 2, 3,
				2, 0, 6, 4, 7, 3, 1, 5, 8,
				3, 4, 5, 1, 2, 8, 0, 7, 6,
				5, 1, 3, 0, 8, 4, 7, 6, 2,
				4, 6, 8, 7, 5, 2, 3, 0, 1,
				0, 7, 2, 3, 1, 6, 5, 8, 4
			];
			const {container} = renderSubject({puzzle});

			enterRegularNum(container, 8, 0);
			enterRegularNum(container, 8, 1);

			RTL.queryByText(container, 'Undo Until Solvable')!!.click();
			expect(cell(container, 0).textContent).toEqual('8');
			expect(cell(container, 1).textContent).toEqual('');
		});
	});
});

function enterRegularNumInFirstCell(container: HTMLElement, num: number) {
	return enterRegularNum(container, num, 0);
}

function enterRegularNum(container: HTMLElement, num: number, cellIx: number) {
	regularNumButton(container, num).click();
	cell(container, cellIx).click();
	expect(cell(container, cellIx).textContent)
		.withContext('Number entry might be broken')
		.toEqual(`${num}`);
}

function enterPencilMarkInFirstCell(container: HTMLElement, num: number) {
	pencilButton(container, num).click();
	clickFirstCell(container);
	expect(firstCell(container).textContent)
		.withContext('Number entry might be broken')
		.toEqual(`(${num})`);
}

function eraseFirstCell(container: HTMLElement) {
	selectEraserTool(container);
	clickFirstCell(container);
	expect(firstCell(container).textContent)
		.withContext('Erasing might be broken')
		.toEqual('');
}

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
	return cell(container, 0);
}

function cell(container: HTMLElement, cellIx: number): HTMLElement {
	return container.querySelectorAll('.Grid td')[cellIx] as HTMLElement;

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