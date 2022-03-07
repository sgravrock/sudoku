export function findByLabelText(root: Element, labelText: string): HTMLInputElement {
	const label = Array.from(root.querySelectorAll('label'))
		.filter(x => x.textContent === labelText)[0];
	return label!.querySelector('input') as HTMLInputElement;
}

export function findButtonByText(root: Element, text: string): HTMLInputElement {
	return Array.from(root.querySelectorAll('button'))
		.filter(x => x.textContent === text)[0] as HTMLInputElement;
}