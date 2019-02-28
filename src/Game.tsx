import React, {useState} from "react";
import {Grid} from "./Grid";
import {SelectedToolContext, ToolPicker} from "./ToolPicker";

interface Props {
	puzzle: (number | null)[];
}

const Game: React.FunctionComponent<Props> = props => {
	const [tool, selectTool] = useState({n: 1, pencil: false});

	return (
		<SelectedToolContext.Provider value={[tool, selectTool]}>
			<Grid puzzle={props.puzzle} />
			<ToolPicker />
		</SelectedToolContext.Provider>
	);
};

export {Game};