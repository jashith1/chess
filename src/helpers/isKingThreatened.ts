import { Dispatch, SetStateAction } from 'react';
import movementCalculation from './movementCalculation';
import isCheckmate from './isCheckmate';

//would king be threatened if you move piece at "pieceToIgnore"
export default function isKingThreatened(turn: string, pieceToIgnore?: string, kingLocOverride?: string, setCheck?: Dispatch<SetStateAction<string[][]>>, setCheckmate?: Dispatch<SetStateAction<boolean>>) {
	//check if new player's king has been threatened by going through all enemy pieces
	const positionStack = ['r', 'n', 'b', 'q', 'k', 'p'];
	const enemy = turn === 'w' ? 'b' : 'w';
	const kingLoc = kingLocOverride || document.querySelector(`.${turn}k`)?.id;

	//at start of every turn reset check path
	let checkTemp: string[][] = [];
	positionStack.forEach((piece) => {
		document.querySelectorAll(`.${enemy}${piece}`).forEach((pieceElement) => {
			let [row, col] = pieceElement?.id.split('-').map(Number);
			const isCheck = movementCalculation(enemy, piece, row, col, pieceToIgnore, [], false, checkTemp, kingLoc);
			if (isCheck && typeof isCheck === 'object') checkTemp = isCheck;
		});
	});

	if (setCheck) setCheck(checkTemp);
	if (setCheckmate && checkTemp.length > 0) setCheckmate(isCheckmate(turn, checkTemp) || false);

	if (checkTemp.length > 0 && checkTemp[0].length > 0) return true;
	return false;
}
