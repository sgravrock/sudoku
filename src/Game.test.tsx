import React from 'react';
import {Game, nextToolFromKeystroke} from "./Game";
import {Tool} from "./Tools";
import {findButtonByText, findByLabelText} from "./testSupport/queries";
import * as humanStyleSolver from './humanStyleSolver';
import {Grid} from "./Grid";
import {SingleMoveResult, Strategy} from "./humanStyleSolver";
import {parsePuzzle} from "./testSupport/parsePuzzle";
import {Puzzle} from "./Puzzle";

import {fireEvent, render} from "@testing-library/react";

describe('Game', () => {
	it('initially selects the normal 1 tool', () => {
		const {baseElement} = renderSubject({});
		const regular = baseElement.querySelector('.NumberPicker-regular')!;
		const button = findByLabelText(regular, '1');
		expect(button.checked).toBeTrue();
		const checkedRadios = baseElement.querySelectorAll('input[type="radio"][checked]');
		expect(checkedRadios.length).toEqual(1);
	});

	it('allows single selection across both tool types', () => {
		const {baseElement} = renderSubject({});
		const pencil = () => baseElement.querySelector('.NumberPicker-pencil');
		const button = () => findByLabelText(pencil()!, '2') as HTMLInputElement;
		fireEvent.click(button());
		expect(button().checked).toBeTrue();
		const checkedRadios = baseElement.querySelectorAll('input[type="radio"][checked]');
		expect(checkedRadios.length).toEqual(1);
	});

	it('highlights cells with the currently selected number', () => {
		const puzzleData = [...arbitraryPuzzle];
		puzzleData[0] = 2;
		puzzleData[1] = 3;
		const {baseElement} = renderSubject({puzzleData});
		const cells = () => baseElement.querySelectorAll('.Grid td');

		selectRegularNumTool(baseElement, 2);
		expect(cells()[0]).toHaveClass('GridCell-current');
		expect(cells()[1]).not.toHaveClass('GridCell-current');

		selectPencilTool(baseElement, 3);
		expect(cells()[0]).not.toHaveClass('GridCell-current');
		expect(cells()[1]).toHaveClass('GridCell-current');
	});

	describe('When a grid cell is clicked', () => {
		describe('With a number tool selected', () => {
			it('fills the cell with the selected number', () => {
				const puzzleData = [...arbitraryPuzzle];
				puzzleData[0] = null;
				const {baseElement} = renderSubject({puzzleData});

				selectRegularNumTool(baseElement, 1);
				const cell = clickFirstCell(baseElement);
				expect(cell.textContent).toEqual('1');
			});

			it('does not change cells with given values', () => {
				const puzzleData = [...arbitraryPuzzle];
				puzzleData[0] = 2;
				const {baseElement} = renderSubject({puzzleData});

				selectRegularNumTool(baseElement, 1);
				const cell = clickFirstCell(baseElement);
				expect(cell.textContent).toEqual('2');
			});
		});

		describe('With a pencil tool selected', () => {
			it('pencils in the selected number', () => {
				const puzzleData = [...arbitraryPuzzle];
				puzzleData[0] = null;
				const {baseElement} = renderSubject({puzzleData});

				selectPencilTool(baseElement, 1);
				const cell = clickFirstCell(baseElement);
				expect(cell.textContent).toEqual('(1)');
			});

			it('allows multiple pencil marks in the same cell', () => {
				const puzzleData = [...arbitraryPuzzle];
				puzzleData[0] = null;
				const {baseElement} = renderSubject({puzzleData});

				selectPencilTool(baseElement, 1);
				clickFirstCell(baseElement);
				selectPencilTool(baseElement, 2);
				const cell = clickFirstCell(baseElement);
				expect(cell.textContent).toEqual('(1,\u200b2)');
			});

			it('does not change cells with given values', () => {
				const puzzleData = [...arbitraryPuzzle];
				puzzleData[0] = 6;
				const {baseElement} = renderSubject({puzzleData});

				selectPencilTool(baseElement, 1);
				const cell = clickFirstCell(baseElement);
				expect(cell.textContent).toEqual('6');
			});

			it('does not change cells with entered regular numbers', () => {
				const puzzleData = [...arbitraryPuzzle];
				puzzleData[0] = null;
				const {baseElement} = renderSubject({puzzleData});

				enterRegularNumInFirstCell(baseElement, 1);
				selectPencilTool(baseElement, 2);
				const cell = clickFirstCell(baseElement);
				expect(cell.textContent).toEqual('1');
			});
		});

		describe('With the erase tool selected', () => {
			it('erases the cell', () => {
				const puzzleData = [...arbitraryPuzzle];
				puzzleData[0] = null;
				const {baseElement} = renderSubject({puzzleData});

				selectRegularNumTool(baseElement, 1);
				clickFirstCell(baseElement);

				selectEraserTool(baseElement);
				const cell = clickFirstCell(baseElement);
				expect(cell.textContent).toEqual('');
			});

			it('does not erase cells with given values', () => {
				const puzzleData = [...arbitraryPuzzle];
				puzzleData[0] = 1;
				const {baseElement} = renderSubject({puzzleData});

				selectEraserTool(baseElement);
				const cell = clickFirstCell(baseElement);
				expect(cell.textContent).toEqual('1');
			});
		});
	});

	it('supports undo', () => {
		const puzzleData = [...arbitraryPuzzle];
		puzzleData[0] = null;
		const {baseElement} = renderSubject({puzzleData});

		enterRegularNumInFirstCell(baseElement, 1);
		eraseFirstCell(baseElement);
		enterRegularNumInFirstCell(baseElement, 2);

		const undo = () => fireEvent.click(findButtonByText(baseElement, 'Undo'));
		undo();
		expect(firstCell(baseElement).textContent).toEqual('');
		undo();
		expect(firstCell(baseElement).textContent).toEqual('1');
		undo();
		expect(firstCell(baseElement).textContent).toEqual('');
	});

	it('can reset to the initial state', () => {
		const puzzleData = [...arbitraryPuzzle];
		puzzleData[0] = null;
		const {baseElement} = renderSubject({puzzleData});

		enterRegularNumInFirstCell(baseElement, 1);
		eraseFirstCell(baseElement);
		enterRegularNumInFirstCell(baseElement, 2);

		fireEvent.click(findButtonByText(baseElement, 'Start Over'));
		expect(firstCell(baseElement).textContent).toEqual('');

		fireEvent.click(findButtonByText(baseElement, 'Undo'));
		expect(firstCell(baseElement).textContent).toEqual('2');
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

		const {baseElement} = renderSubject({puzzleData});

		enterRegularNumInFirstCell(baseElement, 1);
		expect(firstCell(baseElement).textContent).toEqual('1');
		expect(regularNumButton(baseElement, 1).disabled).toBeTruthy();
		expect(regularNumButton(baseElement, 1).disabled).toBeTruthy();
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

		const {baseElement} = renderSubject({puzzleData});

		enterPencilMarkInFirstCell(baseElement, 1);
		expect(regularNumButton(baseElement, 1).disabled).toBeFalsy();
		expect(regularNumButton(baseElement, 1).disabled).toBeFalsy();
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
		const {baseElement} = renderSubject({puzzleData});

		enterRegularNumInFirstCell(baseElement, 1);
		expect(baseElement.textContent).not.toContain('Solved!');

		eraseFirstCell(baseElement);
		enterRegularNumInFirstCell(baseElement, 8);
		expect(baseElement.querySelector('.Game-main')!.textContent).toContain('Solved!');
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
			const {baseElement} = renderSubject({puzzleData});

			enterRegularNum(baseElement, 8, 0);
			enterRegularNum(baseElement, 8, 1);

			fireEvent.click(findButtonByText(baseElement, 'Undo Until Solvable'));
			expect(cell(baseElement, 0).textContent).toEqual('8');
			expect(cell(baseElement, 1).textContent).toEqual('');
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
			const {baseElement} = renderSubject({puzzleData});

			enterRegularNum(baseElement, 8, 0);
			enterPencilMark(baseElement, 8, 1);
			enterPencilMark(baseElement, 8, 2);

			fireEvent.click(findButtonByText(baseElement, 'Clear Pencil Marks'));
			expect(cell(baseElement, 0).textContent).toEqual('8');
			expect(cell(baseElement, 1).textContent).toEqual('');
			expect(cell(baseElement, 2).textContent).toEqual('');
		});
	});

	describe('When the "Redo Last As Pencil" button is clicked', () => {
		it('undoes the previous entry and repeats it as a pencil mark', () => {
			const {baseElement} = renderSubject({});

			enterRegularNum(baseElement, 8, 0);
			enterPencilMark(baseElement, 7, 1);
			enterRegularNum(baseElement, 8, 1);
			fireEvent.click(findButtonByText(baseElement, 'Redo Last As Pencil'));

			expect(cell(baseElement, 0).textContent).toEqual('8');
			expect(cell(baseElement, 1).textContent).toEqual('(7,\u200b8)');
		});

		it('switches to the pencil tool', () => {
			const {baseElement} = renderSubject({});

			enterRegularNum(baseElement, 8, 0);
			fireEvent.click(findButtonByText(baseElement, 'Redo Last As Pencil'));
			fireEvent.click(cell(baseElement, 1));
			expect(cell(baseElement, 1).textContent).toEqual('(8)');
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
				const {baseElement} = renderSubject({
					puzzle: puzzleBeforeSolve,
					solver
				});

				solveOneCell(baseElement);

				expect(solver.solveOneCell).toHaveBeenCalledWith(
					puzzleBeforeSolve
				);
				expect(cell(baseElement, 0).textContent).toEqual('1');
			});

			it('shows an alert when no cells can be solved', () => {
				const solver = jasmine.createSpyObj('solver',
					['solve', 'solveOneCell']);
				solver.solveOneCell.and.returnValue(null);
				const {baseElement} = renderSubject({solver});
				spyOn(window, 'alert');

				solveOneCell(baseElement);

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
				spyOn(window, 'alert');
				const {baseElement} = renderSubject({solver});

				solveOneCell(baseElement);
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
				const {baseElement} = renderSubject({solver});

				solveOneCell(baseElement);

				expect(cell(baseElement, 3)).toHaveClass('GridCell-autoSolved');
			});

			it('updates the highlight across moves and undos', () => {
				const solver = jasmine.createSpyObj('solver',
					['solve', 'solveOneCell']);
				solver.solveOneCell.and.returnValue({
					puzzle: parsePuzzle(''),
					strategy: '',
					changedCell: {x: 3, y: 0}
				});
				const {baseElement} = renderSubject({solver});

				solveOneCell(baseElement);
				selectRegularNumTool(baseElement, 1);
				clickFirstCell(baseElement);

				expect(cell(baseElement, 3)).not.toHaveClass('GridCell-autoSolved');
				fireEvent.click(findButtonByText(baseElement, 'Undo'));
				expect(cell(baseElement, 3)).toHaveClass('GridCell-autoSolved');
			});

			function solveOneCell(baseElement: HTMLElement) {
				fireEvent.click(findButtonByText(baseElement, 'Solve a single cell'));
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
			const {baseElement} = renderSubject({puzzle: puzzleBeforeSolve, solver});

			fireEvent.click(findButtonByText(baseElement, buttonText));

			expect(solver.solve).toHaveBeenCalledWith(
				puzzleBeforeSolve,
				expectedStrategies
			);
			expect(cell(baseElement, 0).textContent).toEqual('1');
		}
	});
});

function enterRegularNumInFirstCell(baseElement: HTMLElement, num: number) {
	enterRegularNum(baseElement, num, 0);
}

function enterRegularNum(baseElement: HTMLElement, num: number, cellIx: number) {
	fireEvent.click(regularNumButton(baseElement, num));
	fireEvent.click(cell(baseElement, cellIx));
	expect(cell(baseElement, cellIx).textContent)
		.withContext('Number entry might be broken')
		.toEqual(`${num}`);
}

function enterPencilMarkInFirstCell(baseElement: HTMLElement, num: number) {
	enterPencilMark(baseElement, num, 0);
}

function enterPencilMark(baseElement: HTMLElement, num: number, cellIx: number) {
	fireEvent.click(pencilButton(baseElement, num));
	fireEvent.click(cell(baseElement, cellIx));
	expect(cell(baseElement, cellIx).textContent)
		.withContext('Number entry might be broken')
		.toEqual(`(${num})`);
}

function eraseFirstCell(baseElement: HTMLElement) {
	selectEraserTool(baseElement);
	clickFirstCell(baseElement);
	expect(firstCell(baseElement).textContent)
		.withContext('Erasing might be broken')
		.toEqual('');
}

function selectRegularNumTool(baseElement: HTMLElement, num: number) {
	fireEvent.click(regularNumButton(baseElement, num));
}

function regularNumButton(baseElement: HTMLElement, num: number): HTMLInputElement {
	const regular = baseElement.querySelector('.NumberPicker-regular');
	return findByLabelText(regular!, num + '');
}

function selectPencilTool(baseElement: HTMLElement, num: number) {
	fireEvent.click(pencilButton(baseElement, num));
}

function pencilButton(baseElement: HTMLElement, num: number): HTMLInputElement {
	const pencil = baseElement.querySelector('.NumberPicker-pencil');
	return findByLabelText(pencil!, num + '');
}

function selectEraserTool(baseElement: HTMLElement) {
	fireEvent.click(findByLabelText(baseElement, 'Erase'));
}

function clickFirstCell(baseElement: HTMLElement): HTMLElement {
	fireEvent.click(firstCell(baseElement));
	return firstCell(baseElement);
}

function firstCell(baseElement: HTMLElement): HTMLElement {
	return cell(baseElement, 0);
}

function cell(baseElement: HTMLElement, cellIx: number): HTMLElement {
	return baseElement.querySelectorAll('.Grid td')[cellIx] as HTMLElement;
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
	return render(
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