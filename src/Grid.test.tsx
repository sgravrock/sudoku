import React from 'react';
import {Grid} from "./Grid";
import {Puzzle} from "./Puzzle";
import {Tool} from "./Tools";
import {SelectedToolProvider} from "./Tools/SelectedTool";
import {render} from "@testing-library/react";

describe('Grid', () => {
	it('renders the specified puzzle', () => {
		const puzzle = Puzzle.fromRawCells([
			1, null, null, null, null, null, null, null, null,
			null, 2, null, null, null, null, null, null, null,
			null, null, 3, null, null, null, null, null, null,
			null, null, null, 4, null, null, null, null, null,
			null, null, null, null, 5, null, null, null, null,
			null, null, null, null, null, 6, null, null, null,
			null, null, null, null, null, null, 7, null, null,
			null, null, null, null, null, null, null, 8, null,
			null, null, null, null, null, null, null, null, 9
		]);
		const {baseElement} = renderGrid({puzzle});
		const cellTexts = Array.from(baseElement.querySelectorAll('tr'))
			.map(row => {
				return Array.from(row.querySelectorAll('td'))
					.map(cell => cell.textContent);
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
		const {baseElement} = renderGrid({puzzle});
		const cells = baseElement.querySelectorAll('td');
		expect(cells[0]).toHaveClass('GridCell-immutable');
		expect(cells[1]).not.toHaveClass('GridCell-immutable');
	});

	it('allows line-breaking between pencil marks', () => {
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
		]).setCell({x: 0, y: 0}, {ns: [1, 2, 3], pencil: true});
		const {baseElement} = renderGrid({puzzle});
		const cell = baseElement.querySelector('td');
		expect(cell!.textContent)
			.withContext('Should have zero-width spaces')
			.toEqual('(1,\u200b2,\u200b3)');
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
		]).setCell({x: 0, y: 0}, {ns: [1], pencil: true});
		const tool = {type: 'number', n: 1, pencil: true};
		const {baseElement} = renderGrid({puzzle, tool});
		const cells = baseElement.querySelectorAll('td');
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
		<SelectedToolProvider initialTool={tool}>
			<Grid puzzle={props.puzzle} onCellClick={() => {}} autoSolvedCell={null} />)
		</SelectedToolProvider>
	);
}

function arbitraryTool(): Tool {
	return {type: 'eraser'};
}
