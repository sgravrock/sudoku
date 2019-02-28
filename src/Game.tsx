import React, {useState} from "react";
import {Grid} from "./Grid";
import {SelectedToolContext, Tool, ToolPicker} from "./ToolPicker";

interface Props {
	puzzle: (number | null)[];
}

function setCell(puzzle: (number | null)[], x: number, y: number, tool: Tool) {
	const newPuzzle = [...puzzle];
	newPuzzle[9 * y + x] = tool.n;
	return newPuzzle;
}

const Game: React.FunctionComponent<Props> = props => {
	const [puzzle, setPuzzle] = useState(props.puzzle);
	const [tool, selectTool] = useState({n: 1, pencil: false});

	function onCellClick(x: number, y: number) {
		setPuzzle(setCell(puzzle, x, y, tool));
	}

	return (
		<SelectedToolContext.Provider value={[tool, selectTool]}>
			<Grid puzzle={puzzle} onCellClick={onCellClick} />
			<ToolPicker />
		</SelectedToolContext.Provider>
	);
};

export {Game};