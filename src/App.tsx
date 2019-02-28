import React from 'react';
// @ts-ignore
import sudoku from 'sudoku';
import './App.css';
import {Grid} from "./Grid";

const App: React.FunctionComponent<{}> = props => {
	return <Grid puzzle={sudoku.makepuzzle()} />;
};

export {App};
