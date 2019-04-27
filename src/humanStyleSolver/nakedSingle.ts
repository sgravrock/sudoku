import {Coord, Puzzle} from "../Puzzle";
import {acceptsNormal, allCoords, couldBeValid, firstMatchOrNull, nineIndices, nineValues, singleOrNull} from "./utils";

export function solveNakedSingle(puzzle: Puzzle): Puzzle | null {
	return firstMatchOrNull(
		allCoords,
		c => solveNakedSingleInCell(puzzle, c)
	);
}

export function solveNakedSingleInCell(puzzle: Puzzle, coord: Coord): Puzzle | null {
	const solutions = nineValues
		.map(v => enterIfValid(puzzle, coord, v))
		.filter(s => s !== null);

	return singleOrNull(solutions);
}

function enterIfValid(puzzle: Puzzle, coord: Coord, n: number): Puzzle | null {
	if (acceptsNormal(puzzle, coord)) {
		const updated = puzzle.setCell(coord, {n, pencil: false});

		if (couldBeValid(updated, coord)) {
			return updated;
		}
	}

	return null;
}