interface Cell {
	value: (number|null);
	mutable: boolean;
}

export class Puzzle {
	private readonly _cells: Cell[];

	static fromRawCells(rawInput: (number|null)[]): Puzzle {
		const cells = rawInput.map(value => ({value, mutable: value === null}));
		return new Puzzle(cells);
	}

	constructor(cells: Cell[]) {
		this._cells = cells;
	}

	cell(x: number, y: number): Cell {
		return this._cells[9 * y + x];
	}

	setCell(x: number, y: number, value: number): Puzzle {
		const newCells = [...this._cells];
		newCells[9 * y + x] = {value, mutable: true};
		return new Puzzle(newCells);
	}
}