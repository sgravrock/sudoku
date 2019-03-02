interface Entry {
	n: number;
	pencil: boolean;
}
interface Cell {
	entry: Entry | null;
	mutable: boolean;
}

export class Puzzle {
	private readonly _cells: Cell[];

	static fromRawCells(rawInput: (number|null)[]): Puzzle {
		const cells = rawInput.map(n => {
			if (n === null) {
				return {entry: null, mutable: true};
			} else {
				// Inputs are 0-8. We want 1-9.
				return {entry: {n: n + 1, pencil: false}, mutable: false};
			}
		});
		return new Puzzle(cells);
	}

	constructor(cells: Cell[]) {
		this._cells = cells;
	}

	cell(x: number, y: number): Cell {
		return this._cells[9 * y + x];
	}

	setCell(x: number, y: number, entry: Entry | null): Puzzle {
		const newCells = [...this._cells];
		newCells[9 * y + x] = {entry, mutable: true};
		return new Puzzle(newCells);
	}

	hasNonPencilEntry(x: number, y: number): boolean {
		const entry = this._cells[9 * y + x].entry;
		return entry !== null && !entry.pencil;
	}
}