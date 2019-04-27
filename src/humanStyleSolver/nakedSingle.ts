import {Puzzle} from "../Puzzle";
import {acceptsNormal, allCoords, couldBeValid, firstMatchOrNull, nineIndices, nineValues, singleOrNull} from "./utils";

export function solveNakedSingle(puzzle: Puzzle): Puzzle | null {
	return firstMatchOrNull(
		allCoords,
		c => solveNakedSingleInCell(puzzle, c.x, c.y)
	);
}

export function solveNakedSingleInCell(
	puzzle: Puzzle,
	x: number,
	y: number
): Puzzle | null {
	const solutions = nineValues
		.map(v => enterIfValid(puzzle, x, y, v))
		.filter(s => s !== null);

	return singleOrNull(solutions);
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