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
import {SingleMoveResult} from "./index";

export function solveHiddenSingle(puzzle: Puzzle): SingleMoveResult | null {
	return solveHiddenSingleInGroups(puzzle, coordsInRow)
		|| solveHiddenSingleInGroups(puzzle, coordsInCol)
		|| solveHiddenSingleInGroups(puzzle, coordsInHouse);
}

function solveHiddenSingleInGroups(
	puzzle: Puzzle,
	coordsForGroup: (g: number) => Coord[]
): SingleMoveResult | null {
	return firstMatchOrNull(
		nineIndices,
		g => solveHiddenSingleInGroup(puzzle, coordsForGroup(g))
	);
}

function solveHiddenSingleInGroup(
	puzzle: Puzzle,
	coords: Coord[]
): SingleMoveResult | null {
	return firstMatchOrNull(
		nineValues,
		v => solveHiddenSingleForValueInGroup(puzzle, coords, v)
	);
}


function solveHiddenSingleForValueInGroup(
	puzzle: Puzzle,
	coords: Coord[],
	v: number
): SingleMoveResult | null {
	const candidates = coords
		.map(c => ({
			coord: c,
			puzzle: enterIfValid(puzzle, c, v)
		}))
		.filter(x => x.puzzle !== null);

	const maybeResult = singleOrNull(candidates);
	return maybeResult && {
		puzzle: maybeResult.puzzle!,
		changedCell: maybeResult.coord,
		strategy: 'Hidden Single'
	};
}