import {Coord, Puzzle} from "../Puzzle";
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

function removeAffectedPencils(puzzle: Puzzle, c: Coord, n: number): Puzzle {
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

function removePencil(puzzle: Puzzle, c: Coord, n: number): Puzzle {
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