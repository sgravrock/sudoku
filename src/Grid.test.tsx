import React from 'react';
import {mount} from 'enzyme';
import {Grid} from "./Grid";
import {Puzzle} from "./Puzzle";
import {SelectedToolContext} from './Tools/ToolPicker';
import {Tool} from "./Tools";

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
		const subject = renderGrid({puzzle});
		const cellTexts = subject.find('tr').map(
			row => row.find('td').map(cell => cell.text())
		);
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
		const subject = renderGrid({puzzle});
		const cells = subject.find('td');
		expect(cells.at(0)).toHaveClassName('GridCell-immutable');
		expect(cells.at(1)).not.toHaveClassName('GridCell-immutable');
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
		const subject = renderGrid({puzzle, tool});
		const cells = subject.find('td');
		expect(cells.at(0)).toHaveClassName('GridCell-current-pencil');
		expect(cells.at(0)).not.toHaveClassName('GridCell-current');
		expect(cells.at(1)).not.toHaveClassName('GridCell-current-pencil');
	});
});

interface Props {
	puzzle: Puzzle;
	tool?: Tool;
}

function renderGrid(props: Props) {
	const tool = props.tool || arbitraryTool();
	return mount(
		<SelectedToolContext.Provider value={[tool, () => {}]}>
			<Grid puzzle={props.puzzle} onCellClick={() => {}} />)
		</SelectedToolContext.Provider>
	);
}

function arbitraryTool(): Tool {
	return {type: 'eraser'};
}
