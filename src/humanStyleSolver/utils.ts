import {NonPencilEntry, Puzzle} from "../Puzzle";

export interface Coord {
	x: number;
	y: number;
}

export function acceptsNormal(puzzle: Puzzle, x: number, y: number): boolean {
	const entry = puzzle.cell(x, y).entry;
	return entry === null || entry.pencil;
}

export function couldBeValid(puzzle: Puzzle, x: number, y: number): boolean {
	return !(
		rowHasConflicts(puzzle, y)
		|| colHasConflicts(puzzle, x)
		|| houseHasConflicts(puzzle, x, y)
	);
}

function rowHasConflicts(puzzle: Puzzle, y: number): boolean {
	const coords = nineIndices.map(x => ({x, y}));
	return groupHasConflicts(puzzle, coords);
}

function colHasConflicts(puzzle: Puzzle, x: number): boolean {
	const coords = nineIndices.map(y => ({x, y}));
	return groupHasConflicts(puzzle, coords);
}

function houseHasConflicts(puzzle: Puzzle, x: number, y: number): boolean {
	const coords = coordsInHouse(houseContainingCoord({x, y}));
	return groupHasConflicts(puzzle, coords);
}

function groupHasConflicts(
	puzzle: Puzzle,
	group:{x: number, y: number}[]
): boolean {
	const numbers: number[] = [];

	for (const {x, y} of group) {
		const entry = puzzle.cell(x, y).entry;

		if (entry && !entry.pencil) {
			if (numbers.includes(entry.n)) {
				return true;
			}

			numbers.push(entry.n);
		}
	}

	return false;
}

export function houseContainingCoord(c: Coord): number {
	const hx = Math.floor(c.x / 3);
	const hy = Math.floor(c.y / 3);
	return hy * 3 + hx;
}

export function coordsInHouse(h: number): Coord[] {
	const yBase = Math.floor(h / 3) * 3;
	const xBase = (h % 3) * 3;

	return flatMap([0, 1, 2], yd => {
		return [0, 1, 2].map(xd => ({x: xBase + xd, y: yBase + yd}));
	});
}

function flatMap<A, B>(a: A[], f: ((el: A) => B[])): B[] {
	let result: B[] = [];

	a.forEach(el => {
		const sr: B[] = f(el);
		result = result.concat(sr);
	});

	return result;
}


export const nineIndices = Object.freeze([0, 1, 2, 3, 4, 5, 6, 7, 8]);
export const nineValues = Object.freeze([1, 2, 3, 4, 5, 6, 7, 8, 9]);