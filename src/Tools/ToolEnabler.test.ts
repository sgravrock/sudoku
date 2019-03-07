import {ToolEnabler} from "./ToolEnabler";
import {Tool} from "./ToolPicker";
import {Puzzle} from "../Puzzle";

describe('ToolEnabler', () => {
	describe('isEnabled', () => {
		describe('For a number with 8 or fewer entries', () => {
			it('returns true', () => {
				let puzzle = makePuzzle().setCell(0, 1, {n: 2, pencil: false});

				for (let i = 0; i < 8; i++) {
					puzzle = puzzle.setCell(i, 0, {n: 1, pencil: false});
				}

				const subject = new ToolEnabler(puzzle);
				expect(subject.isEnabled(normal(1))).toEqual(true);
			});
		});

		describe('For a number with 9 or more non-pencil entries', () => {
			it('returns false', () => {
				let puzzle = makePuzzle();

				for (let i = 0; i < 9; i++) {
					puzzle = puzzle.setCell(i, 0, {n: 1, pencil: false});
				}

				const subject = new ToolEnabler(puzzle);
				expect(subject.isEnabled(normal(1))).toEqual(false);
			});
		});

		describe('For a number with 9 or more entries including pencil', () => {
			it('returns true', () => {
				let puzzle = makePuzzle().setCell(0, 0, {ns: [1], pencil: true});

				for (let i = 1; i < 9; i++) {
					puzzle = puzzle.setCell(i, 0, {n: 1, pencil: false});
				}

				const subject = new ToolEnabler(puzzle);
				expect(subject.isEnabled(normal(1))).toEqual(true);
			});
		});

		describe('For the eraser', () => {
			it('returns true', () => {
				const subject = new ToolEnabler(makePuzzle());
				expect(subject.isEnabled({type: 'eraser'})).toEqual(true);
			});
		});
	});
});

function makePuzzle() {
	return Puzzle.fromRawCells([
		null, null, null, null, null, null, null, null, null,
		null, null, null, null, null, null, null, null, null,
		null, null, null, null, null, null, null, null, null,
		null, null, null, null, null, null, null, null, null,
		null, null, null, null, null, null, null, null, null,
		null, null, null, null, null, null, null, null, null,
		null, null, null, null, null, null, null, null, null,
		null, null, null, null, null, null, null, null, null,
		null, null, null, null, null, null, null, null, null,
	]);
}

function normal(n: number): Tool {
	return {
		type: 'number',
		n,
		pencil: false
	};
}

function pencil(n: number): Tool {
	return {
		type: 'number',
		n,
		pencil: true
	};
}
