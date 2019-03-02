import * as RTL from 'react-testing-library'
import React, {createContext, useContext} from "react";
import {useCheckedContext} from "./useCheckedContext";

describe('useCheckedContext', function() {
	describe('When there is a value, even a falsy one', () => {
		it('behaves like a regular context', () => {
			const {container} = RTL.render(
				<UnderlyingContext.Provider value={0}>
					<HookUser />
				</UnderlyingContext.Provider>
			);
			expect(container.textContent).toEqual('0');
		});
	});

	// Error paths aren't tested because there's no obvious way to prevent React
	// from logging the exception thrown, even if we use an error boundary.
});

const UnderlyingContext = createContext<number>(null!);

const HookUser = (props: {}) => {
	const someValue = useCheckedContext(UnderlyingContext);
	return <div>{someValue}</div>;
};