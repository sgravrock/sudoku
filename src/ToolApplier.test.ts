import {Entry, Puzzle} from "./Puzzle";
import {applyTool} from "./ToolApplier";
import {Tool} from "./ToolPicker";

describe('ToolApplier', () => {
	describe('applyTool', () => {
		describe('Normal number', () => {
			it('fills in empty cells', () => {
				const puzzle = makePuzzle(null);
				const result = applyTool(normal(1), 0, 0, puzzle);
				expect(result.cell(0, 0).entry).toEqual({n: 1, pencil: false});
			});

			it('replaces pencil marks', () => {
				const puzzle = makePuzzle(null).setCell(0, 0, {ns: [2], pencil: true});
				const result = applyTool(normal(1), 0, 0, puzzle);
				expect(result.cell(0, 0).entry).toEqual({n: 1, pencil: false});
			});

			it('erases non-pencil entries that have the same number', () => {
				const puzzle = makePuzzle(null).setCell(0, 0, {n: 1, pencil: false});
				const result = applyTool(normal(1), 0, 0, puzzle);
				expect(result.cell(0, 0).entry).toBeNull();
			});

			it('does not replace non-pencil entries that have other numbers', () => {
				const puzzle = makePuzzle(null).setCell(0, 0, {n: 2, pencil: false});
				const result = applyTool(normal(1), 0, 0, puzzle);
				expect(result.cell(0, 0).entry).toEqual({n: 2, pencil: false});
			});
		});

		describe('Pencil', () => {
			it('fills in empty cells', () => {
				const puzzle = makePuzzle(null);
				const result = applyTool(pencil(1), 0, 0, puzzle);
				expect(result.cell(0, 0).entry).toEqual({ns: [1], pencil: true});
			});

			it('adds to existing pencil marks', () => {
				const puzzle = makePuzzle(null).setCell(0, 0, {ns: [2], pencil: true});
				const result = applyTool(pencil(1), 0, 0, puzzle);
				expect(result.cell(0, 0).entry).toEqual({ns: [2, 1], pencil: true});
			});

			describe('When the cell already has this pencil mark', () => {
				describe('And no others', () => {
					it('clears the cell', () => {
						const puzzle = makePuzzle(null)
							.setCell(0, 0, {ns: [1], pencil: true});
						const result = applyTool(pencil(1), 0, 0, puzzle);
						expect(result.cell(0, 0).entry).toBeNull();
					});
				});

				describe('And some others', () => {
					it('removes the specified number', () => {
						const puzzle = makePuzzle(null)
							.setCell(0, 0, {ns: [1, 2, 3], pencil: true});
						const result = applyTool(pencil(2), 0, 0, puzzle);
						expect(result.cell(0, 0).entry).toEqual({
							ns: [1, 3],
							pencil: true
						});
					});
				});
			});

			it('does not replace normal numbers', () => {
				const puzzle = makePuzzle(null).setCell(0, 0, {n: 2, pencil: false});
				const result = applyTool(pencil(1), 0, 0, puzzle);
				expect(result.cell(0, 0).entry).toEqual({n: 2, pencil: false});
			});
		});

		describe('Eraser', () => {
			it('erases entries', () => {
				const puzzle = makePuzzle(null).setCell(0, 0, {n: 2, pencil: false});
				const result = applyTool({type: 'eraser'}, 0, 0, puzzle);
				expect(result.cell(0, 0).entry).toBeNull();
			});

			it('does not erase given values', () => {
				const puzzle = makePuzzle(0);
				const result = applyTool({type: 'eraser'}, 0, 0, puzzle);
				expect(result.cell(0, 0).entry).toEqual({n: 1, pencil: false});
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