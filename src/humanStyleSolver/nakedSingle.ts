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
import {SingleMoveResult} from "./index";

export function solveNakedSingle(puzzle: Puzzle): SingleMoveResult | null {
	return firstMatchOrNull(
		allCoords,
		c => solveNakedSingleInCell(puzzle, c)
	);
}

export function solveNakedSingleInCell(
	puzzle: Puzzle,
	coord: Coord
): SingleMoveResult | null {
	const solutions = nineValues
		.map(v => enterIfValid(puzzle, coord, v))
		.filter(s => s !== null);

	const maybeResult = singleOrNull(solutions);
	return maybeResult && {
		puzzle: maybeResult,
		changedCell: coord,
		strategy: 'Naked Single'
	}
}