'use client';
import clearPreviousSelections from './clearPreviousSelections';
import handleMove from './handleMove';
import handlePieceSelection from './handlePieceSelection';
import hasPiece from './hasPiece';

export default function movementCalculation(team: string, piece: string, row: number, col: number) {
	let enemy = team === 'w' ? 'b' : 'w';
	if (piece === 'p') pawnCalculation(team, enemy, piece, row, col);
}

function pawnCalculation(team: string, enemy: string, piece: string, row: number, col: number) {
	//@to-do pawn transform at enemies last row
	let moveDistance = team === 'w' ? -1 : 1; //move up or move down the board
	let possibleMoves = [];
	let possibleKills = [];
	{
		//allow to move forward if no other piece is there
		const toTest = document.getElementById(`${row + moveDistance}-${col}`);
		if (!hasPiece(toTest)) possibleMoves.push(toTest);
	}
	{
		//allow to move two spaces forward if at start and no other piece blocks it
		const toTest = document.getElementById(`${row + moveDistance * 2}-${col}`);
		if (((team === 'w' && row === 6) || (team === 'b' && row === 1)) && !hasPiece(toTest)) possibleMoves.push(toTest);
	}
	{
		const toTest1 = document.getElementById(`${row + moveDistance}-${col + 1}`);
		const toTest2 = document.getElementById(`${row + moveDistance}-${col - 1}`);
		const pieceDiagonal1 = hasPiece(toTest1);
		const pieceDiagonal2 = hasPiece(toTest2);
		if (pieceDiagonal1 && pieceDiagonal1[0] === enemy) possibleKills.push(toTest1);
		if (pieceDiagonal2 && pieceDiagonal2[0] === enemy) possibleKills.push(toTest2);
	}
	setPossibleMoves(possibleMoves, possibleKills);
}

function setPossibleMoves(possibleMoves: (HTMLElement | null)[], possibleKills: (HTMLElement | null)[]) {
	possibleMoves?.forEach((possibleMove) => {
		possibleMove?.classList.add('possible_move');
		possibleMove?.addEventListener('click', handleMove);
	});
	possibleKills?.forEach((possibleKill) => {
		possibleKill?.classList.add('possible_kill');
		possibleKill?.removeEventListener('click', handlePieceSelection);
		possibleKill?.addEventListener('click', handleMove);
	});
}
