import {Coord, Puzzle} from "../Puzzle";
import {
	acceptsNormal,
	allCoords,
	couldBeValid,
	enterIfValid,
	firstMatchOrNull,
	nineIndices,
	nineValues,
	singleOrNull
} from "./utils";

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