import {parsePuzzle} from "../testSupport/parsePuzzle";
import {markHouseHiddenPair} from "./hiddenPair";

describe('hiddenPair', () => {
	describe('markHouseHiddenPair', () => {
		it('returns null when there is no house hidden pair', () => {
			const puzzle = parsePuzzle(`|12
										|4 6
										| 89`);
			expect(markHouseHiddenPair(puzzle)).toBeNull();
		});

		it('adds pencil marks to a hidden pair in a house', () => {
			const puzzle = parsePuzzle(`|12
										|4 63
										| 89`);
			const expected = puzzle
				.setCell({x: 2, y: 0}, {ns: [3], pencil: true})
				.setCell({x: 0, y: 2}, {ns: [3], pencil: true});
			expect(markHouseHiddenPair(puzzle)).toEqual(expected);
		});

		it('adds to existing pencil marks', () => {
			const puzzle = parsePuzzle(`|12
										|4 67
										| 89`)
				.setCell({x: 2, y: 0}, {ns: [3], pencil: true})
				.setCell({x: 0, y: 2}, {ns: [3], pencil: true});

			const expected = puzzle
				.setCell({x: 2, y: 0}, {ns: [3, 7], pencil: true})
				.setCell({x: 0, y: 2}, {ns: [3, 7], pencil: true});

			expect(markHouseHiddenPair(puzzle)).toEqual(expected);
		});
	});
});
