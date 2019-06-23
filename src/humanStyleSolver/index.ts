import {solveNakedSingle} from "./nakedSingle";
import {solveHiddenSingle} from "./hiddenSingle";
import {Coord, Puzzle} from "../Puzzle";
import {firstMatchOrNull} from "./utils";

export type Strategy = (p: Puzzle) => SingleMoveResult | null;

export type SingleMoveResult = {
	puzzle: Puzzle;
	strategy: string;
	changedCell: Coord;
}

type Result = {
	solved: boolean;
	endState: Puzzle;
}

export enum Grade {
	Easy = 'Easy',
	Unknown = 'Unknown'
}

export const easyStrategies: Strategy[] = [solveHiddenSingle];
export const allStrategies: Strategy[] = [...easyStrategies, solveNakedSingle];

export function solve(puzzle: Puzzle, strategies: Strategy[]): Result {
	let lastState = puzzle;

	while (true) {
		// eslint-disable-next-line no-loop-func
		const nextState = firstMatchOrNull(strategies, s => s(lastState));

		if (!nextState) {
			return {solved: false, endState: lastState};
		} else if (nextState.puzzle.isSolved()) {
			return {solved: true, endState: nextState.puzzle};
		} else {
			lastState = nextState.puzzle;
		}
	}
}

export function solveOneCell(
	puzzle: Puzzle,
	strategies: Strategy[] = allStrategies
): SingleMoveResult | null {
	return firstMatchOrNull(strategies, s => s(puzzle));
}

export function grade(puzzle: Puzzle): Grade {
	if (solve(puzzle, easyStrategies).solved) {
		return Grade.Easy;
	} else {
		return Grade.Unknown;
	}
}