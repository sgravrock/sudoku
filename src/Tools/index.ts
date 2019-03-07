interface NumberTool {
	type: 'number';
	n: number;
	pencil: boolean;
}

interface EraserTool {
	type: 'eraser';
}

export type Tool = NumberTool | EraserTool;