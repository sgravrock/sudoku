import {Context, useContext} from "react";

export function useCheckedContext<T>(context: Context<T>): T {
	const value = useContext(context);

	if (value === null || value === undefined) {
		throw new Error(`Context value was unexpectedly ${value}`);
	}

	return value;
}