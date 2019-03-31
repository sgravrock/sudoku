import React from 'react';
import {mount} from 'enzyme';
import {SelectedToolContext, ToolButton} from "./ToolPicker";
import {ToolEnabler} from "./ToolEnabler";
import {Puzzle} from "../Puzzle";
import {Tool} from "./index";

describe('ToolPicker', () => {
	describe('ToolButton', () => {
		describe('When the tool is the selected tool', () => {
			it('checks the radio button', () => {
				const selectedTool: Tool = {type: 'number', n: 1, pencil: true};
				const tool: Tool = {type: 'number', n: 1, pencil: true};
				const subject = renderToolButton({tool, selectedTool});

				expect(subject.find('input')).toHaveProp('checked', true);
			});
		});

		describe('When a different tool is selected', () => {
			it('does not check the radio button', () => {
				const selectedTool: Tool = {type: 'number', n: 1, pencil: true};
				const tool: Tool = {type: 'number', n: 2, pencil: true};
				const subject = renderToolButton({tool, selectedTool});

				expect(subject.find('input')).toHaveProp('checked', false);
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

	return mount(
		<SelectedToolContext.Provider value={[props.selectedTool, () => {}]}>
			<ToolButton tool={props.tool} enabler={enabler} />
		</SelectedToolContext.Provider>
	);
}