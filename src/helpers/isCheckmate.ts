import movementCalculation from './movementCalculation';

//assume to be checkmate until proven otherwise
export default function isCheckmate(turn: string, positionsToCheck: string[][]) {
	const positionStack = ['r', 'n', 'b', 'q', 'k', 'p'];
	let isCheckmate = true;
	for (const piece of positionStack) {
		document.querySelectorAll(`.${turn}${piece}`).forEach((pieceElement) => {
			let [row, col] = pieceElement?.id.split('-').map(Number);
			if (!movementCalculation(turn, piece, row, col, '', positionsToCheck, true)) isCheckmate = false;
		});
	}

	return isCheckmate;
}
