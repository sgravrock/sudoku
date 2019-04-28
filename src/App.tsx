import React, {useState} from 'react';
// @ts-ignore
import sudoku from 'sudoku';
import './App.css';
import {Game} from "./Game";
import {Puzzle} from "./Puzzle";
import {easyStrategies, solve} from "./humanStyleSolver";

enum Difficulty {
	Easy = 'Easy',
	Medium = 'Medium',
	Hard = 'Hard',
	Any = 'Unlimited'
}

const allDifficulties = [
	Difficulty.Easy,
	Difficulty.Medium,
	Difficulty.Hard,
	Difficulty.Any
];

type RawPuzzleData = (number|null)[];

const App: React.FunctionComponent<{}> = props => {
	const [puzzle, setPuzzle] = useState<RawPuzzleData | null>(null);

	if (puzzle) {
		return <Game puzzleData={puzzle} />;
	}

	return <DifficultyPicker onChoice={d => setPuzzle(puzzleWithDifficulty(d))} />;
};

const DifficultyPicker: React.FC<{onChoice: (d: Difficulty) => void}> = props => {
	const buttons = allDifficulties.map(d => (
		<button key={d} onClick={() => props.onChoice(d)}>
			{d}
		</button>
	));

	return <>{buttons}</>;
};

function puzzleWithDifficulty(difficulty: Difficulty): RawPuzzleData {
	switch (difficulty) {
		case Difficulty.Easy:
			return easyPuzzle();
		case Difficulty.Medium:
			return puzzleWithRating(null, 1);
		case Difficulty.Hard:
			return puzzleWithRating(1, 2);
		case Difficulty.Any:
			return puzzleWithRating(null, null);
	}
}

function easyPuzzle(): RawPuzzleData {
	for (let i = 0; i < 1000; i++) {
		const rawCells = sudoku.makepuzzle();
		const puzzle = Puzzle.fromRawCells(rawCells);

		if (solve(puzzle, easyStrategies).solved) {
			return rawCells;
		}
	}

	throw new Error("Could not make a puzzle with the requested difficulty");

}

function puzzleWithRating(min: number | null, max: number | null): RawPuzzleData {
	for (let i = 0; i < 1000; i++) {
		const puzzle = sudoku.makepuzzle();
		const rating = sudoku.ratepuzzle(puzzle, 4);

		if ((min === null || rating >= min) && (max === null || rating < max)) {
			return puzzle;
		}
	}

	throw new Error("Could not make a puzzle with the requested difficulty");
}

export {App};
