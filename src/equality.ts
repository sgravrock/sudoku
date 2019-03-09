export function shallowEq(a: any, b: any): boolean {
	if (a === b) {
		return true;
	} else if (a === null || b === null || a === undefined || b === undefined) {
		return false;
	}

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