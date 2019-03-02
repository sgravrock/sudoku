import {Puzzle} from "./Puzzle";

describe('Puzzle', () => {
	describe('fromRawCells', () => {
		it('converts from 0- to 1-based values', () => {
			const input = [...arbitraryRawData];
			input[0] = 0;
			const result = Puzzle.fromRawCells(input);
			expect(result.cell(0, 0).value).toEqual(1);
			expect(result.cell(0, 1).value).toBeNull();
		});
	});

	describe('setCell', () => {
		it('returns a new puzzle with the cell set', () => {
			const subject = Puzzle.fromRawCells(arbitraryRawData);
			const result = subject.setCell(3, 5, 7);
			expect(result.cell(3, 5)).toEqual({value: 7, mutable: true});
			expect(subject.cell(3, 5)).toEqual({value: null, mutable: true});
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