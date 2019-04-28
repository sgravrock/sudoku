import {ReactWrapper} from "enzyme";

export function findByLabelText(root: ReactWrapper, labelText: string): ReactWrapper {
	const label = root.findWhere(x => x.length === 1 && x.is('label') && x.text() === labelText);
	return label.find('input');
}

export function findButtonByText(root: ReactWrapper, text: string): ReactWrapper {
	return root.findWhere(x => x.length === 1 && x.is('button') && x.text() === text);
}