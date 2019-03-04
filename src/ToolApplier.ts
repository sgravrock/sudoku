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
				return puzzle.setCell(x, y, {n: tool.n, pencil: false});
			}
	}

	return puzzle;
}

function applyPencil(puzzle: Puzzle, x: number, y: number, n: number): Puzzle {
	let entry = puzzle.cell(x, y).entry;

	if (entry && !entry.pencil) {
		return puzzle;
	}

	if (entry) {
		entry = {...entry, ns: [...entry.ns, n]};
	} else {
		entry = {pencil: true, ns: [n]};
	}

	return puzzle.setCell(x, y, entry);
}
