export class Puzzle {
	private readonly _cells: (number|null)[];

	constructor(cells: (number|null)[]) {
		this._cells = cells;
	}

	cell(x: number, y: number) {
		return this._cells[9 * y + x];
	}

	setCell(x: number, y: number, value: number): Puzzle {
		const newCells = [...this._cells];
		newCells[9 * y + x] = value;
		return new Puzzle(newCells);
	}
}