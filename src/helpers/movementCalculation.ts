'use client';
import handleMove from './handleMove';
import handlePieceSelection from './handlePieceSelection';
import hasPiece from './hasPiece';

const pieceMovements = {
	p: pawnCalculation,
	r: rookCalculation,
	b: bishopCalculation,
	q: queenCalculation,
	n: knightCalculation,
};

export default function movementCalculation(team: string, piece: string, row: number, col: number) {
	let enemy = team === 'w' ? 'b' : 'w';
	if (!(piece === 'p' || piece === 'r' || piece === 'b' || piece === 'q' || piece === 'n')) return;
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

//for those pieces that can travel infinite distance before being blocked by another piece or board (like rook, bishop and queen)
function calculateDistance(directions: { rowDelta: number; colDelta: number }[], possibleMoves: HTMLElement[], possibleKills: HTMLElement[], row: number, col: number, enemy: string, maxMovement = 7, canJump = false) {
	directions.forEach((direction) => {
		for (let i = 1; i <= maxMovement; i++) {
			let toTest = document.getElementById(`${row + direction.rowDelta * i}-${col + direction.colDelta * i}`);
			if (!toTest && !canJump) break; //out of bounds
			else if(!toTest) continue;
			let pieceAtLoc = hasPiece(toTest);
			if (!pieceAtLoc) possibleMoves.push(toTest);
			else if (pieceAtLoc[0] === enemy) {
				possibleKills.push(toTest);
				break;
			} else break;
		}
	});
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

	calculateDistance(directions, possibleMoves, possibleKills, row, col, enemy);

	return { possibleMoves, possibleKills };
}

function bishopCalculation(team: string, enemy: string, row: number, col: number) {
	let possibleMoves: HTMLElement[] = [];
	let possibleKills: HTMLElement[] = [];
	const directions = [
		{ rowDelta: 1, colDelta: 1 },
		{ rowDelta: 1, colDelta: -1 },
		{ rowDelta: -1, colDelta: 1 },
		{ rowDelta: -1, colDelta: -1 },
	];

	calculateDistance(directions, possibleMoves, possibleKills, row, col, enemy);

	return { possibleMoves, possibleKills };
}

function queenCalculation(team: string, enemy: string, row: number, col: number) {
	let possibleMoves: HTMLElement[] = [];
	let possibleKills: HTMLElement[] = [];
	const directions = [
		{ rowDelta: 1, colDelta: 0 },
		{ rowDelta: -1, colDelta: 0 },
		{ rowDelta: 0, colDelta: 1 },
		{ rowDelta: 0, colDelta: -1 },
		{ rowDelta: 1, colDelta: 1 },
		{ rowDelta: 1, colDelta: -1 },
		{ rowDelta: -1, colDelta: 1 },
		{ rowDelta: -1, colDelta: -1 },
	];

	calculateDistance(directions, possibleMoves, possibleKills, row, col, enemy);

	return { possibleMoves, possibleKills };
}

function knightCalculation(team: string, enemy: string, row: number, col: number) {
	let possibleMoves: HTMLElement[] = [];
	let possibleKills: HTMLElement[] = [];
	const directions = [
		{ rowDelta: 2, colDelta: 1 },
		{ rowDelta: 2, colDelta: -1 },
		{ rowDelta: -2, colDelta: 1 },
		{ rowDelta: -2, colDelta: -1 },
		{ rowDelta: 1, colDelta: 2 },
		{ rowDelta: 1, colDelta: -2 },
		{ rowDelta: -1, colDelta: 2 },
		{ rowDelta: -1, colDelta: -2 },
	];

	calculateDistance(directions, possibleMoves, possibleKills, row, col, enemy, 1, true);

	return { possibleMoves, possibleKills };
}
