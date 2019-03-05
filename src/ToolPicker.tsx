import React, {createContext} from 'react';
// @ts-ignore
import classNames from 'class-names';
import {shallowEq} from "./equality";
import {useCheckedContext} from "./useCheckedContext";
import {Puzzle} from "./Puzzle";
import {IToolEnabler, ToolEnabler} from "./ToolEnabler";

interface NumberTool {
	type: 'number';
	n: number;
	pencil: boolean;
}

interface EraserTool {
	type: 'eraser';
}

export type Tool = NumberTool | EraserTool;

type SelectedToolContextValue = [Tool, (tool: Tool) => void];

export const SelectedToolContext = createContext<SelectedToolContextValue>(null!);

const ToolPicker: React.FunctionComponent<{enabler: IToolEnabler}> = props => {
	return (
		<div className="ToolPicker">
			<NumberPicker pencil={false} enabler={props.enabler} />
			<NumberPicker pencil={true} enabler={props.enabler} />
			<ToolButton tool={{type: 'eraser'}} enabler={props.enabler} />
		</div>
	);
};

interface NumberPickerProps {
	pencil: boolean;
	enabler: IToolEnabler;
}

const NumberPicker: React.FunctionComponent<NumberPickerProps> = props => {
	const classes = classNames(
		'NumberPicker',
		{'NumberPicker-pencil': props.pencil},
		{'NumberPicker-regular': !props.pencil},
	);

	function cell(n: number) {
		return (
			<td>
				<ToolButton
					tool={{type: 'number', n, pencil: props.pencil}}
					enabler={props.enabler}
				/>
			</td>
		);
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

interface ToolButtonProps {
	tool: Tool;
	enabler: IToolEnabler;
}

export const ToolButton: React.FunctionComponent<ToolButtonProps> = props => {
	const [selectedTool, selectTool] = useCheckedContext(SelectedToolContext);
	const checked = shallowEq(props.tool, selectedTool);
	function text() {
		switch (props.tool.type) {
			case 'number':
				return props.tool.n;
			case 'eraser':
				return 'Erase';
		}
	}

	return (
		<label>
			<input
				type="radio"
				checked={checked}
				onChange={() => selectTool(props.tool)}
				disabled={!props.enabler.isEnabled(props.tool)}
			/>
			{text()}
		</label>
	);
};

export {ToolPicker};