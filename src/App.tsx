import React, {useState} from 'react';
// @ts-ignore
import sudoku from 'sudoku';
import './App.css';
import {Game} from "./Game";

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
			return puzzleWithRating(null, 1);
		case Difficulty.Medium:
			return puzzleWithRating(1, 2);
		case Difficulty.Hard:
			return puzzleWithRating(2, 3);
		case Difficulty.Any:
			return puzzleWithRating(null, null);
	}
}

function puzzleWithRating(min: number | null, max: number | null): RawPuzzleData {
	for (let i = 0; i < 1000; i++) {
		const puzzle = sudoku.makepuzzle();
		const rating = sudoku.ratepuzzle(puzzle, 4);

		if ((min === null || rating >= min) && (max === null || rating < max)) {
			console.log("Returning puzzle with rating", rating);
			console.log("puzzle:", puzzle);
			return puzzle;
		}
	}

	throw new Error("Could not make a puzzle with the requsted difficulty");
}

export {App};
