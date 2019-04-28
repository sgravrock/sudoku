import {parsePuzzle} from "../testSupport/parsePuzzle";
import {easyStrategies, solve} from "./index";

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
	});
});