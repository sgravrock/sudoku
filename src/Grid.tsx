import React from "react";
import './Grid.css';
import {Puzzle} from "./Puzzle";

const nine = Object.freeze([0, 1, 2, 3, 4, 5, 6, 7, 8]);

interface GridProps {
	puzzle: Puzzle;
	onCellClick: (x: number, y: number) => void;
}

const Grid: React.FunctionComponent<GridProps> = props => {
	return (
		<table className="Grid">
			<tbody>
				{nine.map(y => (
					<GridRow
						key={y}
						y={y}
						puzzle={props.puzzle}
						onCellClick={props.onCellClick}
					/>
				))}
			</tbody>
		</table>
	);
};

interface GridRowProps {
	puzzle: Puzzle;
	y: number;
	onCellClick: (x: number, y: number) => void;
}

const GridRow: React.FunctionComponent<GridRowProps> = props => {
	return (
		<tr>
			{nine.map(x => (
				<GridCell
					key={x}
					x={x}
					y={props.y}
					puzzle={props.puzzle}
					onClick={props.onCellClick}
				/>
			))}
		</tr>
	);
};

interface GridCellProps {
	puzzle: Puzzle;
	x: number;
	y: number;
	onClick: (x: number, y: number) => void;
}

const GridCell: React.FunctionComponent<GridCellProps> = props => {
	const cell = props.puzzle.cell(props.x, props.y);
	const className = cell.mutable ? '' : 'GridCell-immutable';

	function onClick() {
		if (cell.mutable) {
			props.onClick(props.x, props.y);
		}
	}

	return (
		<td className={className} onClick={onClick}>
			{cell.value}
		</td>
	);
};

export {Grid};