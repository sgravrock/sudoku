import {Puzzle} from "../Puzzle";

export function parsePuzzle(input: string, mutable: boolean = false): Puzzle {
	const lines = input.split('\n');

	while (lines.length < 9) {
		lines.push('')
	}

	const rawCells = lines
		.map(stripPrefix)
		.map(padTo9)
		.join('')
		.split('')
		.map(toNumber);

	return Puzzle.fromRawCells(rawCells, mutable);
}

function stripPrefix(line: string): string {
	return line.replace(/^\s*\|/, '');
}

function padTo9(line: string): string {
	while (line.length < 9) {
		line += ' ';
	}

	return line;
}

function toNumber(c: string): number | null {
	if (c === ' ' ) {
		return null;
	} else {
		// This is intended as input to Puzzle.fromString,
		// which takes 0-based numbers.
		return parseInt(c, 10) - 1;
	}
}