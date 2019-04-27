import {NonPencilEntry, Puzzle} from "../Puzzle";
import {solveNakedSingle, solveNakedSingleInCell} from "./nakedSingle";
import {parsePuzzle} from "../testSupport/parsePuzzle";

describe('nakedSingle', () => {
	describe('solveNakedSingle', () => {
		it('returns null when there are no naked singles', () => {
			expect(solveNakedSingle(emptyPuzzle)).toBeNull();
		});

		it('solves a column naked single', () => {
			const input = parsePuzzle(`|
									   | 1
									   | 2
									   | 7
									   | 4
									   | 5
									   | 8
									   | 3
									   | 6`);
			const expected = input.setCell({x: 1, y: 0}, {n: 9, pencil: false});
			expect(solveNakedSingle(input)).toEqual(expected);
		});

		it('solves a row naked single', () => {
			const input = parsePuzzle(`|
									   | 12345678`);
			const expected = input.setCell({x: 0, y: 1}, {n: 9, pencil: false});
			expect(solveNakedSingle(input)).toEqual(expected);
		});

		it('solves a house naked single', () => {
			const input = parsePuzzle(`|123
									   |4 6
									   |789`);
			const expected = input.setCell({x: 1, y: 1}, {n: 5, pencil: false});
			expect(solveNakedSingle(input)).toEqual(expected);
		});

		it("doesn't solve a hidden single that isn't a naked single", () => {
			const input = parsePuzzle(`|1  45678
									   |
									   |
									   | 3
									   |        3`);
			expect(solveNakedSingle(input)).toBeNull();
		});

		it('solves combined row, column, and house constraints', () => {
			const input = parsePuzzle(`| 12
									   |345
									   |67
									   |8`);
			const expected = input.setCell({x: 0, y: 0}, {n: 9, pencil: false});
			expect(solveNakedSingle(input)).toEqual(expected);
		});

		// TODO can we fuzz column, row, and house naked singles?
		it('fills in any final entry', () => {
			const solved = solvedPuzzle(true);

			for (let x = 0; x < 9; x++) {
				for (let y = 0; y < 9; y++) {
					const input = solved.setCell({x, y}, null);
					expect(solveNakedSingle(input))
						.withContext(`x=${x} y=${y}`)
						.toEqual(solved);
				}
			}
		});
	});

	describe('solveNakedSingleInCell', () => {
		it('returns null when the cell is not a naked single', () => {
			expect(solveNakedSingleInCell(emptyPuzzle, {x: 0, y: 0})).toBeNull();
		});

		it('returns null when the cell when the cell has a fixed entry', () => {
			expect(solveNakedSingleInCell(solvedPuzzle(false), {x: 0, y: 0})).toBeNull();

		});

		it('returns null when the cell when the cell has a normal entry', () => {
			expect(solveNakedSingleInCell(solvedPuzzle(true), {x: 0, y: 0})).toBeNull();
		});

		it('fills in a naked single', () => {
			const basis = solvedPuzzle();
			const coord = {x: 0, y: 0}
			const n = (basis.cell(coord).entry as NonPencilEntry).n;
			const puzzle = basis.setCell(coord, null);
			const expected = basis.setCell(coord, {n, pencil: false});

			expect(solveNakedSingleInCell(puzzle, coord)).toEqual(expected);
		});

		// TODO fuzz "fills in any row naked single"
		// TODO fuzz "fills in any row column single"
		// TODO fuzz "fills in any house column single"
	});
});

const emptyPuzzle = Puzzle.fromRawCells((repeat(null, 81)));

function solvedPuzzle(mutable: boolean = false): Puzzle {
	return parsePuzzle(`|943758612
					    |165294387
					    |287613954
					    |712986435
					    |436571829
					    |598342761
					    |879135246
					    |321467598
					    |654829173`, mutable);
}

function repeat<T>(value: T, times: number): T[] {
	const result: T[] = [];

	for (let i = 0; i < times; i++) {
		result.push(value);
	}

	return result;
}
