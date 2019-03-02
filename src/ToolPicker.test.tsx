import React from 'react';
import {Tool, SelectedToolContext, ToolButton} from "./ToolPicker";
import * as RTL from 'react-testing-library'

describe('ToolPicker', () => {
	describe('ToolButton', () => {
		describe('When the tool is the selected tool', () => {
			it('checks the radio button', () => {
				const selectedTool: Tool = {type: 'number', n: 1, pencil: true};
				const tool: Tool = {type: 'number', n: 1, pencil: true};
				const {container} = RTL.render(
					<SelectedToolContext.Provider value={[selectedTool, () => {}]}>
						<ToolButton tool={tool} />
					</SelectedToolContext.Provider>
				);

				expect(container.querySelector('input')!!.checked).toEqual(true);
			});
		});

		describe('When a different tool is selected', () => {
			it('does not check the radio button', () => {
				const selectedTool: Tool = {type: 'number', n: 1, pencil: true};
				const tool: Tool = {type: 'number', n: 2, pencil: true};
				const {container} = RTL.render(
					<SelectedToolContext.Provider value={[selectedTool, () => {}]}>
						<ToolButton tool={tool} />
					</SelectedToolContext.Provider>
				);

				expect(container.querySelector('input')!!.checked).toEqual(false);
			});
		});
	});
});