import React, {useState} from "react";
import {Grid} from "./Grid";
import {SelectedToolContext, Tool, ToolPicker} from "./ToolPicker";
import {Puzzle} from "./Puzzle";
import {applyTool} from "./ToolApplier";

interface Props {
	puzzleData: (number | null)[];
}

const Game: React.FunctionComponent<Props> = props => {
	const [puzzle, setPuzzle] = useState(Puzzle.fromRawCells(props.puzzleData));
	const [tool, selectTool] = useState<Tool>({type: 'number', n: 1, pencil: false});

	function onCellClick(x: number, y: number) {
		setPuzzle(applyTool(tool, x, y, puzzle));
	}

	return (
		<SelectedToolContext.Provider value={[tool, selectTool]}>
			<Grid puzzle={puzzle} onCellClick={onCellClick} />
			<ToolPicker />
		</SelectedToolContext.Provider>
	);
};

export {Game};