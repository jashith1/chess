'use client';
import clearPreviousSelections from './clearPreviousSelections';
import handleMove from './handleMove';

export default function movementCalculation(team: string, piece: string, row: number, col: number) {
	let enemy = team === 'w' ? 'b' : 'w';
	if (piece === 'p') pawnCalculation(team, enemy, piece, row, col);
}

function pawnCalculation(team: string, enemy: string, piece: string, row: number, col: number) {
	let moveDistance = team === 'w' ? -1 : 1; //move up or move down the board
	let possibleMoves = [document.getElementById(`${row + moveDistance}-${col}`)];
	possibleMoves.forEach((possibleMove) => {
		possibleMove?.classList.add('possible_move');
		possibleMove?.addEventListener('click', handleMove);
	});
	// if ((team === 'w' && row === 6) || (team === 'b' && row === 1)) document.getElementById(`${row + moveDistance * 2}-${col}`)?.classList.add('possible_move');
}
