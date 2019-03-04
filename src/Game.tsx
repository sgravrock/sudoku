import React, {useState} from "react";
import {Grid} from "./Grid";
import {SelectedToolContext, Tool, ToolPicker} from "./ToolPicker";
import {Puzzle} from "./Puzzle";
import {applyTool} from "./ToolApplier";

interface Props {
	puzzleData: (number | null)[];
}

const Game: React.FunctionComponent<Props> = props => {
	const [puzzles, setPuzzles] = useState(() => [Puzzle.fromRawCells(props.puzzleData)]);
	const [tool, selectTool] = useState<Tool>({type: 'number', n: 1, pencil: false});
	const puzzle = puzzles[puzzles.length - 1];

	function onCellClick(x: number, y: number) {
		setPuzzles([...puzzles, applyTool(tool, x, y, puzzle)]);
	}

	function undo() {
		if (puzzles.length > 1) {
			const newPuzzles = [...puzzles];
			newPuzzles.pop();
			setPuzzles(newPuzzles);
		}
	}

	return (
		<SelectedToolContext.Provider value={[tool, selectTool]}>
			<Grid puzzle={puzzle} onCellClick={onCellClick} />
			<ToolPicker />
			<button onClick={undo}>Undo</button>
		</SelectedToolContext.Provider>
	);
};

export {Game};