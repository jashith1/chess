import { Dispatch, SetStateAction } from 'react';
import movementCalculation from './movementCalculation';

//would king be threatened if you move piece at "pieceToIgnore"
export default function isKingThreatened(turn: string, setCheck: Dispatch<SetStateAction<string[][]>>, pieceToIgnore?: string) {
	//check if new player's king has been threatened by going through all enemy pieces
	const positionStack = ['r', 'n', 'b', 'q', 'k', 'p'];
	const enemy = turn === 'w' ? 'b' : 'w';

	//at start of every turn reset check path
	let checkTemp: string[][] = [];
	positionStack.forEach((piece) => {
		document.querySelectorAll(`.${enemy}${piece}`).forEach((pieceElement) => {
			let [row, col] = pieceElement?.id.split('-').map(Number);
			const isCheck = movementCalculation(enemy, piece, row, col, pieceToIgnore, [], checkTemp);
			if (isCheck) checkTemp = isCheck;
		});
	});
	//if pieceToIgnore is defined, only checking to see if move is valid. So no need to actually set check since move hasnt take place.
	if (!pieceToIgnore) {
		setCheck(checkTemp);
		console.log(checkTemp);
	}
	if (checkTemp.length > 0 && checkTemp[0].length > 0) return true;
	return false;
}
