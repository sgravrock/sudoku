import React from "react";
import './Grid.css';

type Puzzle = (number | null)[];

const nine = Object.freeze([0, 1, 2, 3, 4, 5, 6, 7, 8]);

const Grid: React.FunctionComponent<{puzzle: Puzzle}> = props => {
	return (
		<table className="Grid">
			<tbody>
				{nine.map(y => <GridRow key={y} y={y} puzzle={props.puzzle} />)}
			</tbody>
		</table>
	);
};

const GridRow: React.FunctionComponent<{puzzle: Puzzle, y: number}> = props => {
	return (
		<tr>
			{nine.map(x => <td key={x}>{props.puzzle[9 * props.y + x]}</td>)}
		</tr>
	);
};

export {Grid};