import React, {useEffect, useMemo, useState} from "react";
import {Grid} from "./Grid";
import {SelectedToolContext, ToolPicker} from "./Tools/ToolPicker";
import {isRegularNumEntry, Puzzle} from "./Puzzle";
import {applyTool} from "./Tools/ToolApplier";
import {ToolEnabler} from "./Tools/ToolEnabler";
import {Tool} from "./Tools";
import './Game.css';
import {AutoSolveForm} from "./AutoSolveForm";
import * as humanStyleSolver from "./humanStyleSolver";

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
		setPuzzles([...puzzles, applyTool(tool, {x, y}, puzzle)]);
	}

	function undo() {
		if (puzzles.length > 1) {
			const newPuzzles = [...puzzles];
			newPuzzles.pop();
			setPuzzles(newPuzzles);
		}
	}

	function redoAsPencil() {
		const prevPuzzle = puzzles[puzzles.length - 2];
		const {x, y, n} = findRegularNumChange(puzzle, prevPuzzle);
		const tool: Tool = {type: 'number', pencil: true, n};
		const newPuzzle = applyTool(tool, {x, y}, prevPuzzle)
		setPuzzles([...puzzles, newPuzzle]);
		selectTool(tool);
	}

	function undoUntilSolvable() {
		const newPuzzles = [...puzzles];

		while (newPuzzles[newPuzzles.length - 1].hasErrors()) {
			newPuzzles.pop();
		}

		setPuzzles(newPuzzles);
	}

	function clearPencilMarks() {
		setPuzzles([...puzzles, puzzle.clearPencilMarks()]);
	}

	function reset() {
		setPuzzles([...puzzles, puzzles[0]]);
	}

	function autoSolve(strategies: humanStyleSolver.Strategy[]) {
		const result = humanStyleSolver.solve(puzzle, strategies);
		setPuzzles([...puzzles, result.endState]);
	}

	function solveOneCell() {
		const result = humanStyleSolver.solveOneCell(puzzle);

		if (result) {
			setPuzzles([...puzzles, result.puzzle]);
			// Allow the cell update to appear before the alert blocks rendering
			setTimeout(() => {
				window.alert(
					`Solved cell at x=${result.changedCell.x} ` +
					`y=${result.changedCell.y} via ${result.strategy}`
				);
			}, 0);
		} else {
			window.alert("Could not solve any cells.");
		}
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
					<button onClick={redoAsPencil}>Redo Last As Pencil</button>
					<button onClick={undoUntilSolvable}>Undo Until Solvable</button>
					<button onClick={clearPencilMarks}>Clear Pencil Marks</button>
					<button onClick={reset}>Start Over</button>

					<AutoSolveForm solve={autoSolve} solveOneCell={solveOneCell} />
				</div>
			</div>
		</SelectedToolContext.Provider>
	);
};

export function nextToolFromKeystroke(tool: Tool, key: string): Tool {
	if ((key === 'p' || key === ' ') && tool.type === 'number') {
		return {...tool, pencil: !tool.pencil};
	} else if (key >= '1' && key <= '9') {
		const n = parseInt(key, 10);

		if (tool.type === 'number' && tool.n === n) {
			return {...tool, pencil: !tool.pencil};
		} else if (tool.type === 'number') {
			return {...tool, n};

		} else {
			return {type: 'number', n, pencil: false};
		}
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

interface RegularNumChange {
	x: number, y: number, n: number
}

function findRegularNumChange(newer: Puzzle, older: Puzzle): RegularNumChange {
	for (let x = 0; x < 9; x++) {
		for (let y = 0; y < 9; y++) {
			const ne = newer.cell({x, y}).entry;
			const oe = older.cell({x, y}).entry;

			if (isRegularNumEntry(ne) && !isRegularNumEntry(oe)) {
				return {x, y, n: ne.n}
			}
		}
	}

	throw new Error('findRegularNumChange found nothing');
}


export {Game};