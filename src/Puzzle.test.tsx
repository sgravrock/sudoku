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