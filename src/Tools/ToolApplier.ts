import {Puzzle} from "../Puzzle";
import {Tool} from "./index";

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

	return removeAffectedPencils(
		puzzle.setCell(x, y, {n, pencil: false}),
		x, y, n);
}


function applyPencil(puzzle: Puzzle, x: number, y: number, n: number): Puzzle {
	const entry = puzzle.cell(x, y).entry;

	if (entry && !entry.pencil) {
		return puzzle;
	} else if (!entry) {
		return puzzle.setCell(x, y, {pencil: true, ns: [n]});
	} else if (!entry.ns.includes(n)) {
		return puzzle.setCell(x, y, {...entry, ns: [...entry.ns, n]});
	} else {
		return removePencil(puzzle, x, y, n);
	}
}

function removeAffectedPencils(puzzle: Puzzle, x: number, y: number, n: number): Puzzle {
	const xbase = Math.floor(x / 3) * 3;
	const ybase = Math.floor(y / 3) * 3;

	for (let x2 = xbase; x2 < xbase + 3; x2++) {
		for (let y2 = ybase; y2 < ybase + 3; y2++) {
			puzzle = removePencil(puzzle, x2, y2, n);
		}
	}

	for (let x2 = 0; x2 < 9; x2++) {
		puzzle = removePencil(puzzle, x2, y, n);
	}

	for (let y2 = 0; y2 < 9; y2++) {
		puzzle = removePencil(puzzle, x, y2, n);
	}

	return puzzle;
}

function removePencil(puzzle: Puzzle, x: number, y: number, n: number): Puzzle {
	let entry = puzzle.cell(x, y).entry;

	if (!entry || !entry.pencil) {
		return puzzle;
	}

	const ns = entry.ns.filter(x => x !== n);

	if (ns.length === 0) {
		entry = null;
	} else {
		entry = {ns, pencil: true}
	}

	return puzzle.setCell(x, y, entry);
}