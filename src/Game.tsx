import React, {useEffect, useMemo, useState} from "react";
import {Grid} from "./Grid";
import {SelectedToolContext, ToolPicker} from "./Tools/ToolPicker";
import {Puzzle} from "./Puzzle";
import {applyTool} from "./Tools/ToolApplier";
import {ToolEnabler} from "./Tools/ToolEnabler";
import {Tool} from "./Tools";

interface Props {
	puzzleData: (number | null)[];
}

const Game: React.FunctionComponent<Props> = props => {
	const [puzzles, setPuzzles] = useState(() => [Puzzle.fromRawCells(props.puzzleData)]);
	const [tool, selectTool] = useState<Tool>({type: 'number', n: 1, pencil: false});
	const puzzle = puzzles[puzzles.length - 1];
	const toolEnabler = useMemo(() => new ToolEnabler(puzzle), [puzzle]);

	useEffect(() => {
		function onKeyDown(e: KeyboardEvent) {
			if (e.key === 'p' && tool.type === 'number') {
				selectTool({...tool, pencil: !tool.pencil});
			} else if (e.key >= '1' && e.key <= '9') {
				const n = parseInt(e.key, 10);
				const pencil = tool.type === 'number' ? !tool.pencil : false;
				selectTool({type: 'number', n, pencil});
			}
		}

		document.addEventListener('keydown', onKeyDown);
		return () => document.removeEventListener('keydown', onKeyDown);
	}, [tool, selectTool]);

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

	function reset() {
		setPuzzles([...puzzles, puzzles[0]]);
	}

	return (
		<SelectedToolContext.Provider value={[tool, selectTool]}>
			{puzzle.isSolved() ? <h1>Solved!</h1>: ''}
			<Grid puzzle={puzzle} onCellClick={onCellClick} />
			<ToolPicker enabler={toolEnabler} />
			<button onClick={undo}>Undo</button>
			<button onClick={reset}>Start Over</button>
		</SelectedToolContext.Provider>
	);
};

export {Game};