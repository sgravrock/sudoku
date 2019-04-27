import {Coord, Puzzle} from "../Puzzle";


export function acceptsNormal(puzzle: Puzzle, coord: Coord): boolean {
	const entry = puzzle.cell(coord).entry;
	return entry === null || entry.pencil;
}

export function couldBeValid(puzzle: Puzzle, coord: Coord): boolean {
	return !(
		rowHasConflicts(puzzle, coord.y)
		|| colHasConflicts(puzzle, coord.x)
		|| houseHasConflicts(puzzle, coord)
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

function houseHasConflicts(puzzle: Puzzle, coord: Coord): boolean {
	const coords = coordsInHouse(houseContainingCoord(coord));
	return groupHasConflicts(puzzle, coords);
}

function groupHasConflicts(
	puzzle: Puzzle,
	group: Coord[]
): boolean {
	const numbers: number[] = [];

	for (const c of group) {
		const entry = puzzle.cell(c).entry;

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

export function firstMatchOrNull<A, B>(
	xs: A[],
	f: (x: A) => (B | null)
): B | null {
	for (const x of xs) {
		const r = f(x);

		if (r !== null) {
			return r;
		}
	}

	return null;
}

export function singleOrNull<T>(xs: ReadonlyArray<T>): T | null {
	if (xs.length === 1) {
		return xs[0];
	} else {
		return null;
	}
}

export function flatMap<A, B>(a: ReadonlyArray<A>, f: ((el: A) => B[])): B[] {
	let result: B[] = [];

	a.forEach(el => {
		const sr: B[] = f(el);
		result = result.concat(sr);
	});

	return result;
}


export const nineIndices = Object.freeze([0, 1, 2, 3, 4, 5, 6, 7, 8]);
export const nineValues = Object.freeze([1, 2, 3, 4, 5, 6, 7, 8, 9]);
export const allCoords = flatMap(nineIndices, x => {
	return nineIndices.map(y => ({x, y}));
});