import * as sudoku from './oneValuedSudoku';
import {shallowEq} from "./equality";

export interface NonPencilEntry {
	n: number;
	pencil: false;
}

export interface PencilEntry {
	ns: number[];
	pencil: true;
}

export type Entry = NonPencilEntry | PencilEntry;

export interface Cell {
	entry: Entry | null;
	mutable: boolean;
}

export interface Coord {
	x: number;
	y: number;
}

export class Puzzle {
	private readonly _cells: Cell[];

	static fromRawCells(rawInput: (number|null)[], mutable: boolean = false): Puzzle {
		const cells = rawInput.map<Cell>(n => {
			if (n === null) {
				return {entry: null, mutable: true};
			} else if (n < 1 || n > 9) {
				throw new Error(`Cell value out of range: ${n}`);
			} else {
				return {entry: {n: n, pencil: false}, mutable};
			}
		});
		return new Puzzle(cells);
	}

	constructor(cells: Cell[]) {
		this._cells = cells;
	}

	cell(c: Coord): Cell {
		return this._cells[9 * c.y + c.x];
	}

	setCell(c: Coord, entry: Entry | null): Puzzle {
		const newCells = [...this._cells];
		newCells[9 * c.y + c.x] = {entry, mutable: true};
		return new Puzzle(newCells);
	}

	clearPencilMarks() {
		return new Puzzle(this._cells.map(c => {
			if (c.entry && c.entry.pencil) {
				return {...c, entry: null};
			} else {
				return c;
			}
		}));
	}

	hasNonPencilEntry(c: Coord): boolean {
		const entry = this._cells[9 * c.y + c.x].entry;
		return entry !== null && !entry.pencil;
	}

	entriesWith(predicate: (e: Entry) => boolean): number {
		return this._cells
			.map(c => c.entry)
			.filter(e => e && predicate(e))
			.length
	}

	isSolved(): boolean {
		const rawCells = this.toRawCells();
		return shallowEq(rawCells, sudoku.solvepuzzle(rawCells));
	}

	hasErrors() {
		return sudoku.solvepuzzle(this.toRawCells()) === null;
	}


	toRawCells(): (number|null)[] {
		return this._cells.map(cell => {
			if (cell.entry && !cell.entry.pencil) {
				return cell.entry.n;
			} else {
				return null;
			}
		});
	}
}

export function isRegularNumEntry(entry: Entry | null): entry is NonPencilEntry {
	return !!entry && !entry.pencil;
}

export function removeAffectedPencils(puzzle: Puzzle, c: Coord, n: number): Puzzle {
	const xbase = Math.floor(c.x / 3) * 3;
	const ybase = Math.floor(c.y / 3) * 3;

	for (let x2 = xbase; x2 < xbase + 3; x2++) {
		for (let y2 = ybase; y2 < ybase + 3; y2++) {
			puzzle = removePencil(puzzle, {x: x2, y: y2}, n);
		}
	}

	for (let x2 = 0; x2 < 9; x2++) {
		puzzle = removePencil(puzzle, {x: x2, y: c.y}, n);
	}

	for (let y2 = 0; y2 < 9; y2++) {
		puzzle = removePencil(puzzle, {x: c.x, y: y2}, n);
	}

	return puzzle;
}

export function removePencil(puzzle: Puzzle, c: Coord, n: number): Puzzle {
	let entry = puzzle.cell(c).entry;

	if (!entry || !entry.pencil) {
		return puzzle;
	}

	const ns = entry.ns.filter(x => x !== n);

	if (ns.length === 0) {
		entry = null;
	} else {
		entry = {ns, pencil: true}
	}

	return puzzle.setCell(c, entry);
}