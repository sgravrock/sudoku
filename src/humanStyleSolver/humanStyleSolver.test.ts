import {parsePuzzle} from "../testSupport/parsePuzzle";
import {easyStrategies, grade, Grade, solve, solveOneCell} from "./index";


describe('humanStyleSolver', () => {
	describe('solve', () => {
		it('solves a puzzle using the provided techniques', () => {
			const puzzle = parsePuzzle(`  |  7
										  |3    27
										  |65278  4
										  |        8
										  |4  628  9
										  |5
										  | 7  43192
										  |  48    7
										  |   2  3 `);
			const expected = parsePuzzle(`|947365821
										  |381492765
										  |652781943
										  |769154238
										  |413628579
										  |528937416
										  |876543192
										  |234819657
										  |195276384`);

			const result = solve(puzzle, easyStrategies);
			expect(result.solved).toEqual(true);
			// TODO: find a nice way to do this without the n-1 conversion,
			// while preserving usable diff output.
			const expectedNums = expected.toRawCells();
			const actualNums = result.endState.toRawCells();
			expect(actualNums).toEqual(expectedNums);
		});

		it('does not solve a puzzle that needs more techniques', () => {
			const puzzle = parsePuzzle((`|  5      2
										 | 6   2 1 3
										 |   297
										 |   168
										 |6 94  5  8
										 |5 1 7  4
										 |8     9`));

			const result = solve(puzzle, easyStrategies);
			expect(result.solved).toEqual(false);
		});

		it('does not solve an overly hard puzzle with easy techniques', () => {
			const puzzle = parsePuzzle((`|   8
										 |6   7 5
										 |  3 9
										 |71     3
										 |9    14 7
										 |8    7 29
										 |3 27 9 6
										 |    6 351
										 |   3   7`));

			const result = solve(puzzle, easyStrategies);
			expect(result.solved).toEqual(false);
		});
	});

	describe('solveOneCell', () => {
		it('solves a single cell using the first strategy that succeeds', () => {
			const puzzle = parsePuzzle('');
			const expectedResult = {
				puzzle: parsePuzzle('1'),
				strategy: 'strategy 1',
				changedCell: {x: 0, y: 0}
			};
			const strategies = [
				jasmine.createSpy('strategy 0').and.returnValue(null),
				jasmine.createSpy('strategy 1').and.returnValue(expectedResult),
				jasmine.createSpy('strategy 2')
			];

			const actualResult = solveOneCell(puzzle, strategies);

			expect(strategies[0]).toHaveBeenCalledWith(puzzle);
			expect(strategies[1]).toHaveBeenCalledWith(puzzle);
			expect(strategies[2]).not.toHaveBeenCalled();
			expect(actualResult).toEqual(expectedResult);
		});

		it('returns null when no cell can be solved', () => {
			const puzzle = parsePuzzle('');
			const result = solveOneCell(puzzle, [() => null]);
			expect(result).toBeNull();
		});
	});

	describe('grade', () => {
		it('grades a puzzle Easy that can be solved with only hidden singles', () => {
			const puzzle = parsePuzzle(`|  7
										|3    27
										|65278  4
										|        8
										|4  628  9
										|5
										| 7  43192
										|  48    7
										|   2  3 `);
			expect(grade(puzzle)).toEqual(Grade.Easy);
		});

		it('does not grade a puzzle Easy that requires more techniques', () => {
			const puzzle = parsePuzzle(`|       13
										| 35 1    
										|1   9  4 
										| 8       
										|  26 9  1
										|      536
										|4  7   8 
										|     5  4
										|  6   2  `);
			expect(grade(puzzle)).not.toEqual(Grade.Easy);
		});
	})
});