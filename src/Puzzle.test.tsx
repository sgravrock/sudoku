import {Puzzle} from "./Puzzle";

describe('Puzzle', () => {
	describe('fromRawCells', () => {
		it('converts from 0- to 1-based values', () => {
			const input = [...arbitraryRawData];
			input[0] = 0;
			const result = Puzzle.fromRawCells(input);
			expect(result.cell(0, 0).entry).toEqual({n: 1, pencil: false});
			expect(result.cell(0, 1).entry).toBeNull();
		});
	});

	describe('setCell', () => {
		it('returns a new puzzle with the cell set', () => {
			const subject = Puzzle.fromRawCells(arbitraryRawData);
			const result = subject.setCell(3, 5, {ns: [7], pencil: true});
			expect(result.cell(3, 5)).toEqual({
				entry: {ns: [7], pencil: true},
				mutable: true}
			);
			expect(subject.cell(3, 5)).toEqual({entry: null, mutable: true});
		});
	});

	describe('hasErrors', () => {
		function correctRawData() {
			return [
				1, 0, 3, 8, 4, 5, 2, 6, 7,
				5, 8, 2, 7, 6, 1, 4, 0, 3,
				4, 7, 6, 0, 2, 3, 8, 5, 1,
				2, 1, 5, 6, 0, 4, 3, 7, 8,
				8, 6, 4, 2, 3, 7, 0, 1, 5,
				7, 3, 0, 5, 1, 8, 6, 2, 4,
				6, 4, 8, 1, 7, 2, 5, 3, 0,
				3, 2, 7, 4, 5, 0, 1, 8, 6,
				0, 5, 1, 3, 8, 6, 7, 4, 2
			];
		}

		it('returns false when all cells are correct', () => {
			const subject = Puzzle.fromRawCells(correctRawData());
			expect(subject.hasErrors()).toEqual(false);
		});

		it('returns false when all cells are correct, empty, or pencil marks', () => {
			const subject = Puzzle.fromRawCells(correctRawData())
				.setCell(0, 0, null)
				.setCell(0, 1, {ns: [9], pencil: true});
			expect(subject.hasErrors()).toEqual(false);
		});

		it('returns true when there are incorrect non-pencil entries', () => {
			const subject = Puzzle.fromRawCells(correctRawData())
				.setCell(0, 0, {n: 5, pencil: false});
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