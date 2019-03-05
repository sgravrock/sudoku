import React from 'react';
import {Tool, SelectedToolContext, ToolButton} from "./ToolPicker";
import * as RTL from 'react-testing-library'
import {ToolEnabler} from "./ToolEnabler";
import {Puzzle} from "./Puzzle";

describe('ToolPicker', () => {
	describe('ToolButton', () => {
		describe('When the tool is the selected tool', () => {
			it('checks the radio button', () => {
				const selectedTool: Tool = {type: 'number', n: 1, pencil: true};
				const tool: Tool = {type: 'number', n: 1, pencil: true};
				const {container} = renderToolButton({tool, selectedTool});

				expect(container.querySelector('input')!!.checked).toEqual(true);
			});
		});

		describe('When a different tool is selected', () => {
			it('does not check the radio button', () => {
				const selectedTool: Tool = {type: 'number', n: 1, pencil: true};
				const tool: Tool = {type: 'number', n: 2, pencil: true};
				const {container} = renderToolButton({tool, selectedTool});

				expect(container.querySelector('input')!!.checked).toEqual(false);
			});
		});
	});
});

interface Props {
	selectedTool: Tool;
	tool: Tool;
}

function renderToolButton(props: Props) {
	const enabler = new ToolEnabler(Puzzle.fromRawCells([]));

	return RTL.render(
		<SelectedToolContext.Provider value={[props.selectedTool, () => {}]}>
			<ToolButton tool={props.tool} enabler={enabler} />
		</SelectedToolContext.Provider>
	);
}