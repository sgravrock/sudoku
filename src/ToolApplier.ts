import {Puzzle} from "./Puzzle";
import {Tool} from "./ToolPicker";

export function applyTool(tool: Tool, x: number, y: number, puzzle: Puzzle): Puzzle {
	if (!puzzle.cell(x, y).mutable) {
		return puzzle;
	}

	switch (tool.type) {
		case 'eraser':
			return puzzle.setCell(x, y, null);

		case 'number':
			if (tool.pencil) {
				return applyPencil(puzzle, x, y, tool.n);
			} else {
				return applyNormal(puzzle, x, y, tool.n);
			}
	}

	return puzzle;
}

function applyNormal(puzzle: Puzzle, x: number, y: number, n: number): Puzzle {
	const entry = puzzle.cell(x, y).entry;

	if (entry && !entry.pencil) {
		if (entry.n === n) {
			return puzzle.setCell(x, y, null);
		} else {
			return puzzle;
		}
	}

	return puzzle.setCell(x, y, {n, pencil: false});
}


function applyPencil(puzzle: Puzzle, x: number, y: number, n: number): Puzzle {
	let entry = puzzle.cell(x, y).entry;

	if (entry && !entry.pencil) {
		return puzzle;
	}

	if (!entry) {
		entry = {pencil: true, ns: [n]};
	} else if (!entry.ns.includes(n)) {
		entry = {...entry, ns: [...entry.ns, n]};
	} else if (entry.ns.length === 1) {
		entry = null;
	} else {
		entry = {...entry, ns: entry.ns.filter(x => x !== n)};
	}

	return puzzle.setCell(x, y, entry);
}
