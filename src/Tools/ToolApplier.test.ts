import {Puzzle} from "../Puzzle";
import {applyTool} from "./ToolApplier";
import {Tool} from "./index";

describe('ToolApplier', () => {
	describe('applyTool', () => {
		describe('Normal number', () => {
			it('fills in empty cells', () => {
				const puzzle = makePuzzle(null);
				const coord = {x: 0, y: 0};
				const result = applyTool(normal(1), coord, puzzle);
				expect(result.cell(coord).entry).toEqual({n: 1, pencil: false});
			});

			it('replaces pencil marks', () => {
				const coord = {x: 0, y: 0};
				const puzzle = makePuzzle(null).setCell(coord, {ns: [2], pencil: true});
				const result = applyTool(normal(1), coord, puzzle);
				expect(result.cell(coord).entry).toEqual({n: 1, pencil: false});
			});

			it('removes same-number pencil marks in the same house', () => {
				const puzzle = makePuzzle(null)
					.setCell({x: 0, y: 0}, {ns: [2,3], pencil: true})
					.setCell({x: 1, y: 1}, {ns: [2], pencil: true})
					.setCell({x: 3, y: 3}, {ns: [2,3], pencil: true});
				const result = applyTool(normal(2), {x: 2, y: 2}, puzzle);
				expect(result.cell({x: 0, y: 0}).entry).toEqual({ns: [3], pencil: true});
				expect(result.cell({x: 1, y: 1}).entry).toBeNull();
				expect(result.cell({x: 3, y: 3}).entry).toEqual({ns: [2,3], pencil: true});
			});

			it('removes same-number pencil marks in the same row', () => {
				const puzzle = makePuzzle(null)
					.setCell({x: 4, y: 0}, {ns: [2,3], pencil: true})
					.setCell({x: 3, y: 0}, {ns: [2], pencil: true});
				const result = applyTool(normal(2), {x: 2, y: 0}, puzzle);
				expect(result.cell({x: 4, y: 0}).entry).toEqual({ns: [3], pencil: true});
				expect(result.cell({x: 3, y: 0}).entry).toBeNull();
			});

			it('removes same-number pencil marks in the same column', () => {
				const puzzle = makePuzzle(null)
					.setCell({x: 0, y: 4}, {ns: [2,3], pencil: true})
					.setCell({x: 0, y: 3}, {ns: [2], pencil: true});
				const result = applyTool(normal(2), {x: 0, y: 2}, puzzle);
				expect(result.cell({x: 0, y: 4}).entry).toEqual({ns: [3], pencil: true});
				expect(result.cell({x: 0, y: 3}).entry).toBeNull();
			});

			it('erases non-pencil entries that have the same number', () => {
				const coord = {x: 0, y: 0};
				const puzzle = makePuzzle(null).setCell(coord, {n: 1, pencil: false});
				const result = applyTool(normal(1), coord, puzzle);
				expect(result.cell(coord).entry).toBeNull();
			});

			it('does not replace non-pencil entries that have other numbers', () => {
				const coord = {x: 0, y: 0};
				const puzzle = makePuzzle(null).setCell(coord, {n: 2, pencil: false});
				const result = applyTool(normal(1), coord, puzzle);
				expect(result.cell(coord).entry).toEqual({n: 2, pencil: false});
			});
		});

		describe('Pencil', () => {
			it('fills in empty cells', () => {
				const coord = {x: 0, y: 0};
				const puzzle = makePuzzle(null);
				const result = applyTool(pencil(1), coord, puzzle);
				expect(result.cell(coord).entry).toEqual({ns: [1], pencil: true});
			});

			it('adds to existing pencil marks', () => {
				const coord = {x: 0, y: 0};
				const puzzle = makePuzzle(null).setCell(coord, {ns: [2], pencil: true});
				const result = applyTool(pencil(1), coord, puzzle);
				expect(result.cell(coord).entry).toEqual({ns: [2, 1], pencil: true});
			});

			describe('When the cell already has this pencil mark', () => {
				describe('And no others', () => {
					it('clears the cell', () => {
						const coord = {x: 0, y: 0};
						const puzzle = makePuzzle(null)
							.setCell(coord, {ns: [1], pencil: true});
						const result = applyTool(pencil(1), coord, puzzle);
						expect(result.cell(coord).entry).toBeNull();
					});
				});

				describe('And some others', () => {
					it('removes the specified number', () => {
						const coord = {x: 0, y: 0};
						const puzzle = makePuzzle(null)
							.setCell(coord, {ns: [1, 2, 3], pencil: true});
						const result = applyTool(pencil(2), coord, puzzle);
						expect(result.cell(coord).entry).toEqual({
							ns: [1, 3],
							pencil: true
						});
					});
				});
			});

			it('does not replace normal numbers', () => {
				const coord = {x: 0, y: 0};
				const puzzle = makePuzzle(null).setCell(coord, {n: 2, pencil: false});
				const result = applyTool(pencil(1), coord, puzzle);
				expect(result.cell(coord).entry).toEqual({n: 2, pencil: false});
			});
		});

		describe('Eraser', () => {
			it('erases entries', () => {
				const coord = {x: 0, y: 0};
				const puzzle = makePuzzle(null).setCell(coord, {n: 2, pencil: false});
				const result = applyTool({type: 'eraser'}, coord, puzzle);
				expect(result.cell(coord).entry).toBeNull();
			});

			it('does not erase given values', () => {
				const coord = {x: 0, y: 0};
				const puzzle = makePuzzle(0);
				const result = applyTool({type: 'eraser'}, coord, puzzle);
				expect(result.cell(coord).entry).toEqual({n: 1, pencil: false});
			});
		});
	});
});

function makePuzzle(cell0RawValue: number | null): Puzzle {
	const rawData = [...arbitraryRawData];
	rawData[0] = cell0RawValue;
	return Puzzle.fromRawCells(rawData);
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

const arbitraryRawData: (number | null)[] = [
	null, null, null, null, null, null, null, null, null,
	null, null, null, null, null, null, null, null, null,
	null, null, null, null, null, null, null, null, null,
	null, null, null, null, null, null, null, null, null,
	null, null, null, null, null, null, null, null, null,
	null, null, null, null, null, null, null, null, null,
	null, null, null, null, null, null, null, null, null,
	null, null, null, null, null, null, null, null, null,
	null, null, null, null, null, null, null, null, null,
];