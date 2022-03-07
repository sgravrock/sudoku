import React, {useState} from 'react';
import * as sudoku from './oneValuedSudoku';
import './App.css';
import {Game} from "./Game";
import {Puzzle} from "./Puzzle";
import * as humanStyleSolver from "./humanStyleSolver";

enum Difficulty {
	Easy = 'Easy',
	Medium = 'Medium',
	Hard = 'Hard',
	Any = 'Unlimited',
	Blank = 'Blank'
}

const allDifficulties = [
	Difficulty.Easy,
	Difficulty.Medium,
	Difficulty.Hard,
	Difficulty.Any,
	Difficulty.Blank
];

type RawPuzzleData = (number|null)[];

const App: React.FunctionComponent<{}> = props => {
	const [puzzle, setPuzzle] = useState<RawPuzzleData | null>(null);

	if (puzzle) {
		return <Game puzzle={Puzzle.fromRawCells(puzzle)} solver={humanStyleSolver} />;
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
			return puzzleWithRating(1, 1.25);
		case Difficulty.Hard:
			return puzzleWithRating(1.25, 2);
		case Difficulty.Any:
			return puzzleWithRating(null, null);
		case Difficulty.Blank:
			return blankPuzzle();
	}
}

function easyPuzzle(): RawPuzzleData {
	return puzzlePassingTest(isEasy);
}

function isEasy(rawCells: RawPuzzleData) {
	const puzzle = Puzzle.fromRawCells(rawCells);
	return humanStyleSolver.solve(puzzle, humanStyleSolver.easyStrategies).solved;

}

function puzzleWithRating(min: number | null, max: number | null): RawPuzzleData {
	return puzzlePassingTest(rawCells => {
		const rating = sudoku.ratepuzzle(rawCells, 4);

		if (!((min === null || rating >= min) && (max === null || rating < max))) {
			return false;
		}

		// Do this after checking the rating because it's much slower
		if (isEasy(rawCells)) {
			return false;
		}

		return true;
	});
}

function puzzlePassingTest(test: (rawCells: RawPuzzleData) => boolean): RawPuzzleData {
	for (let i = 0; i < 1000; i++) {
		const cells = sudoku.makepuzzle();

		if (test(cells)) {
			return cells;
		}
	}

	throw new Error("Could not make a puzzle with the requested difficulty");
}

function blankPuzzle(): RawPuzzleData {
	const result = [];

	for (let i = 0; i < 81; i++) {
		result.push(null);
	}

	return result;
}

export {App};
