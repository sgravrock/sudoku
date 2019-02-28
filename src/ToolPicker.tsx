import React from 'react';
// @ts-ignore
import classNames from 'class-names';

interface Tool {
	n: number;
	pencil: boolean;
}

interface ToolPickerProps {
	selectedTool: Tool;
	selectTool: (tool: Tool) => void;
}

const ToolPicker: React.FunctionComponent<ToolPickerProps> = props => {
	return (
		<div className="ToolPicker">
			<NumberPicker
				pencil={false}
				selectedNum={props.selectedTool.pencil ? null : props.selectedTool.n}
				selectTool={props.selectTool}
			/>
			<NumberPicker
				pencil={true}
				selectedNum={props.selectedTool.pencil ? props.selectedTool.n: null}
				selectTool={props.selectTool}
			/>
		</div>
	);
};

interface NumberPickerProps {
	pencil: boolean;
	selectedNum: number | null;
	selectTool: (tool: Tool) => void;
}

const NumberPicker: React.FunctionComponent<NumberPickerProps> = props => {
	const classes = classNames(
		'NumberPicker',
		{'NumberPicker-pencil': props.pencil},
		{'NumberPicker-regular': !props.pencil},
	);

	function selectNum(n: number) {
		props.selectTool({n, pencil: props.pencil});
	}

	function cell(n: number) {
		return (
			<PickerCell
				n={n}
				selected={n === props.selectedNum}
				select={() => selectNum(n)}
			/>
		)
	}

	return (
		<div className={classes}>
			{props.pencil ? 'Pencil marks' : 'Regular'}
			<table>
				<tbody>
					<tr>
						{cell(1)}
						{cell(2)}
						{cell(3)}
					</tr>
					<tr>
						{cell(4)}
						{cell(5)}
						{cell(6)}
					</tr>
					<tr>
						{cell(7)}
						{cell(8)}
						{cell(9)}
					</tr>
				</tbody>
			</table>
		</div>
	);
};

interface PickerCellProps {
	n: number;
	selected: boolean;
	select: () => void;
}

const PickerCell: React.FunctionComponent<PickerCellProps> = props => {
	return (
		<td>
			<label>
				<input
					type="radio"
					checked={props.selected}
					onChange={props.select}
				/>
				{props.n}
			</label>
		</td>
	);
};

export {ToolPicker};