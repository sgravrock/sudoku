import React, {useState} from "react";
import {Grid} from "./Grid";
import {SelectedToolContext, Tool, ToolPicker} from "./ToolPicker";
import {Puzzle} from "./Puzzle";

interface Props {
	puzzleData: (number | null)[];
}

const Game: React.FunctionComponent<Props> = props => {
	const [puzzle, setPuzzle] = useState(Puzzle.fromRawCells(props.puzzleData));
	const [tool, selectTool] = useState({n: 1, pencil: false});

	function onCellClick(x: number, y: number) {
		setPuzzle(puzzle.setCell(x, y, tool.n));
	}

	return (
		<SelectedToolContext.Provider value={[tool, selectTool]}>
			<Grid puzzle={puzzle} onCellClick={onCellClick} />
			<ToolPicker />
		</SelectedToolContext.Provider>
	);
};

export {Game};