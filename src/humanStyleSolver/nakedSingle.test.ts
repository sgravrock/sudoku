import {Puzzle} from "../Puzzle";
import {solveNakedSingle} from "./nakedSingle";
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
			const expected = input.setCell(1, 0, {n: 9, pencil: false});
			expect(solveNakedSingle(input)).toEqual(expected);
		});

		it('solves a row naked single', () => {
			const input = parsePuzzle(`|
									   | 12345678`);
			const expected = input.setCell(0, 1, {n: 9, pencil: false});
			expect(solveNakedSingle(input)).toEqual(expected);
		});

		it('solves a house naked single', () => {
			const input = parsePuzzle(`|123
									   |4 6
									   |789`);
			const expected = input.setCell(1, 1, {n: 5, pencil: false});
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
			const expected = input.setCell(0, 0, {n: 9, pencil: false});
			expect(solveNakedSingle(input)).toEqual(expected);
		});

		// TODO can we fuzz column, row, and house naked singles?
		it('fills in any final entry', () => {
			for (let x = 0; x < 9; x++) {
				for (let y = 0; y < 9; y++) {
					const input = solvedPuzzle.setCell(x, y, null);
					expect(solveNakedSingle(input))
						.withContext(`x=${x} y=${y}`)
						.toEqual(solvedPuzzle);
				}
			}
		});
	});
});

const emptyPuzzle = Puzzle.fromRawCells((repeat(null, 81)));

const solvedPuzzle = parsePuzzle(`|943758612
   								  |165294387
   								  |287613954
   								  |712986435
   								  |436571829
   								  |598342761
   								  |879135246
   								  |321467598
   								  |654829173`, true);

function repeat<T>(value: T, times: number): T[] {
	const result: T[] = [];

	for (let i = 0; i < times; i++) {
		result.push(value);
	}

	return result;
}
