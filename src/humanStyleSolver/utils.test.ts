import {parsePuzzle} from "../testSupport/parsePuzzle";
import {coordsInHouse, couldBeValid, firstMatchOrNull, houseContainingCoord} from "./utils";

describe('utils', () => {
	describe('couldBeValid', () => {
		it('returns true if the entry does not participate in conficts', () => {
			const puzzle = parsePuzzle(`|123
									    |456
									    |789`);
			expect(couldBeValid(puzzle, {x: 1, y: 1})).toEqual(true);
		});

		it("returns false if the entry's row has a conflict", () => {
			const puzzle = parsePuzzle('122');
			expect(couldBeValid(puzzle, {x: 1, y: 0})).toEqual(false);
		});

		it("returns false if the entry's column has a conflict", () => {
			const puzzle = parsePuzzle(`|1
										|2
										|2`);
			expect(couldBeValid(puzzle, {x: 0, y: 1})).toEqual(false);
		});

		describe("returns false if the entry's house has a conflict", () => {
			it('in house 0', () => {
				const puzzle = parsePuzzle(`|123
											|456
											|785`);
				expect(couldBeValid(puzzle, {x: 0, y: 1})).toEqual(false);
			});

			it('in house 1', () => {
				const puzzle = parsePuzzle(`|   123
											|   456
											|   785`);
				expect(couldBeValid(puzzle, {x: 3, y: 0})).toEqual(false);
			});

			it('in house 2', () => {
				const puzzle = parsePuzzle(`|      123
											|      456
											|      785`);
				expect(couldBeValid(puzzle, {x: 6, y: 0})).toEqual(false);
			});

			it('in house 3', () => {
				const puzzle = parsePuzzle(`|
											|
											|
											|123
											|456
											|785`);
				expect(couldBeValid(puzzle, {x: 0, y: 3})).toEqual(false);
			});

			it('in house 4', () => {
				const puzzle = parsePuzzle(`|
											|
											|
											|   123
											|   456
											|   785`);
				expect(couldBeValid(puzzle, {x: 3, y: 3})).toEqual(false);
			});

			it('in house 5', () => {
				const puzzle = parsePuzzle(`|
											|
											|
											|      123
											|      456
											|      785`);
				expect(couldBeValid(puzzle, {x: 6, y: 3})).toEqual(false);
			});

			it('in house 6', () => {
				const puzzle = parsePuzzle(`|
											|
											|
											|
											|
											|
											|123
											|456
											|785`);
				expect(couldBeValid(puzzle, {x: 0, y: 6})).toEqual(false);
			});

			it('in house 7', () => {
				const puzzle = parsePuzzle(`|
											|
											|
											|
											|
											|
											|   123
											|   456
											|   785`);
				expect(couldBeValid(puzzle, {x: 3, y: 6})).toEqual(false);
			});

			it('in house 8', () => {
				const puzzle = parsePuzzle(`|
											|
											|
											|
											|
											|
											|      123
											|      456
											|      785`);
				expect(couldBeValid(puzzle, {x: 6, y: 6})).toEqual(false);
			});

		});
	});

	describe('coordsInHouse', () => {
		it('returns correct coordinates for house 0', () => {
			expect(coordsInHouse(0)).toEqual([
				{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0},
				{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1},
				{x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2},
			]);
		});

		it('returns correct coordinates for house 1', () => {
			expect(coordsInHouse(1)).toEqual([
				{x: 3, y: 0}, {x: 4, y: 0}, {x: 5, y: 0},
				{x: 3, y: 1}, {x: 4, y: 1}, {x: 5, y: 1},
				{x: 3, y: 2}, {x: 4, y: 2}, {x: 5, y: 2},
			]);
		});

		it('returns correct coordinates for house 2', () => {
			expect(coordsInHouse(2)).toEqual([
				{x: 6, y: 0}, {x: 7, y: 0}, {x: 8, y: 0},
				{x: 6, y: 1}, {x: 7, y: 1}, {x: 8, y: 1},
				{x: 6, y: 2}, {x: 7, y: 2}, {x: 8, y: 2},
			]);
		});

		it('returns correct coordinates for house 3', () => {
			expect(coordsInHouse(3)).toEqual([
				{x: 0, y: 3}, {x: 1, y: 3}, {x: 2, y: 3},
				{x: 0, y: 4}, {x: 1, y: 4}, {x: 2, y: 4},
				{x: 0, y: 5}, {x: 1, y: 5}, {x: 2, y: 5},
			]);
		});

		it('returns correct coordinates for house 4', () => {
			expect(coordsInHouse(4)).toEqual([
				{x: 3, y: 3}, {x: 4, y: 3}, {x: 5, y: 3},
				{x: 3, y: 4}, {x: 4, y: 4}, {x: 5, y: 4},
				{x: 3, y: 5}, {x: 4, y: 5}, {x: 5, y: 5},
			]);
		});

		it('returns correct coordinates for house 5', () => {
			expect(coordsInHouse(5)).toEqual([
				{x: 6, y: 3}, {x: 7, y: 3}, {x: 8, y: 3},
				{x: 6, y: 4}, {x: 7, y: 4}, {x: 8, y: 4},
				{x: 6, y: 5}, {x: 7, y: 5}, {x: 8, y: 5},
			]);
		});

		it('returns correct coordinates for house 6', () => {
			expect(coordsInHouse(6)).toEqual([
				{x: 0, y: 6}, {x: 1, y: 6}, {x: 2, y: 6},
				{x: 0, y: 7}, {x: 1, y: 7}, {x: 2, y: 7},
				{x: 0, y: 8}, {x: 1, y: 8}, {x: 2, y: 8},
			]);
		});

		it('returns correct coordinates for house 7', () => {
			expect(coordsInHouse(7)).toEqual([
				{x: 3, y: 6}, {x: 4, y: 6}, {x: 5, y: 6},
				{x: 3, y: 7}, {x: 4, y: 7}, {x: 5, y: 7},
				{x: 3, y: 8}, {x: 4, y: 8}, {x: 5, y: 8},
			]);
		});

		it('returns correct coordinates for house 8', () => {
			expect(coordsInHouse(8)).toEqual([
				{x: 6, y: 6}, {x: 7, y: 6}, {x: 8, y: 6},
				{x: 6, y: 7}, {x: 7, y: 7}, {x: 8, y: 7},
				{x: 6, y: 8}, {x: 7, y: 8}, {x: 8, y: 8},
			]);
		});
	});

	describe('houseContainingCoord', () => {
		it('is the inverse of coordsInHouse for all valid inputs', () => {
			for (let x = 0; x < 9; x++) {
				for (let y = 0; y < 9; y++) {
					const h = houseContainingCoord({x, y});
					expect(coordsInHouse(h))
						.withContext(`x=${x} y=${y}`)
						.toContain({x, y});
				}
			}
		})
	});

	describe('firstMatchOrNull', () => {
		it('returns the first non-null value returned by the func', () => {
			const inputs = [1, 2, 3];
			const f = (x: number) => x === 2 ? 'two' : null;
			expect(firstMatchOrNull(inputs, f)).toEqual('two');
		});

		it('returns null if f never returns non-null', () => {
			const inputs = [1, 2, 3];
			const f = () => null;
			expect(firstMatchOrNull(inputs, f)).toBeNull();
		});
	});
});