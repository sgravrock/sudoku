import React, {useState} from "react";
import {Grid} from "./Grid";
import {SelectedToolContext, Tool, ToolPicker} from "./ToolPicker";
import {Puzzle} from "./Puzzle";

interface Props {
	puzzleData: (number | null)[];
}

const Game: React.FunctionComponent<Props> = props => {
	const [puzzle, setPuzzle] = useState(Puzzle.fromRawCells(props.puzzleData));
	const [tool, selectTool] = useState<Tool>({type: 'number', n: 1, pencil: false});

	function onCellClick(x: number, y: number) {
		switch (tool.type) {
			case 'number':
				if (!tool.pencil) {
					setPuzzle(puzzle.setCell(x, y, {pencil: false, n: tool.n}));
				} else {
					setPuzzle(applyPencil(puzzle, x, y, tool.n));
				}
				break;
			case 'eraser': {
				setPuzzle(puzzle.setCell(x, y, null));
				break;
			}
		}
	}

	return (
		<SelectedToolContext.Provider value={[tool, selectTool]}>
			<Grid puzzle={puzzle} onCellClick={onCellClick} />
			<ToolPicker />
		</SelectedToolContext.Provider>
	);
};

function applyPencil(puzzle: Puzzle, x: number, y: number, n: number): Puzzle {
	let entry = puzzle.cell(x, y).entry;

	if (entry && !entry.pencil) {
		return puzzle;
	}

	if (entry) {
		entry = {...entry, ns: [...entry.ns, n]};
	} else {
		entry = {pencil: true, ns: [n]};
	}

	return puzzle.setCell(x, y, entry);
}

export {Game};