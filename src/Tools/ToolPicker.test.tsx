import React from 'react';
import {IToolEnabler, ToolEnabler} from "./ToolEnabler";
import {Puzzle} from "../Puzzle";
import {Tool} from "./index";
import {SelectedToolProvider} from "./SelectedTool";
import {ToolButton} from "./ToolPicker";
import {render} from "@testing-library/react";

describe('ToolPicker', () => {
	describe('ToolButton', () => {
		describe('When the tool is the selected tool', () => {
			it('checks the radio button', () => {
				const selectedTool: Tool = {type: 'number', n: 1, pencil: true};
				const tool: Tool = {type: 'number', n: 1, pencil: true};
				const {baseElement} = renderToolButton({tool, selectedTool});

				expect(baseElement.querySelector('input')!.checked).toBeTruthy();
			});
		});

		describe('When a different tool is selected', () => {
			it('does not check the radio button', () => {
				const selectedTool: Tool = {type: 'number', n: 1, pencil: true};
				const tool: Tool = {type: 'number', n: 2, pencil: true};
				const {baseElement} = renderToolButton({tool, selectedTool});

				expect(baseElement.querySelector('input')!.checked).toBeFalsy();
			});
		});

		describe('When the tool is disabled', () => {
			it('disables the radio button', () => {
				const tool: Tool = {type: 'number', n: 2, pencil: true};
				const enabler: IToolEnabler = {
					isEnabled: t => t !== tool
				};
				const {baseElement} = renderToolButton({tool, enabler, selectedTool: tool});

				expect(baseElement.querySelector('input')!.disabled).toBeTruthy();
			});

			it('replaces the button with a checkmark', () => {
				const tool: Tool = {type: 'number', n: 2, pencil: true};
				const enabler: IToolEnabler = {
					isEnabled: t => t !== tool
				};
				const {baseElement} = renderToolButton({tool, enabler, selectedTool: tool});

				expect(baseElement.querySelector('.ToolButton')).toHaveClass('ToolButton-disabled');
			});
		});
	});
});

interface Props {
	selectedTool: Tool;
	tool: Tool;
	enabler?: IToolEnabler;
}

function renderToolButton(props: Props) {
	const enabler = props.enabler || new ToolEnabler(Puzzle.fromRawCells([]));

	return render(
		<SelectedToolProvider initialTool={props.selectedTool}>
			<ToolButton tool={props.tool} enabler={enabler} />
		</SelectedToolProvider>
	);
}