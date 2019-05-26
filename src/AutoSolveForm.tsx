import React, {useState} from 'react';
import {allStrategies, easyStrategies, Strategy} from "./humanStyleSolver";
import './AutoSolveForm.css';

interface Props {
	solve: (strategies: Strategy[]) => void;
	solveOneCell: () => void;
}

enum Button {
	Easy = 'easy',
	All = 'all',
	OneCell = 'a single cell'
}

const AutoSolveForm: React.FC<Props> = props => {
	const [selectedButton, setSelectedButton] = useState<Button>();

	function selectedStrategy(): Strategy[] {
		switch (selectedButton) {
			case Button.Easy:
				return easyStrategies;
			case Button.All:
				return allStrategies;
			default:
				throw new Error(`Unknown button: ${selectedButton}`);
		}
	}


	function solveClicked() {
		if (selectedButton === Button.OneCell) {
			props.solveOneCell();
		} else {
			props.solve(selectedStrategy());
		}
	}

	return (
		<div className="AutoSolveForm">
			<fieldset>
				<legend>Auto solve</legend>
				<label>
					<input
						type="radio"
						name="strategies"
						value={Button.Easy}
						onChange={e => setSelectedButton(Button.Easy)}
					/>
					Easy strategies
				</label>
				<label>
					<input
						type="radio"
						name="strategies"
						value={Button.All}
						onChange={e => setSelectedButton(Button.All)}
					/>
					All strategies
				</label>
				<label>
					<input
						type="radio"
						name="strategies"
						value={Button.OneCell}
						onChange={e => setSelectedButton(Button.OneCell)}
					/>
					Solve a single cell
				</label>
				<button
					className="AutoSolveForm-solveButton"
					disabled={!selectedButton}
					onClick={solveClicked}
				>
					Solve
				</button>
			</fieldset>
		</div>
	);
};

export {AutoSolveForm};