import React, {useEffect, useMemo, useState} from "react";
import {Grid} from "./Grid";
import {SelectedToolContext, ToolPicker} from "./Tools/ToolPicker";
import {Puzzle} from "./Puzzle";
import {applyTool} from "./Tools/ToolApplier";
import {ToolEnabler} from "./Tools/ToolEnabler";
import {Tool} from "./Tools";
import './Game.css';

interface Props {
	puzzleData: (number | null)[];
}

const Game: React.FunctionComponent<Props> = props => {
	const [puzzles, setPuzzles] = useState(() => [Puzzle.fromRawCells(props.puzzleData)]);
	const [tool, selectTool] = useState<Tool>({type: 'number', n: 1, pencil: false});
	const puzzle = puzzles[puzzles.length - 1];
	const toolEnabler = useMemo(() => new ToolEnabler(puzzle), [puzzle]);

	useDocumentKeydown(
		key => selectTool(nextToolFromKeystroke(tool, key)),
		[tool, selectTool]
	);

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
			<div className="Game">
				<div className="Game-main">
					{puzzle.isSolved() ? <h1>Solved!</h1> : ''}
					<Grid puzzle={puzzle} onCellClick={onCellClick}/>
				</div>
				<div className="Game-tools">
					<ToolPicker enabler={toolEnabler}/>
					<button onClick={undo}>Undo</button>
					<button onClick={reset}>Start Over</button>
				</div>
			</div>
		</SelectedToolContext.Provider>
	);
};

export function nextToolFromKeystroke(tool: Tool, key: string): Tool {
	if (key === 'p' && tool.type === 'number') {
		return {...tool, pencil: !tool.pencil};
	} else if (key >= '1' && key <= '9') {
		const n = parseInt(key, 10);
		const pencil = tool.type === 'number' ? !tool.pencil : false;
		return {type: 'number', n, pencil};
	} else {
		return tool;
	}
}

function useDocumentKeydown(handler: (key: string) => void, deps: any[]): void {
	// Warning: there's currently no test coverage for this.
	useEffect(() => {
		function onKeyDown(e: KeyboardEvent) {
			handler(e.key);
		}

		document.addEventListener('keydown', onKeyDown);
		return () => document.removeEventListener('keydown', onKeyDown);
	}, deps);
}

export {Game};