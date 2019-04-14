import React, {createContext} from 'react';
// @ts-ignore
import classNames from 'class-names';
import {shallowEq} from "../equality";
import {useCheckedContext} from "../useCheckedContext";
import {IToolEnabler} from "./ToolEnabler";
import {Tool} from "./index";
import './ToolPicker.css';


type SelectedToolContextValue = [Tool, (tool: Tool) => void];

export const SelectedToolContext = createContext<SelectedToolContextValue>(null!);

const ToolPicker: React.FunctionComponent<{enabler: IToolEnabler}> = props => {
	return (
		<div className="ToolPicker">
			<NumberPicker pencil={false} enabler={props.enabler} />
			<NumberPicker pencil={true} enabler={props.enabler} />
			<ToolButton tool={{type: 'eraser'}} enabler={props.enabler} />
			<div className="ToolPicker-keyboardHints">
				Keyboard controls: 1-9 to select a number, p to toggle pencil marks
			</div>
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

	const disabled = !props.enabler.isEnabled(props.tool);
	const classes = classNames('ToolButton', {'ToolButton-disabled': disabled});

	return (
		<span className={classes}>
			<span className="ToolButton-checkmark">✓</span>
			<label>
				<input
					type="radio"
					name="tool"
					checked={checked}
					onChange={() => selectTool(props.tool)}
					disabled={disabled}
				/>
				{text()}
			</label>
		</span>
	);
};

export {ToolPicker};