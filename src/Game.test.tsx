import React from 'react';
import {mount, ReactWrapper} from 'enzyme';
import {Game, nextToolFromKeystroke} from "./Game";
import {Tool} from "./Tools";


describe('Game', () => {
	it('initially selects the normal 1 tool', () => {
		const subject = renderSubject({});
		const regular = subject.find('.NumberPicker-regular');
		const button = findByLabelText(regular, '1');
		expect(button).toHaveProp('checked', true);
		const checkedRadios = subject.find('input[type="radio"][checked=true]');
		expect(checkedRadios.length).toEqual(1);
	});

	it('allows single selection across both tool types', () => {
		const subject = renderSubject({});
		const pencil = () => subject.find('.NumberPicker-pencil');
		const button = () => findByLabelText(pencil(), '2');
		button().simulate('change', {target: {checked: true}});
		expect(button()).toHaveProp('checked', true);
		const checkedRadios = subject.find('input[type="radio"][checked=true]');
		expect(checkedRadios.length).toEqual(1);
	});

	it('highlights cells with the currently selected number', () => {
		const puzzle = [...arbitraryPuzzle];
		puzzle[0] = 1;
		puzzle[1] = 2;
		const subject = renderSubject({puzzle});
		const cells = () => subject.find('.Grid td');

		selectRegularNumTool(subject, 2);
		expect(cells().at(0)).toHaveClassName('GridCell-current');
		expect(cells().at(1)).not.toHaveClassName('GridCell-current');

		selectPencilTool(subject, 3);
		expect(cells().at(0)).not.toHaveClassName('GridCell-current');
		expect(cells().at(1)).toHaveClassName('GridCell-current');
	});

	describe('When a grid cell is clicked', () => {
		describe('With a number tool selected', () => {
			it('fills the cell with the selected number', () => {
				const puzzle = [...arbitraryPuzzle];
				puzzle[0] = null;
				const subject = renderSubject({puzzle});

				selectRegularNumTool(subject, 1);
				const cell = clickFirstCell(subject);
				expect(cell.text()).toEqual('1');
			});

			it('does not change cells with given values', () => {
				const puzzle = [...arbitraryPuzzle];
				puzzle[0] = 1; // becomes 2
				const subject = renderSubject({puzzle});

				selectRegularNumTool(subject, 1);
				const cell = clickFirstCell(subject);
				expect(cell.text()).toEqual('2');
			});
		});

		describe('With a pencil tool selected', () => {
			it('pencils in the selected number', () => {
				const puzzle = [...arbitraryPuzzle];
				puzzle[0] = null;
				const subject = renderSubject({puzzle});

				selectPencilTool(subject, 1);
				const cell = clickFirstCell(subject);
				expect(cell.text()).toEqual('(1)');
			});

			it('allows multiple pencil marks in the same cell', () => {
				const puzzle = [...arbitraryPuzzle];
				puzzle[0] = null;
				const subject = renderSubject({puzzle});

				selectPencilTool(subject, 1);
				clickFirstCell(subject);
				selectPencilTool(subject, 2);
				const cell = clickFirstCell(subject);
				expect(cell.text()).toEqual('(1,\u200b2)');
			});

			it('does not change cells with given values', () => {
				const puzzle = [...arbitraryPuzzle];
				puzzle[0] = 5;
				const subject = renderSubject({puzzle});

				selectPencilTool(subject, 1);
				const cell = clickFirstCell(subject);
				expect(cell.text()).toEqual('6');
			});

			it('does not change cells with entered regular numbers', () => {
				const puzzle = [...arbitraryPuzzle];
				puzzle[0] = null;
				const subject = renderSubject({puzzle});

				enterRegularNumInFirstCell(subject, 1);
				selectPencilTool(subject, 2);
				const cell = clickFirstCell(subject);
				expect(cell.text()).toEqual('1');
			});

		});

		describe('With the erase tool selected', () => {
			it('erases the cell', () => {
				const puzzle = [...arbitraryPuzzle];
				puzzle[0] = null;
				const subject = renderSubject({puzzle});

				selectRegularNumTool(subject, 1);
				clickFirstCell(subject);

				selectEraserTool(subject);
				const cell = clickFirstCell(subject);
				expect(cell.text()).toEqual('');
			});

			it('does not erase cells with given values', () => {
				const puzzle = [...arbitraryPuzzle];
				puzzle[0] = 0;
				const subject = renderSubject({puzzle});

				selectEraserTool(subject);
				const cell = clickFirstCell(subject);
				expect(cell.text()).toEqual('1');
			});
		});
	});

	it('supports undo', () => {
		const puzzle = [...arbitraryPuzzle];
		puzzle[0] = null;
		const subject = renderSubject({puzzle});

		enterRegularNumInFirstCell(subject, 1);
		eraseFirstCell(subject);
		enterRegularNumInFirstCell(subject, 2);

		const undo = () => findButtonByText(subject, 'Undo').simulate('click');
		undo();
		expect(firstCell(subject).text()).toEqual('');
		undo();
		expect(firstCell(subject).text()).toEqual('1');
		undo();
		expect(firstCell(subject).text()).toEqual('');
	});

	it('can reset to the initial state', () => {
		const puzzle = [...arbitraryPuzzle];
		puzzle[0] = null;
		const subject = renderSubject({puzzle});

		enterRegularNumInFirstCell(subject, 1);
		eraseFirstCell(subject);
		enterRegularNumInFirstCell(subject, 2);

		findButtonByText(subject, 'Start Over').simulate('click');
		expect(firstCell(subject).text()).toEqual('');

		findButtonByText(subject, 'Undo').simulate('click');
		expect(firstCell(subject).text()).toEqual('2');
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

		const subject = renderSubject({puzzle});

		enterRegularNumInFirstCell(subject, 1);
		expect(firstCell(subject).text()).toEqual('1');
		expect(regularNumButton(subject, 1).prop('disabled')).toBeTruthy();
		expect(regularNumButton(subject, 1).prop('disabled')).toBeTruthy();
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

		const subject = renderSubject({puzzle});

		enterPencilMarkInFirstCell(subject, 1);
		expect(regularNumButton(subject, 1).prop('disabled')).toBeFalsy();
		expect(regularNumButton(subject, 1).prop('disabled')).toBeFalsy();
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
		const subject = renderSubject({puzzle});

		enterRegularNumInFirstCell(subject, 1);
		expect(subject.text()).not.toContain('Solved!');

		eraseFirstCell(subject);
		enterRegularNumInFirstCell(subject, 8);
		expect(subject.text()).toContain('Solved!');
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
			const subject = renderSubject({puzzle});

			enterRegularNum(subject, 8, 0);
			enterRegularNum(subject, 8, 1);

			findButtonByText(subject, 'Undo Until Solvable').simulate('click');
			expect(cell(subject, 0).text()).toEqual('8');
			expect(cell(subject, 1).text()).toEqual('');
		});
	});

	describe('When the "Clear Pencil Marks" button is clicked', () => {
		it('removes all pencil marks', () => {
			const puzzle = [
				null, null, null, 8, 3, 1, 6, 4, 5,
				8, 3, 4, 5, 6, 0, 2, 1, 7,
				6, 5, 1, 2, 4, 7, 8, 3, 0,
				1, 8, 7, 6, 0, 5, 4, 2, 3,
				2, 0, 6, 4, 7, 3, 1, 5, 8,
				3, 4, 5, 1, 2, 8, 0, 7, 6,
				5, 1, 3, 0, 8, 4, 7, 6, 2,
				4, 6, 8, 7, 5, 2, 3, 0, 1,
				0, 7, 2, 3, 1, 6, 5, 8, 4
			];
			const subject = renderSubject({puzzle});

			enterRegularNum(subject, 8, 0);
			enterPencilMark(subject, 8, 1);
			enterPencilMark(subject, 8, 2);

			findButtonByText(subject, 'Clear Pencil Marks').simulate('click');
			expect(cell(subject, 0).text()).toEqual('8');
			expect(cell(subject, 1).text()).toEqual('');
			expect(cell(subject, 2).text()).toEqual('');
		});
	});

	describe('When the "Redo Last As Pencil" button is clicked', () => {
		it('undoes the previous entry and repeats it as a pencil mark', () => {
			const subject = renderSubject({puzzle: arbitraryPuzzle});

			enterRegularNum(subject, 8, 0);
			enterPencilMark(subject, 7, 1);
			enterRegularNum(subject, 8, 1);
			findButtonByText(subject, 'Redo Last As Pencil').simulate('click');

			expect(cell(subject, 0).text()).toEqual('8');
			expect(cell(subject, 1).text()).toEqual('(7,\u200b8)');
		});

		it('switches to the pencil tool', () => {
			const subject = renderSubject({puzzle: arbitraryPuzzle});

			enterRegularNum(subject, 8, 0);
			findButtonByText(subject, 'Redo Last As Pencil').simulate('click');
			cell(subject, 1).simulate('click');
			expect(cell(subject, 1).text()).toEqual('(8)');
		});
	});
});

function enterRegularNumInFirstCell(subject: ReactWrapper, num: number) {
	return enterRegularNum(subject, num, 0);
}

function enterRegularNum(subject: ReactWrapper, num: number, cellIx: number) {
	regularNumButton(subject, num).simulate('change', {target: {checked: true}});
	cell(subject, cellIx).simulate('click');
	expect(cell(subject, cellIx).text())
		.withContext('Number entry might be broken')
		.toEqual(`${num}`);
}

function enterPencilMarkInFirstCell(subject: ReactWrapper, num: number) {
	enterPencilMark(subject, num, 0);
}

function enterPencilMark(subject: ReactWrapper, num: number, cellIx: number) {
	pencilButton(subject, num).simulate('change', {target: {checked: true}});
	cell(subject, cellIx).simulate('click');
	expect(cell(subject, cellIx).text())
		.withContext('Number entry might be broken')
		.toEqual(`(${num})`);
}

function eraseFirstCell(subject: ReactWrapper) {
	selectEraserTool(subject);
	clickFirstCell(subject);
	expect(firstCell(subject).text())
		.withContext('Erasing might be broken')
		.toEqual('');
}

function selectRegularNumTool(subject: ReactWrapper, num: number) {
	regularNumButton(subject, num).simulate('change', {target: {checked: true}});
}

function regularNumButton(subject: ReactWrapper, num: number): ReactWrapper {
	const regular = subject.find('.NumberPicker-regular');
	return findByLabelText(regular, num + '');
}

function selectPencilTool(subject: ReactWrapper, num: number) {
	pencilButton(subject, num).simulate('change', {target: {checked: true}});
}

function pencilButton(subject: ReactWrapper, num: number): ReactWrapper {
	const pencil = subject.find('.NumberPicker-pencil');
	return findByLabelText(pencil, num + '');
}

function selectEraserTool(subject: ReactWrapper) {
	findByLabelText(subject, 'Erase').simulate('change', {target: {checked: true}});
}

function clickFirstCell(subject: ReactWrapper): ReactWrapper {
	firstCell(subject).simulate('click');
	return firstCell(subject);
}

function firstCell(subject: ReactWrapper): ReactWrapper {
	return cell(subject, 0);
}

function cell(subject: ReactWrapper, cellIx: number): ReactWrapper {
	return subject.find('.Grid td').at(cellIx);

}

function findByLabelText(root: ReactWrapper, labelText: string): ReactWrapper {
	const label = root.findWhere(x => x.length === 1 && x.is('label') && x.text() === labelText);
	return label.find('input');
}

function findButtonByText(root: ReactWrapper, text: string): ReactWrapper {
	return root.findWhere(x => x.length === 1 && x.is('button') && x.text() === text);
}


interface OptionalProps {
	puzzle?: (number | null)[];
}

function renderSubject(props: OptionalProps) {
	return mount(<Game puzzleData={props.puzzle || arbitraryPuzzle} />);
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