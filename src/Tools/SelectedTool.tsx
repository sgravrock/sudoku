import React from 'react';
import {Tool} from "./index";
import {createContext, useContext, useState} from "react";

type SelectedToolContextValue = [Tool, (tool: Tool) => void];

const SelectedToolContext = createContext<SelectedToolContextValue>(null!);

interface ProviderProps {
	initialTool: Tool;
}

export const SelectedToolProvider: React.FC<ProviderProps> = props => {
	const [tool, selectTool] = useState(props.initialTool);

	return (
		<SelectedToolContext.Provider value={[tool, selectTool]}>
			{props.children}
		</SelectedToolContext.Provider>
	)
};

export function useSelectedTool(): SelectedToolContextValue {
	const value = useContext(SelectedToolContext);

	if (!value) {
		throw new Error('useSelectedTool must be used inside a SelectedToolProvider');
	}

	return value;
}