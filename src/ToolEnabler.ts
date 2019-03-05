import {Entry, Puzzle} from "./Puzzle";
import {Tool} from "./ToolPicker";
import {createContext} from "react";

export interface IToolEnabler {
	isEnabled(tool: Tool): boolean;
}

export class ToolEnabler implements IToolEnabler {
	private _puzzle: Puzzle;

	constructor(puzzle: Puzzle) {
		this._puzzle = puzzle;
	}

	isEnabled(tool: Tool): boolean {
		switch (tool.type) {
			case 'eraser':
				return true;

			case 'number':
				return this._numNormalEntries(tool.n) < 9;
		}
		return true;
	}

	private _numNormalEntries(n: number): number {
		return this._puzzle.entriesWith((e: Entry) => !e.pencil && e.n === n);
	}
}

export const ToolEnablerContext = createContext<ToolEnabler>(null!);