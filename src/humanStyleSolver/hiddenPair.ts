import {Coord, Puzzle} from "../Puzzle";
import {any, coordsInHouse, enterIfValid, firstMatchOrNull, nineIndices, nineValues} from "./utils";

export function markHouseHiddenPair(puzzle: Puzzle): Puzzle | null {
	return firstMatchOrNull(
		nineIndices,
		h => markHiddenPairInHouse(puzzle, h)
	);
}

function markHiddenPairInHouse(puzzle: Puzzle, h: number): Puzzle | null {
	const coords = coordsInHouse(h);
	return firstMatchOrNull(
		nineValues,
		v => markHiddenPairForValue(puzzle, coords, v)
	);
}

function markHiddenPairForValue(
	puzzle: Puzzle,
	coords: Coord[],
	v: number
): Puzzle | null {
	if (hasPencilMark(puzzle, coords, v)) {
		return null;
	}

	const candidates = coords.filter(c => enterIfValid(puzzle, c, v) !== null);

	if (candidates.length == 2) {
		return addPencil(addPencil(puzzle, candidates[0], v), candidates[1], v);
	} else {
		return null;
	}
}

function hasPencilMark(puzzle: Puzzle, coords: Coord[], v: number): boolean {
	return any(coords, c => {
		const entry = puzzle.cell(c).entry;
		return !!(entry && entry.pencil && entry.ns.includes(v));
	});
}

function addPencil(puzzle: Puzzle, coord: Coord, v: number): Puzzle {
	const entry = puzzle.cell(coord).entry;

	if (!entry) {
		return puzzle.setCell(coord, {ns: [v], pencil: true});
	} else if (entry.pencil) {
		return puzzle.setCell(coord, {ns: [...entry.ns, v], pencil: true});
	} else {
		throw new Error("addPencil tried to add to a non-pencil cell");
	}
}