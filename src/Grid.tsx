import React from "react";
// @ts-ignore
import classNames from 'class-names';
import './Grid.css';
import {Coord, Puzzle} from "./Puzzle";
import {useSelectedTool} from "./Tools/SelectedTool";

const nine = Object.freeze([0, 1, 2, 3, 4, 5, 6, 7, 8]);

interface GridProps {
	puzzle: Puzzle;
	autoSolvedCell: Coord | null;
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
						autoSolvedCell={props.autoSolvedCell}
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
	autoSolvedCell: Coord | null;
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
					autoSolvedCell={props.autoSolvedCell}
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
	autoSolvedCell: Coord | null;
	onClick: (x: number, y: number) => void;
}

const GridCell: React.FunctionComponent<GridCellProps> = props => {
	const [selectedTool] = useSelectedTool();
	const cell = props.puzzle.cell({x: props.x, y: props.y});

	const isCurrentNormal = selectedTool.type === 'number' &&
		cell.entry && !cell.entry.pencil &&
		cell.entry.n === selectedTool.n;
	const isCurrentPencil = selectedTool.type === 'number' &&
		cell.entry && cell.entry.pencil &&
		cell.entry.ns.includes(selectedTool.n);
	const isAutoSolved = props.autoSolvedCell &&
		props.autoSolvedCell.x === props.x &&
		props.autoSolvedCell.y === props.y;
	const className = classNames({
		'GridCell-immutable': !cell.mutable,
		'GridCell-current': isCurrentNormal,
		'GridCell-current-pencil': isCurrentPencil,
		'GridCell-autoSolved': isAutoSolved,
	});

	const text = (function() {
		if (!cell.entry) {
			return '';
		} else if (cell.entry.pencil) {
			return `(${cell.entry.ns.join(',\u200b')})`;
		} else {
			return cell.entry.n;
		}
	}());

	function onClick() {
		if (cell.mutable) {
			props.onClick(props.x, props.y);
		}
	}

	return (
		<td className={className} onClick={onClick}>
			{text}
		</td>
	);
};

export {Grid};