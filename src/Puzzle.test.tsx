import {Puzzle} from "./Puzzle";

describe('Puzzle', () => {
	describe('fromRawCells', () => {
		it('creates fixed or normal cells as specified', () => {
			const input = [...arbitraryRawData];
			input[0] = 1;

			const fixed = Puzzle.fromRawCells(input, false);
			expect(fixed.cell({x: 0, y: 0}).entry).toEqual({n: 1, pencil: false});
			expect(fixed.cell({x: 0, y: 0}).mutable).toEqual(false);
			expect(fixed.cell({x: 0, y: 1}).entry).toBeNull();

			const normal = Puzzle.fromRawCells(input, true);
			expect(normal.cell({x: 0, y: 0}).entry).toEqual({n: 1, pencil: false});
			expect(normal.cell({x: 0, y: 0}).mutable).toEqual(true);
			expect(normal.cell({x: 0, y: 1}).entry).toBeNull();
		});
	});

	describe('setCell', () => {
		it('returns a new puzzle with the cell set', () => {
			const subject = Puzzle.fromRawCells(arbitraryRawData);
			const coord = {x: 3, y: 5};
			const result = subject.setCell(coord, {ns: [7], pencil: true});
			expect(result.cell(coord)).toEqual({
				entry: {ns: [7], pencil: true},
				mutable: true}
			);
			expect(subject.cell(coord)).toEqual({entry: null, mutable: true});
		});
	});

	describe('hasErrors', () => {
		function correctRawData() {
			return [
				2, 1, 4, 9, 5, 6, 3, 7, 8,
				6, 9, 3, 8, 7, 2, 5, 1, 4,
				5, 8, 7, 1, 3, 4, 9, 6, 2,
				3, 2, 6, 7, 1, 5, 4, 8, 9,
				9, 7, 5, 3, 4, 8, 1, 2, 6,
				8, 4, 1, 6, 2, 9, 7, 3, 5,
				7, 5, 9, 2, 8, 3, 6, 4, 1,
				4, 3, 8, 5, 6, 1, 2, 9, 7,
				1, 6, 2, 4, 9, 7, 8, 5, 3
			];
		}

		it('returns false when all cells are correct', () => {
			const subject = Puzzle.fromRawCells(correctRawData());
			expect(subject.hasErrors()).toEqual(false);
		});

		it('returns false when all cells are correct, empty, or pencil marks', () => {
			const subject = Puzzle.fromRawCells(correctRawData())
				.setCell({x: 0, y: 0}, null)
				.setCell({x: 0, y: 1}, {ns: [9], pencil: true});
			expect(subject.hasErrors()).toEqual(false);
		});

		it('returns true when there are incorrect non-pencil entries', () => {
			const subject = Puzzle.fromRawCells(correctRawData())
				.setCell({x: 0, y: 0}, {n: 5, pencil: false});
			expect(subject.hasErrors()).toEqual(true);
		});
	})
});

const arbitraryRawData: (number | null)[] = [
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