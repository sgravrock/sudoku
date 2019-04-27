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
	return solveHiddenSingleInRows(puzzle)
		|| solveHiddenSingleInCols(puzzle)
		|| solveHiddenSingleInHouses(puzzle);
}

function solveHiddenSingleInRows(puzzle: Puzzle): Puzzle | null {
	return firstMatchOrNull(
		nineIndices,
		y => solveHiddenSingleInRow(puzzle, y)
	);
}

function solveHiddenSingleInRow(puzzle: Puzzle, y: number): Puzzle | null {
	const coords = coordsInRow(y);
	return firstMatchOrNull(
		nineValues,
		v => solveHiddenSingleForValueInGroup(puzzle, coords, v)
	);
}

function solveHiddenSingleInCols(puzzle: Puzzle): Puzzle | null {
	return firstMatchOrNull(
		nineIndices,
		x => solveHiddenSingleInCol(puzzle, x)
	);
}

function solveHiddenSingleInCol(puzzle: Puzzle, x: number): Puzzle | null {
	const coords = coordsInCol(x);
	return firstMatchOrNull(
		nineValues,
		v => solveHiddenSingleForValueInGroup(puzzle, coords, v)
	);
}

function solveHiddenSingleInHouses(puzzle: Puzzle): Puzzle | null {
	return firstMatchOrNull(
		nineIndices,
		h => solveHiddenSingleInHouse(puzzle, h)
	);
}

function solveHiddenSingleInHouse(puzzle: Puzzle, h: number): Puzzle | null {
	const coords = coordsInHouse(h);
	return firstMatchOrNull(
		nineValues,
		v => solveHiddenSingleForValueInGroup(puzzle, coords, v)
	);
}


function solveHiddenSingleForValueInGroup(
	puzzle: Puzzle,
	coords: Coord[],
	v: number
): Puzzle |  null {
	const candidates = coords
		.map(c => enterIfValid(puzzle, c, v))
		.filter(p => p !== null);

	return singleOrNull(candidates);
}