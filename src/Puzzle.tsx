interface Cell {
	value: (number|null);
	mutable: boolean;
}

export class Puzzle {
	private readonly _cells: Cell[];

	static fromRawCells(rawInput: (number|null)[]): Puzzle {
		const cells = rawInput.map(value => {
			if (value === null) {
				return {value: null, mutable: true};
			} else {
				// Inputs are 0-8. We want 1-9.
				return {value: value + 1, mutable: false};
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

	setCell(x: number, y: number, value: number|null): Puzzle {
		const newCells = [...this._cells];
		newCells[9 * y + x] = {value, mutable: true};
		return new Puzzle(newCells);
	}
}