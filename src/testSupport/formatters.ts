import {Cell} from "../Puzzle";

beforeEach(() => {
	jasmine.addCustomObjectFormatter((val: any) => {
		if (isCell(val)) {
			if (!val.mutable) {
				// TODO: fix types so the cast isn't needed
				return 'cell(fixed: ' + (val.entry as any).n + ')';
			} else if (!val.entry) {
				return 'cell(empty)';
			} else if (val.entry.pencil) {
				return 'cell(pencil: ' + val.entry.ns + ')';
			} else {
				return 'cell(' + val.entry.n + ')';
			}
		}
	});
});

function isCell(val: any): val is Cell {
	return val.hasOwnProperty('entry') && val.hasOwnProperty('mutable');
}
