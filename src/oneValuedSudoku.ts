// @ts-ignore
import sudoku from 'sudoku';

type Board = (number|null)[];

export function makepuzzle(): Board {
	return toOneBased(sudoku.makepuzzle());
}

export function ratepuzzle(puzzle: Board, samples: number): number {
	return sudoku.ratepuzzle(toZeroBased(puzzle), samples);
}

export function solvepuzzle(puzzle: Board): Board {
	const answer = sudoku.solvepuzzle(toZeroBased(puzzle));
	return answer && toOneBased(answer);
}

function toZeroBased(puzzle: Board): Board {
	return puzzle.map(n => n === null ? n : n - 1);
}

function toOneBased(puzzle: Board): Board {
	return puzzle.map(n => n === null ? n : n + 1);
}