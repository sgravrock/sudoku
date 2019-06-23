import React from 'react';
import {Coord, isRegularNumEntry, Puzzle} from "./Puzzle";
import {createContext, FC, useContext, useMemo, useState} from "react";
import {Tool} from "./Tools";
import {applyTool} from "./Tools/ToolApplier";

interface GridStateProviderProps {
	initializer: () => Puzzle;
}

interface GridHistoryEntry {
	puzzle: Puzzle;
	autoSolvedCell: Coord | null;
}

interface GridState {
	current: GridHistoryEntry;
	push: (state: GridHistoryEntry) => void;
	undo: () => void;
	undoUntilSolvable: () => void;
	redoAsPencil: () => Tool;
	reset: () => void;
}

const GridStateContext = createContext<GridState>(null!);

const GridStateProvider: FC<GridStateProviderProps> = props => {
	const [gridStates, setGridStates] = useState<GridHistoryEntry[]>(() => [
		{
			puzzle: props.initializer(),
			autoSolvedCell: null
		}
	]);

	const value = useMemo(
		() => ({
			current: gridStates[gridStates.length - 1],
			push: (s: GridHistoryEntry) => setGridStates([...gridStates, s]),
			undo: () => {
				if (gridStates.length > 1) {
					const newStates = [...gridStates];
					newStates.pop();
					setGridStates(newStates);
				}
			},
			undoUntilSolvable: () => {
				const newGridStates = [...gridStates];

				while (newGridStates[newGridStates.length - 1].puzzle.hasErrors()) {
					newGridStates.pop();
				}

				setGridStates(newGridStates);
			},
			redoAsPencil: () => {
				const currPuzzle = gridStates[gridStates.length - 1].puzzle;
				const prevPuzzle = gridStates[gridStates.length - 2].puzzle;
				const {x, y, n} = findRegularNumChange(currPuzzle, prevPuzzle);
				const tool: Tool = {type: 'number', pencil: true, n};
				const newPuzzle = applyTool(tool, {x, y}, prevPuzzle);
				setGridStates([
					...gridStates,
					{puzzle: newPuzzle, autoSolvedCell: null}
				]);
				return tool;
			},
			reset: () => setGridStates([...gridStates, gridStates[0]])
		}),
		[gridStates, setGridStates]
	);

	return (
		<GridStateContext.Provider value={value}>
			{props.children}
		</GridStateContext.Provider>
	);
};
export {GridStateProvider};

export function useGridState(): GridState {
	const value = useContext(GridStateContext);

	if (!value) {
		throw new Error('useGridState must be used inside a GridStateProvider.');
	}

	return value;
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
