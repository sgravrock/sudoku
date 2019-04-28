import {solveNakedSingle} from "./nakedSingle";
import {solveHiddenSingle} from "./hiddenSingle";
import {Puzzle} from "../Puzzle";
import {firstMatchOrNull} from "./utils";

type Strategy = (p: Puzzle) => Puzzle | null;
type Result = {
	solved: boolean;
	endState: Puzzle;
}

export const easyStrategies = [solveNakedSingle, solveHiddenSingle];

export function solve(puzzle: Puzzle, strategies: Strategy[]): Result {
	let lastState = puzzle;

	while (true) {
		const nextState = firstMatchOrNull(strategies, s => s(lastState));

		if (!nextState) {
			return {solved: false, endState: lastState};
		} else if (nextState.isSolved()) {
			return {solved: true, endState: nextState};
		} else {
			lastState = nextState;
		}
	}
}