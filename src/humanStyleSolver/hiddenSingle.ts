import {Coord, Puzzle} from "../Puzzle";
import {
	coordsInCol,
	coordsInHouse,
	coordsInRow,
	enterIfValid,
	firstMatchOrNull,
	nineIndices,
	nineValues,
	singleOrNull
} from "./utils";

export function solveHiddenSingle(puzzle: Puzzle): Puzzle | null {
	return solveHiddenSingleInGroups(puzzle, coordsInRow)
		|| solveHiddenSingleInGroups(puzzle, coordsInCol)
		|| solveHiddenSingleInGroups(puzzle, coordsInHouse);
}

function solveHiddenSingleInGroups(
	puzzle: Puzzle,
	coordsForGroup: (g: number) => Coord[]
): Puzzle | null {
	return firstMatchOrNull(
		nineIndices,
		g => solveHiddenSingleInGroup(puzzle, coordsForGroup(g))
	);
}

function solveHiddenSingleInGroup(puzzle: Puzzle, coords: Coord[]): Puzzle | null {
	return firstMatchOrNull(
		nineValues,
		v => solveHiddenSingleForValueInGroup(puzzle, coords, v)
	);
}


function solveHiddenSingleForValueInGroup(
	puzzle: Puzzle,
	coords: Coord[],
	v: number
): Puzzle | null {
	const candidates = coords
		.map(c => enterIfValid(puzzle, c, v))
		.filter(p => p !== null);

	return singleOrNull(candidates);
}