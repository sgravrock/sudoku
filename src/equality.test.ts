import {shallowEq} from "./equality";

describe('equality', () => {
	describe('shallow', () => {
		it('returns true when all properties are ===', () => {
			const z = ['foo'];
			const a = {x: 1, y: 2, z};
			const b = {x: 1, y: 2, z};
			expect(shallowEq(a, b)).toEqual(true);
			expect(shallowEq(b, a)).toEqual(true);
		});

		it('returns false when any properties are !==', () => {
			const a = {x: 1, y: 2, z: ['foo']};
			const b = {x: 1, y: 2, z: ['foo']};
			expect(shallowEq(a, b)).toEqual(false);
			expect(shallowEq(b, a)).toEqual(false);
		});

		it('returns false when one side has extra properties', () => {
			const a = {x: 1, y: 2, z: undefined};
			const b = {x: 1, y: 2};
			expect(shallowEq(a, b)).toEqual(false);
			expect(shallowEq(b, a)).toEqual(false);
		})
	});
});