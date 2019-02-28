import React, {createContext, useContext} from 'react';
// @ts-ignore
import classNames from 'class-names';

interface Tool {
	n: number;
	pencil: boolean;
}

type SelectedToolContextValue = [Tool, (tool: Tool) => void];

export const SelectedToolContext = createContext<SelectedToolContextValue>(null!);

const ToolPicker: React.FunctionComponent<{}> = props => {
	return (
		<div className="ToolPicker">
			<NumberPicker pencil={false} />
			<NumberPicker pencil={true} />
		</div>
	);
};

const NumberPicker: React.FunctionComponent<{pencil: boolean}> = props => {
	const classes = classNames(
		'NumberPicker',
		{'NumberPicker-pencil': props.pencil},
		{'NumberPicker-regular': !props.pencil},
	);

	function cell(n: number) {
		return (
			<PickerCell tool={{n, pencil: props.pencil}} />
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

const PickerCell: React.FunctionComponent<{tool: Tool}> = props => {
	const [selectedTool, selectTool] = useContext(SelectedToolContext);
	const checked = props.tool.n === selectedTool.n &&
		props.tool.pencil === selectedTool.pencil;

	return (
		<td>
			<label>
				<input
					type="radio"
					checked={checked}
					onChange={() => selectTool(props.tool)}
				/>
				{props.tool.n}
			</label>
		</td>
	);
};

export {ToolPicker};