import {parsePuzzle} from "../testSupport/parsePuzzle";
import {easyStrategies, grade, Grade, solve} from "./index";


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