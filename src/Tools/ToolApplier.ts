import {Coord, Puzzle, removeAffectedPencils, removePencil} from "../Puzzle";
import {Tool} from "./index";

export function applyTool(tool: Tool, c: Coord, puzzle: Puzzle): Puzzle {
	if (!puzzle.cell(c).mutable) {
		return puzzle;
	}

	switch (tool.type) {
		case 'eraser':
			return puzzle.setCell(c, null);

		case 'number':
			if (tool.pencil) {
				return applyPencil(puzzle, c, tool.n);
			} else {
				return applyNormal(puzzle, c, tool.n);
			}
	}

	return puzzle;
}

function applyNormal(puzzle: Puzzle, c: Coord, n: number): Puzzle {
	const entry = puzzle.cell(c).entry;

	if (entry && !entry.pencil) {
		if (entry.n === n) {
			return puzzle.setCell(c, null);
		} else {
			return puzzle;
		}
	}

	return removeAffectedPencils(
		puzzle.setCell(c, {n, pencil: false}),
		c, n);
}


function applyPencil(puzzle: Puzzle, c: Coord, n: number): Puzzle {
	const entry = puzzle.cell(c).entry;

	if (entry && !entry.pencil) {
		return puzzle;
	} else if (!entry) {
		return puzzle.setCell(c, {pencil: true, ns: [n]});
	} else if (!entry.ns.includes(n)) {
		return puzzle.setCell(c, {...entry, ns: [...entry.ns, n]});
	} else {
		return removePencil(puzzle, c, n);
	}
}