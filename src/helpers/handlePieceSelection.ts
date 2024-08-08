import { Dispatch, SetStateAction } from 'react';
import clearPreviousSelections from './clearPreviousSelections';
import isKingThreatened from './isKingThreatened';
import movementCalculation from './movementCalculation';

export default function handlePieceSelection(e: any, piece: string, check: string[][], setCheck: Dispatch<SetStateAction<string[][]>>) {
	clearPreviousSelections();
	let [row, col] = e?.id.split('-').map(Number);
	e.classList.add('bg-blue-500');
	//only allow movement of selected piece if moving it doesnt make you "check" yourself
	if (check.length > 0 && check[0].length > 0) movementCalculation(piece[0], piece[1], row, col, '', check);
	else if (!isKingThreatened(piece[0], setCheck, `${row}-${col}`)) movementCalculation(piece[0], piece[1], row, col);
}
