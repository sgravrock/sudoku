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

interface Cell {
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