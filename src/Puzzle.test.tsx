import {Puzzle} from "./Puzzle";

describe('Puzzle', () => {
	describe('setCell', () => {
		it('returns a new puzzle with the cell set', () => {
			const subject = new Puzzle(arbitraryRawData);
			const result = subject.setCell(3, 5, 7);
			expect(result.cell(3, 5)).toEqual(7);
			expect(subject.cell(3, 5)).toBeNull();
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