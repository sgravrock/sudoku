import React from 'react';
import {render} from 'react-testing-library'
import {Grid} from "./Grid";
import {Puzzle} from "./Puzzle";
import {SelectedToolContext, Tool} from './Tools/ToolPicker';

describe('Grid', () => {
	it('renders the specified puzzle', () => {
		const puzzle = Puzzle.fromRawCells([
			0, null, null, null, null, null, null, null, null,
			null, 1, null, null, null, null, null, null, null,
			null, null, 2, null, null, null, null, null, null,
			null, null, null, 3, null, null, null, null, null,
			null, null, null, null, 4, null, null, null, null,
			null, null, null, null, null, 5, null, null, null,
			null, null, null, null, null, null, 6, null, null,
			null, null, null, null, null, null, null, 7, null,
			null, null, null, null, null, null, null, null, 8
		]);
		const {container} = renderGrid({puzzle});
		const cellTexts = mapEls(container.querySelectorAll('tr'),
			row => {
				return mapEls(row.querySelectorAll('td'),
					cell => cell.textContent);
			});
		expect(cellTexts).toEqual([
			['1', '', '', '', '', '', '', '', ''],
			['', '2', '', '', '', '', '', '', ''],
			['', '', '3', '', '', '', '', '', ''],
			['', '', '', '4', '', '', '', '', ''],
			['', '', '', '', '5', '', '', '', ''],
			['', '', '', '', '', '6', '', '', ''],
			['', '', '', '', '', '', '7', '', ''],
			['', '', '', '', '', '', '', '8', ''],
			['', '', '', '', '', '', '', '', '9']
		])
	});

	it('marks immutable cells', () => {
		const puzzle = Puzzle.fromRawCells([
			1, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null
		]);
		const {container} = renderGrid({puzzle});
		const cells = container.querySelectorAll('td');
		expect(cells[0]).toHaveClass('GridCell-immutable');
		expect(cells[1]).not.toHaveClass('GridCell-immutable');
	});

	it('marks pencil cells for the current tool', () => {
		const puzzle = Puzzle.fromRawCells([
			null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null,
			null, null, null, null, null, null, null, null, null
		]).setCell(0, 0, {ns: [1], pencil: true});
		const tool = {type: 'number', n: 1, pencil: true};
		const {container} = renderGrid({puzzle, tool});
		const cells = container.querySelectorAll('td');
		expect(cells[0]).toHaveClass('GridCell-current-pencil');
		expect(cells[0]).not.toHaveClass('GridCell-current');
		expect(cells[1]).not.toHaveClass('GridCell-current-pencil');
	});
});

interface Props {
	puzzle: Puzzle;
	tool?: Tool;
}

function renderGrid(props: Props) {
	const tool = props.tool || arbitraryTool();
	return render(
		<SelectedToolContext.Provider value={[tool, () => {}]}>
			<Grid puzzle={props.puzzle} onCellClick={() => {}} />)
		</SelectedToolContext.Provider>
	);
}

function arbitraryTool(): Tool {
	return {type: 'eraser'};
}

function mapEls<T>(els: NodeListOf<HTMLElement>, tx: (el: HTMLElement) => T): T[] {
	return Array.prototype.map.call(els, tx) as T[];
}