import {solveNakedSingle} from "./nakedSingle";
import {solveHiddenSingle} from "./hiddenSingle";
import {Puzzle} from "../Puzzle";
import {firstMatchOrNull} from "./utils";

type Strategy = (p: Puzzle) => Puzzle | null;
type Result = {
	solved: boolean;
	endState: Puzzle;
}

export enum Grade {
	Easy = 'Easy',
	Unknown = 'Unknown'
}

export const easyStrategies = [solveHiddenSingle];

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

export function grade(puzzle: Puzzle): Grade {
	if (solve(puzzle, easyStrategies).solved) {
		return Grade.Easy;
	} else {
		return Grade.Unknown;
	}
}