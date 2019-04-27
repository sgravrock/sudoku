import {ToolEnabler} from "./ToolEnabler";
import {Puzzle} from "../Puzzle";
import {Tool} from "./index";

describe('ToolEnabler', () => {
	describe('isEnabled', () => {
		describe('For a number with 8 or fewer entries', () => {
			it('returns true', () => {
				let puzzle = makePuzzle().setCell({x: 0, y: 1}, {n: 2, pencil: false});

				for (let x = 0; x < 8; x++) {
					puzzle = puzzle.setCell({x, y: 0}, {n: 1, pencil: false});
				}

				const subject = new ToolEnabler(puzzle);
				expect(subject.isEnabled(normal(1))).toEqual(true);
			});
		});

		describe('For a number with 9 or more non-pencil entries', () => {
			it('returns false', () => {
				let puzzle = makePuzzle();

				for (let x = 0; x < 9; x++) {
					puzzle = puzzle.setCell({x, y: 0}, {n: 1, pencil: false});
				}

				const subject = new ToolEnabler(puzzle);
				expect(subject.isEnabled(normal(1))).toEqual(false);
			});
		});

		describe('For a number with 9 or more entries including pencil', () => {
			it('returns true', () => {
				let puzzle = makePuzzle().setCell({x: 0, y: 0}, {ns: [1], pencil: true});

				for (let x = 1; x < 9; x++) {
					puzzle = puzzle.setCell({x, y: 0}, {n: 1, pencil: false});
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
