import {mount} from 'enzyme';
import React, {createContext} from "react";
import {useCheckedContext} from "./useCheckedContext";

describe('useCheckedContext', function() {
	describe('When there is a value, even a falsy one', () => {
		it('behaves like a regular context', () => {
			const subject = mount(
				<UnderlyingContext.Provider value={0}>
					<HookUser />
				</UnderlyingContext.Provider>
			);
			expect(subject.text()).toEqual('0');
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