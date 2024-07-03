'use client';
import clearPreviousSelections from './clearPreviousSelections';
import handleMove from './handleMove';
import handlePieceSelection from './handlePieceSelection';
import hasPiece from './hasPiece';

const pieceMovements = {
	p: pawnCalculation,
	r: rookCalculation,
};

export default function movementCalculation(team: string, piece: string, row: number, col: number) {
	let enemy = team === 'w' ? 'b' : 'w';
	if (!(piece === 'p' || piece === 'r')) return;
	const calculationNeeded = pieceMovements[piece];
	if (calculationNeeded) {
		const { possibleMoves, possibleKills } = calculationNeeded(team, enemy, row, col);
		setPossibleMoves(possibleMoves, possibleKills);
	}
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

function addMoveIfValid(moves: HTMLElement[], row: number, col: number) {
	const position = document.getElementById(`${row}-${col}`);
	if (!position) return;
	if (!hasPiece(position)) moves.push(position);
}

function pawnCalculation(team: string, enemy: string, row: number, col: number) {
	//@to-do pawn transform at enemies last row
	const moveDirection = team === 'w' ? -1 : 1; //up/down based on white/black
	const startRow = team === 'w' ? 6 : 1;
	let possibleMoves: HTMLElement[] = [];
	let possibleKills: HTMLElement[] = [];

	addMoveIfValid(possibleMoves, row + moveDirection, col); //basic 1 block movement

	//allow to move two spaces forward if at start and no other piece blocks it
	if (row === startRow) addMoveIfValid(possibleMoves, row + moveDirection * 2, col);

	//diagonal kill
	[1, -1].forEach((direction) => {
		//direction here is left/right
		const location = document.getElementById(`${row + moveDirection}-${col + direction}`);
		if (!location) return;
		let pieceAtLoc = hasPiece(location);
		console.log(pieceAtLoc);
		if (pieceAtLoc && pieceAtLoc[0] === enemy) possibleKills.push(location);
	});

	return { possibleMoves, possibleKills };
}

function rookCalculation(team: string, enemy: string, row: number, col: number) {
	let possibleMoves: HTMLElement[] = [];
	let possibleKills: HTMLElement[] = [];
	const directions = [
		{ rowDelta: 1, colDelta: 0 },
		{ rowDelta: -1, colDelta: 0 },
		{ rowDelta: 0, colDelta: 1 },
		{ rowDelta: 0, colDelta: -1 },
	];

	directions.forEach((direction) => {
		for (let i = 1; i < 8; i++) {
			let toTest = document.getElementById(`${row + direction.rowDelta * i}-${col + direction.colDelta * i}`);
			if (!toTest) break; //out of bounds
			let pieceAtLoc = hasPiece(toTest);
			if (!pieceAtLoc) possibleMoves.push(toTest);
			else if (pieceAtLoc[0] === enemy) {
				possibleKills.push(toTest);
				break;
			} else break;
		}
	});

	return { possibleMoves, possibleKills };
}
