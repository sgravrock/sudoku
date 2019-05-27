import {parsePuzzle} from "../testSupport/parsePuzzle";
import {solveHiddenSingle} from "./hiddenSingle";

describe('hiddenSingle', () => {
	describe('solveHiddenSingle', () => {
		it('solves a hidden single in a row', () => {
			const puzzle = parsePuzzle(`|1  45678
                                        |
                                        |
                                        | 3
                                        |        3`);
			const expected = puzzle.setCell({x: 2, y: 0}, {n: 3, pencil: false});
			expect(solveHiddenSingle(puzzle)).toEqual({
				puzzle: expected,
				changedCell: {x: 2, y: 0},
				strategy: 'Hidden Single'
			});
		});

		it('solves a hidden single in a column', () => {
			const puzzle = parsePuzzle(`|1
									    |   3
									    |
									    |4
									    |5
									    |6
									    |7
									    |8
									    |      3`);
			const expected = puzzle.setCell({x: 0, y: 2}, {n: 3, pencil: false});
			expect(solveHiddenSingle(puzzle)).toEqual({
				puzzle: expected,
				changedCell: {x: 0, y: 2},
				strategy: 'Hidden Single'
			});
		});

		it('solves a hidden single in a house', () => {
			const puzzle = parsePuzzle(`|123
                                        |4 69
                                        |78`);
			const expected = puzzle.setCell({x: 2, y: 2}, {n: 9, pencil: false});
			expect(solveHiddenSingle(puzzle)).toEqual({
				puzzle: expected,
				changedCell: {x: 2, y: 2},
				strategy: 'Hidden Single'
			});
		});
	});
});