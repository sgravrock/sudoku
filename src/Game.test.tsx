import React from 'react';
import {mount, ReactWrapper} from 'enzyme';
import {Game, nextToolFromKeystroke} from "./Game";
import {Tool} from "./Tools";
import {findButtonByText, findByLabelText} from "./testSupport/queries";
import * as humanStyleSolver from './humanStyleSolver';
import {Grid} from "./Grid";
import {SingleMoveResult, Strategy} from "./humanStyleSolver";
import {parsePuzzle} from "./testSupport/parsePuzzle";
import {Puzzle} from "./Puzzle";


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
		const puzzleData = [...arbitraryPuzzle];
		puzzleData[0] = 2;
		puzzleData[1] = 3;
		const subject = renderSubject({puzzleData});
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
				const puzzleData = [...arbitraryPuzzle];
				puzzleData[0] = null;
				const subject = renderSubject({puzzleData});

				selectRegularNumTool(subject, 1);
				const cell = clickFirstCell(subject);
				expect(cell.text()).toEqual('1');
			});

			it('does not change cells with given values', () => {
				const puzzleData = [...arbitraryPuzzle];
				puzzleData[0] = 2;
				const subject = renderSubject({puzzleData});

				selectRegularNumTool(subject, 1);
				const cell = clickFirstCell(subject);
				expect(cell.text()).toEqual('2');
			});
		});

		describe('With a pencil tool selected', () => {
			it('pencils in the selected number', () => {
				const puzzleData = [...arbitraryPuzzle];
				puzzleData[0] = null;
				const subject = renderSubject({puzzleData});

				selectPencilTool(subject, 1);
				const cell = clickFirstCell(subject);
				expect(cell.text()).toEqual('(1)');
			});

			it('allows multiple pencil marks in the same cell', () => {
				const puzzleData = [...arbitraryPuzzle];
				puzzleData[0] = null;
				const subject = renderSubject({puzzleData});

				selectPencilTool(subject, 1);
				clickFirstCell(subject);
				selectPencilTool(subject, 2);
				const cell = clickFirstCell(subject);
				expect(cell.text()).toEqual('(1,\u200b2)');
			});

			it('does not change cells with given values', () => {
				const puzzleData = [...arbitraryPuzzle];
				puzzleData[0] = 6;
				const subject = renderSubject({puzzleData});

				selectPencilTool(subject, 1);
				const cell = clickFirstCell(subject);
				expect(cell.text()).toEqual('6');
			});

			it('does not change cells with entered regular numbers', () => {
				const puzzleData = [...arbitraryPuzzle];
				puzzleData[0] = null;
				const subject = renderSubject({puzzleData});

				enterRegularNumInFirstCell(subject, 1);
				selectPencilTool(subject, 2);
				const cell = clickFirstCell(subject);
				expect(cell.text()).toEqual('1');
			});

		});

		describe('With the erase tool selected', () => {
			it('erases the cell', () => {
				const puzzleData = [...arbitraryPuzzle];
				puzzleData[0] = null;
				const subject = renderSubject({puzzleData});

				selectRegularNumTool(subject, 1);
				clickFirstCell(subject);

				selectEraserTool(subject);
				const cell = clickFirstCell(subject);
				expect(cell.text()).toEqual('');
			});

			it('does not erase cells with given values', () => {
				const puzzleData = [...arbitraryPuzzle];
				puzzleData[0] = 1;
				const subject = renderSubject({puzzleData});

				selectEraserTool(subject);
				const cell = clickFirstCell(subject);
				expect(cell.text()).toEqual('1');
			});
		});
	});

	it('supports undo', () => {
		const puzzleData = [...arbitraryPuzzle];
		puzzleData[0] = null;
		const subject = renderSubject({puzzleData});

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
		const puzzleData = [...arbitraryPuzzle];
		puzzleData[0] = null;
		const subject = renderSubject({puzzleData});

		enterRegularNumInFirstCell(subject, 1);
		eraseFirstCell(subject);
		enterRegularNumInFirstCell(subject, 2);

		findButtonByText(subject, 'Start Over').simulate('click');
		expect(firstCell(subject).text()).toEqual('');

		findButtonByText(subject, 'Undo').simulate('click');
		expect(firstCell(subject).text()).toEqual('2');
	});

	it('disables numbers that are fully entered', () => {
		const puzzleData = [
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

		const subject = renderSubject({puzzleData});

		enterRegularNumInFirstCell(subject, 1);
		expect(firstCell(subject).text()).toEqual('1');
		expect(regularNumButton(subject, 1).prop('disabled')).toBeTruthy();
		expect(regularNumButton(subject, 1).prop('disabled')).toBeTruthy();
	});

	it('does not disable numbers when some entries are pencil marks', () => {
		const puzzleData = [
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

		const subject = renderSubject({puzzleData});

		enterPencilMarkInFirstCell(subject, 1);
		expect(regularNumButton(subject, 1).prop('disabled')).toBeFalsy();
		expect(regularNumButton(subject, 1).prop('disabled')).toBeFalsy();
	});

	it('shows "Solved! when the puzzle is correctly solved', () => {
		const puzzleData = [
			null, 3, 1, 9, 4, 2, 7, 5, 6,
			9, 4, 5, 6, 7, 1, 3, 2, 8,
			7, 6, 2, 3, 5, 8, 9, 4, 1,
			2, 9, 8, 7, 1, 6, 5, 3, 4,
			3, 1, 7, 5, 8, 4, 2, 6, 9,
			4, 5, 6, 2, 3, 9, 1, 8, 7,
			6, 2, 4, 1, 9, 5, 8, 7, 3,
			5, 7, 9, 8, 6, 3, 4, 1, 2,
			1, 8, 3, 4, 2, 7, 6, 9, 5
		];
		const subject = renderSubject({puzzleData});

		enterRegularNumInFirstCell(subject, 1);
		expect(subject.text()).not.toContain('Solved!');

		eraseFirstCell(subject);
		enterRegularNumInFirstCell(subject, 8);
		expect(subject.find('.Game-main').text()).toContain('Solved!');
	});

	describe('nextToolFromKeystroke', () => {
		function hasPencilSwitchingBehavior(key: string) {
			describe('And a number tool is selected', () => {
				it('toggles the pencil-ness of the tool', () => {
					const pencilTool: Tool = {
						type: 'number', n: 3, pencil: true
					};
					const regularTool: Tool = {
						...pencilTool, pencil: false
					};
					expect(nextToolFromKeystroke(regularTool, key)).toEqual(pencilTool);
					expect(nextToolFromKeystroke(pencilTool, key)).toEqual(regularTool);
				});
			});

			describe('And a non-number tool is selected', () => {
				it('returns null', () => {
					const tool: Tool = {type: 'eraser'};
					expect(nextToolFromKeystroke(tool, key)).toBeNull();
				});
			});
		}
		describe('When the key is p', () => {
			hasPencilSwitchingBehavior('p');
		});

		describe('When the key is space', () => {
			hasPencilSwitchingBehavior(' ');
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
			it('returns null', () => {
				const tool: Tool = {type: 'eraser'};
				expect(nextToolFromKeystroke(tool, 'x')).toBeNull();
			});
		});
	});

	describe('When the "Undo Until Solvable" button is clicked', () => {
		it('reverts to the last state with no errors', () => {
			const puzzleData = [
				null, null, 1, 9, 4, 2, 7, 5, 6,
				9, 4, 5, 6, 7, 1, 3, 2, 8,
				7, 6, 2, 3, 5, 8, 9, 4, 1,
				2, 9, 8, 7, 1, 6, 5, 3, 4,
				3, 1, 7, 5, 8, 4, 2, 6, 9,
				4, 5, 6, 2, 3, 9, 1, 8, 7,
				6, 2, 4, 1, 9, 5, 8, 7, 3,
				5, 7, 9, 8, 6, 3, 4, 1, 2,
				1, 8, 3, 4, 2, 7, 6, 9, 5
			];
			const subject = renderSubject({puzzleData});

			enterRegularNum(subject, 8, 0);
			enterRegularNum(subject, 8, 1);

			findButtonByText(subject, 'Undo Until Solvable').simulate('click');
			expect(cell(subject, 0).text()).toEqual('8');
			expect(cell(subject, 1).text()).toEqual('');
		});
	});

	describe('When the "Clear Pencil Marks" button is clicked', () => {
		it('removes all pencil marks', () => {
			const puzzleData = [
				null, null, null, 9, 4, 2, 7, 5, 6,
				9, 4, 5, 6, 7, 1, 3, 2, 8,
				7, 6, 2, 3, 5, 8, 9, 4, 1,
				2, 9, 8, 7, 1, 6, 5, 3, 4,
				3, 1, 7, 5, 8, 4, 2, 6, 9,
				4, 5, 6, 2, 3, 9, 1, 8, 7,
				6, 2, 4, 1, 9, 5, 8, 7, 3,
				5, 7, 9, 8, 6, 3, 4, 1, 2,
				1, 8, 3, 4, 2, 7, 6, 9, 5
			];
			const subject = renderSubject({puzzleData});

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
			const subject = renderSubject({});

			enterRegularNum(subject, 8, 0);
			enterPencilMark(subject, 7, 1);
			enterRegularNum(subject, 8, 1);
			findButtonByText(subject, 'Redo Last As Pencil').simulate('click');

			expect(cell(subject, 0).text()).toEqual('8');
			expect(cell(subject, 1).text()).toEqual('(7,\u200b8)');
		});

		it('switches to the pencil tool', () => {
			const subject = renderSubject({});

			enterRegularNum(subject, 8, 0);
			findButtonByText(subject, 'Redo Last As Pencil').simulate('click');
			cell(subject, 1).simulate('click');
			expect(cell(subject, 1).text()).toEqual('(8)');
		});
	});

	describe('When Auto Solve is clicked', () => {
		describe('with Easy Stratgies selected', () => {
			it('attempts to solve the puzzle using only easy strategies', () => {
				testAutoSolve('Easy strategies', humanStyleSolver.easyStrategies);
			});
		});

		describe('with All Strategies selected', () => {
			it('attempts to solve the puzzle using all known strategies', () => {
				testAutoSolve('All strategies', humanStyleSolver.allStrategies);
			});
		});

		describe('with Solve One Cell clicked', () => {
			beforeEach(() => {
				jasmine.clock().install();
			});

			afterEach(() => {
				jasmine.clock().uninstall();
			});

			it('attempts to solve one cell', () => {
				const input = [...arbitraryPuzzle];
				input[0] = null;
				const puzzleBeforeSolve = Puzzle.fromRawCells(input);
				const solveResult: SingleMoveResult = {
					puzzle: puzzleBeforeSolve.setCell(
						{x: 0, y: 0},
						{n: 1, pencil: false}
					),
					changedCell: {x: 0, y: 0},
					strategy: ''
				};
				const solver = jasmine.createSpyObj('solver',
					['solve', 'solveOneCell']);
				solver.solveOneCell.and.returnValue(solveResult);
				const subject = renderSubject({
					puzzle: puzzleBeforeSolve,
					solver
				});

				solveOneCell(subject);

				expect(solver.solveOneCell).toHaveBeenCalledWith(
					puzzleBeforeSolve
				);
				expect(subject.find(Grid)).toHaveProp('puzzle', solveResult.puzzle);
			});

			it('shows an alert when no cells can be solved', () => {
				const solver = jasmine.createSpyObj('solver',
					['solve', 'solveOneCell']);
				solver.solveOneCell.and.returnValue(null);
				const subject = renderSubject({solver});
				const puzzleBeforeSolve = subject.find(Grid).prop('puzzle');
				spyOn(window, 'alert');

				solveOneCell(subject);

				expect(window.alert).toHaveBeenCalledWith('Could not solve any cells.');
			});

			it('tells the user what was done', () => {
				const solver = jasmine.createSpyObj('solver',
					['solve', 'solveOneCell']);
				solver.solveOneCell.and.returnValue({
					puzzle: parsePuzzle(''),
					strategy: 'Naked Single',
					changedCell: {x: 3, y: 5}
				});
				const subject = renderSubject({solver});
				spyOn(window, 'alert');

				solveOneCell(subject);
				jasmine.clock().tick(0);

				expect(window.alert).toHaveBeenCalledWith(
					'Solved cell at x=3 y=5 using Naked Single'
				);
			});

			it('highlights the solved cell', () => {
				const solver = jasmine.createSpyObj('solver',
					['solve', 'solveOneCell']);
				solver.solveOneCell.and.returnValue({
					puzzle: parsePuzzle(''),
					strategy: '',
					changedCell: {x: 3, y: 0}
				});
				const subject = renderSubject({solver});

				solveOneCell(subject);

				expect(cell(subject, 3)).toHaveClassName('GridCell-autoSolved');
			});

			it('updates the highlight across moves and undos', () => {
				const solver = jasmine.createSpyObj('solver',
					['solve', 'solveOneCell']);
				solver.solveOneCell.and.returnValue({
					puzzle: parsePuzzle(''),
					strategy: '',
					changedCell: {x: 3, y: 0}
				});
				const subject = renderSubject({solver});

				solveOneCell(subject);
				selectRegularNumTool(subject, 1);
				clickFirstCell(subject);

				expect(cell(subject, 3)).not.toHaveClassName('GridCell-autoSolved');
				findButtonByText(subject, 'Undo').simulate('click');
				expect(cell(subject, 3)).toHaveClassName('GridCell-autoSolved');
			});

			function solveOneCell(subject: ReactWrapper) {
				findButtonByText(subject, 'Solve a single cell').simulate('click');
			}
		});

		function testAutoSolve(buttonText: string, expectedStrategies: Strategy[]) {
			const input = [...arbitraryPuzzle];
			input[0] = null;
			const puzzleBeforeSolve = Puzzle.fromRawCells(input);
			const solver = jasmine.createSpyObj('solver',
				['solve', 'solveOneCell']);
			const solveResult = {
				solved: false,
				endState: puzzleBeforeSolve.setCell({x: 0, y: 0}, {n: 1, pencil: false})
			};
			solver.solve.and.returnValue(solveResult);
			const subject = renderSubject({puzzle: puzzleBeforeSolve, solver});

			findButtonByText(subject, buttonText).simulate('click');

			expect(solver.solve).toHaveBeenCalledWith(
				puzzleBeforeSolve,
				expectedStrategies
			);
			expect(cell(subject, 0)).toHaveText('1');
		}
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

interface OptionalProps {
	puzzleData?: (number | null)[];
	puzzle?: Puzzle;
	solver?: {
		solve: typeof humanStyleSolver.solve;
		solveOneCell: typeof humanStyleSolver.solveOneCell;
	};
}

function renderSubject(props: OptionalProps) {
	const puzzle = props.puzzle || Puzzle.fromRawCells(props.puzzleData || arbitraryPuzzle);
	return mount(
		<Game
			puzzle={puzzle}
			solver={props.solver || humanStyleSolver}
		/>
	);
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