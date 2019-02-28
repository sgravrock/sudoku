import React, {useState} from "react";
import {Grid} from "./Grid";
import {ToolPicker} from "./ToolPicker";

interface Props {
	puzzle: (number | null)[];
}

const Game: React.FunctionComponent<Props> = props => {
	const [tool, selectTool] = useState({n: 1, pencil: false});

	return (
		<>
			<Grid puzzle={props.puzzle} />
			<ToolPicker selectedTool={tool} selectTool={selectTool} />
		</>
	);
};

export {Game};