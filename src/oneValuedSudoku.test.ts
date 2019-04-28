// @ts-ignore
import sudoku from 'sudoku';
import * as oneValuedSudoku from './oneValuedSudoku';

describe('oneValuedSudoku', () => {
	describe('makepuzzle', () => {
		it('converts 0-based values to 1-based values', () => {
			spyOn(sudoku, 'makepuzzle').and.returnValue([0, 1, 2, null]);
			expect(oneValuedSudoku.makepuzzle()).toEqual([1, 2, 3, null]);
		});
	});

	describe('ratepuzzle', () => {
		it('converts 1-based values to 0-based values', () => {
			spyOn(sudoku, 'ratepuzzle').and.returnValue(1.25);
			expect(oneValuedSudoku.ratepuzzle([1, 2, 3, null], 4)).toEqual(1.25);
			expect(sudoku.ratepuzzle).toHaveBeenCalledWith([0, 1, 2, null], 4);
		})
	});

	describe('solvepuzzle', () => {
		it('converts in both directions', () => {
			spyOn(sudoku, 'solvepuzzle').and.returnValue([0, 1]);
			expect(oneValuedSudoku.solvepuzzle([1, null])).toEqual([1, 2]);
			expect(sudoku.solvepuzzle).toHaveBeenCalledWith([0, null]);
		})
	});
});