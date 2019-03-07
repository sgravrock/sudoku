import React from "react";
// @ts-ignore
import classNames from 'class-names';
import './Grid.css';
import {Entry, Puzzle} from "./Puzzle";
import {SelectedToolContext} from "./Tools/ToolPicker";
import {useCheckedContext} from "./useCheckedContext";

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
	const [selectedTool] = useCheckedContext(SelectedToolContext);
	const cell = props.puzzle.cell(props.x, props.y);

	const isCurrentNormal = selectedTool.type === 'number' &&
		cell.entry && !cell.entry.pencil &&
		cell.entry.n === selectedTool.n;
	const isCurrentPencil = selectedTool.type === 'number' &&
		cell.entry && cell.entry.pencil &&
		cell.entry.ns.includes(selectedTool.n);
	const className = classNames({
		'GridCell-immutable': !cell.mutable,
		'GridCell-current': isCurrentNormal,
		'GridCell-current-pencil': isCurrentPencil
	});

	const text = (function() {
		if (!cell.entry) {
			return '';
		} else if (cell.entry.pencil) {
			return `(${cell.entry.ns.join(',')})`;
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

function entryHasNumber(entry: Entry, n: number) {
	if (entry.pencil) {
		return entry.ns.includes(n);
	} else {
		return entry.n === n;
	}
}

export {Grid};