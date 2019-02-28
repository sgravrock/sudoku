import React from 'react';
// @ts-ignore
import sudoku from 'sudoku';
import './App.css';
import {Game} from "./Game";

const App: React.FunctionComponent<{}> = props => {
	return <Game puzzleData={sudoku.makepuzzle()} />;
};

export {App};
