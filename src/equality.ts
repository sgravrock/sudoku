export function shallowEq(a: object, b: object): boolean {
	for (const k in a) {
		// @ts-ignore
		if (!(k in b) || a[k] !== b[k]) {
			return false;
		}
	}

	for (const k in b) {
		if (!(k in a)) {
			return false;
		}
	}

	return true;
}