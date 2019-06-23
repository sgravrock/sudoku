import React, {FC, useEffect, useMemo} from "react";
import {Grid} from "./Grid";
import {ToolPicker} from "./Tools/ToolPicker";
import {Puzzle} from "./Puzzle";
import {applyTool} from "./Tools/ToolApplier";
import {ToolEnabler} from "./Tools/ToolEnabler";
import {Tool} from "./Tools";
import './Game.css';
import * as humanStyleSolver from "./humanStyleSolver";
import {easyStrategies} from "./humanStyleSolver";
import {allStrategies} from "./humanStyleSolver";
import {GridStateProvider, useGridState} from "./GridState";
import {SelectedToolProvider, useSelectedTool} from "./Tools/SelectedTool";

interface Props {
	puzzleData: (number | null)[];
}

const Game: FC<Props> = props => {
	return (
		<GridStateProvider initializer={() => Puzzle.fromRawCells(props.puzzleData)}>
			<SelectedToolProvider initialTool={{type: 'number', n: 1, pencil: false}}>
				<GameUi />
			</SelectedToolProvider>
		</GridStateProvider>
	)
};

const GameUi: FC<{}> = () => {
	const gridState = useGridState();
	const [tool, selectTool] = useSelectedTool();
	const puzzle = gridState.current.puzzle;
	const toolEnabler = useMemo(() => new ToolEnabler(puzzle), [puzzle]);

	const onKeyDown = useMemo(
		() => (key: string) => selectTool(nextToolFromKeystroke(tool, key)),
		[tool, selectTool]
	);
	useDocumentKeydown(onKeyDown);

	function onCellClick(x: number, y: number) {
		gridState.push({
			puzzle: applyTool(tool, {x, y}, puzzle),
			autoSolvedCell: null
		});
	}

	function redoAsPencil() {
		const nextTool = gridState.redoAsPencil();
		selectTool(nextTool);
	}

	function clearPencilMarks() {
		gridState.push({
			puzzle: puzzle.clearPencilMarks(),
			autoSolvedCell: null
		});
	}

	function autoSolve(strategies: humanStyleSolver.Strategy[]) {
		const result = humanStyleSolver.solve(puzzle, strategies);
		gridState.push({
			puzzle: result.endState,
			autoSolvedCell: null
		});
	}

	function solveOneCell() {
		const result = humanStyleSolver.solveOneCell(puzzle);

		if (result) {
			gridState.push({
				puzzle: result.puzzle,
				autoSolvedCell: result.changedCell
			});
			// Allow the cell update to appear before the alert blocks rendering
			setTimeout(() => {
				window.alert(
					`Solved cell at x=${result.changedCell.x} ` +
					`y=${result.changedCell.y} using ${result.strategy}`
				);
			}, 0);
		} else {
			window.alert("Could not solve any cells.");
		}
	}

	return (
		<div className="Game">
			<div className="Game-main">
				{puzzle.isSolved() ? <h1>Solved!</h1> : ''}
				<Grid
					puzzle={puzzle}
					autoSolvedCell={gridState.current.autoSolvedCell}
					onCellClick={onCellClick}
				/>
			</div>
			<div className="Game-tools">
				<ToolPicker enabler={toolEnabler}/>
				<button onClick={gridState.undo}>Undo</button>
				<button onClick={redoAsPencil}>Redo Last As Pencil</button>
				<button onClick={clearPencilMarks}>Clear Pencil Marks</button>
				<button onClick={gridState.reset}>Start Over</button>

				<div className="Game-hints">
					<fieldset>
						<legend>Hints</legend>
						<button onClick={solveOneCell}>Solve a single cell</button>
						<button onClick={gridState.undoUntilSolvable}>
							Undo Until Solvable
						</button>
					</fieldset>

					<fieldset>
						<legend>Auto solve</legend>
						<button onClick={() => autoSolve(easyStrategies)}>
							Easy strategies
						</button>
						<button onClick={() => autoSolve(allStrategies)}>
							All strategies
						</button>
					</fieldset>
				</div>
			</div>
		</div>
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

function useDocumentKeydown(handler: (key: string) => void): void {
	// Warning: there's currently no test coverage for this.
	useEffect(() => {
		function onKeyDown(e: KeyboardEvent) {
			handler(e.key);
		}

		document.addEventListener('keydown', onKeyDown);
		return () => document.removeEventListener('keydown', onKeyDown);
	}, [handler]);
}

export {Game};