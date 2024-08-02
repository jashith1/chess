import { Dispatch, SetStateAction } from 'react';
import movementCalculation from './movementCalculation';

export default function isKingThreatened(team: string, setCheck: Dispatch<SetStateAction<string>>) {
	//check if new player's king has been threatened by going through all enemy pieces
	const positionStack = ['r', 'n', 'b', 'q', 'k', 'p'];
	const enemy = team === 'w' ? 'b' : 'w';
	positionStack.forEach((piece) => {
		document.querySelectorAll(`.${enemy}${piece}`).forEach((pieceElement) => {
			let [row, col] = pieceElement?.id.split('-').map(Number);
			movementCalculation(enemy, piece, row, col, setCheck);
		});
	});
}
