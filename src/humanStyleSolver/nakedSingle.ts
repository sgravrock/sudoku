import {Puzzle} from "../Puzzle";
import {acceptsNormal, couldBeValid, nineValues} from "./utils";

export function solveNakedSingle(puzzle: Puzzle): Puzzle | null {
	for (let x = 0; x < 9; x++) {
		for (let y = 0; y < 9; y++) {
			const maybeResult = solveNakedSingleInCell(puzzle, x, y);

			if (maybeResult) {
				return maybeResult;
			}

		}
	}

	return null;
}

export function solveNakedSingleInCell(
	puzzle: Puzzle,
	x: number,
	y: number
): Puzzle | null {
	const solutions = nineValues
		.map(v => enterIfValid(puzzle, x, y, v))
		.filter(s => s !== null);

	if (solutions.length === 1) {
		return solutions[0];
	} else {
		return null;
	}
}

function enterIfValid(
	puzzle: Puzzle,
	x: number,
	y: number,
	n: number
): Puzzle | null {
	if (acceptsNormal(puzzle, x, y)) {
		const updated = puzzle.setCell(x, y, {n, pencil: false});

		if (couldBeValid(updated, x, y)) {
			return updated;
		}
	}

	return null;
}