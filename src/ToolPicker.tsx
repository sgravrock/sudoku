import React, {createContext, useContext} from 'react';
// @ts-ignore
import classNames from 'class-names';
import {shallowEq} from "./equality";

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

const ToolPicker: React.FunctionComponent<{}> = props => {
	return (
		<div className="ToolPicker">
			<NumberPicker pencil={false} />
			<NumberPicker pencil={true} />
			<ToolButton tool={{type: 'eraser'}} />
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
			<td>
				<ToolButton tool={{type: 'number', n, pencil: props.pencil}} />
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

export const ToolButton: React.FunctionComponent<{tool: Tool}> = props => {
	const [selectedTool, selectTool] = useContext(SelectedToolContext);
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
			/>
			{text()}
		</label>
	);
};

export {ToolPicker};