'use client';
import handleMove from './handleMove';
import handlePieceSelection from './handlePieceSelection';
import hasPiece from './hasPiece';

//moveset of each piece
const pieceMovements = {
	r: {
		directions: [
			{ rowDelta: 1, colDelta: 0 },
			{ rowDelta: -1, colDelta: 0 },
			{ rowDelta: 0, colDelta: 1 },
			{ rowDelta: 0, colDelta: -1 },
		],
		maxMovement: 7,
	},
	b: {
		directions: [
			{ rowDelta: 1, colDelta: 1 },
			{ rowDelta: 1, colDelta: -1 },
			{ rowDelta: -1, colDelta: 1 },
			{ rowDelta: -1, colDelta: -1 },
		],
		maxMovement: 7,
	},
	q: {
		directions: [
			{ rowDelta: 1, colDelta: 0 },
			{ rowDelta: -1, colDelta: 0 },
			{ rowDelta: 0, colDelta: 1 },
			{ rowDelta: 0, colDelta: -1 },
			{ rowDelta: 1, colDelta: 1 },
			{ rowDelta: 1, colDelta: -1 },
			{ rowDelta: -1, colDelta: 1 },
			{ rowDelta: -1, colDelta: -1 },
		],
		maxMovement: 7,
	},
	n: {
		directions: [
			{ rowDelta: 2, colDelta: 1 },
			{ rowDelta: 2, colDelta: -1 },
			{ rowDelta: -2, colDelta: 1 },
			{ rowDelta: -2, colDelta: -1 },
			{ rowDelta: 1, colDelta: 2 },
			{ rowDelta: 1, colDelta: -2 },
			{ rowDelta: -1, colDelta: 2 },
			{ rowDelta: -1, colDelta: -2 },
		],
		maxMovement: 1,
	},
	k: {
		directions: [
			{ rowDelta: 1, colDelta: 0 },
			{ rowDelta: -1, colDelta: 0 },
			{ rowDelta: 0, colDelta: 1 },
			{ rowDelta: 0, colDelta: -1 },
			{ rowDelta: 1, colDelta: 1 },
			{ rowDelta: 1, colDelta: -1 },
			{ rowDelta: -1, colDelta: 1 },
			{ rowDelta: -1, colDelta: -1 },
		],
		maxMovement: 1,
	},
};

export default function movementCalculation(team: string, piece: string, row: number, col: number) {
	const enemy = team === 'w' ? 'b' : 'w'; //black/white
	const { possibleMoves, possibleKills } = calculateMovement(piece, row, col, team, enemy);
	setPossibleMoves(possibleMoves, possibleKills);
}

function setPossibleMoves(possibleMoves: (HTMLElement | null)[], possibleKills: (HTMLElement | null)[]) {
	possibleMoves?.forEach((possibleMove) => {
		possibleMove?.classList.add('possible_move');
		possibleMove?.addEventListener('click', handleMove);
	});
	possibleKills?.forEach((possibleKill) => {
		possibleKill?.classList.add('possible_kill');
		possibleKill?.removeEventListener('click', handlePieceSelection); //should not consider kill move to be selecting the other pawn
		possibleKill?.addEventListener('click', handleMove);
	});
}

function calculateMovement(piece: string, row: number, col: number, team: string, enemy: string) {
	if (piece === 'p') return pawnCalculation(team, enemy, row, col);
	let possibleMoves: HTMLElement[] = [];
	let possibleKills: HTMLElement[] = [];
	if (!(piece === 'r' || piece === 'b' || piece === 'q' || piece === 'n' || piece === 'k')) return { possibleMoves, possibleKills }; //invalid input

	const moveset = pieceMovements[piece];
	const directions = moveset.directions;
	const maxMovement = moveset.maxMovement;

	directions.forEach((direction) => {
		for (let i = 1; i <= maxMovement; i++) {
			let toTest = document.getElementById(`${row + direction.rowDelta * i}-${col + direction.colDelta * i}`);
			// out of bounds, cannot continue in this direction so exit
			if (!toTest) break;
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

function pawnCalculation(team: string, enemy: string, row: number, col: number) {
	function addMoveIfValid(row: number, col: number) {
		const position = document.getElementById(`${row}-${col}`);
		if (!position) return;
		if (!hasPiece(position)) possibleMoves.push(position);
	}
	let possibleMoves: HTMLElement[] = [];
	let possibleKills: HTMLElement[] = [];

	//@to-do pawn transform at enemies last row
	const moveDirection = team === 'w' ? -1 : 1; //up/down based on white/black
	const startRow = team === 'w' ? 6 : 1; //if on start row allow to move 2 blocks (start row for white is 6th from top)

	addMoveIfValid(row + moveDirection, col); //basic 1 block movement

	//allow to move two spaces forward if at start and no other piece blocks it
	if (row === startRow) addMoveIfValid(row + moveDirection * 2, col);

	//diagonal kill
	[1, -1].forEach((direction) => {
		//direction here is left/right
		const location = document.getElementById(`${row + moveDirection}-${col + direction}`);
		if (!location) return;
		let pieceAtLoc = hasPiece(location);
		if (pieceAtLoc && pieceAtLoc[0] === enemy) possibleKills.push(location); //allow movement only if diagonal piece is enemy
	});

	return { possibleMoves, possibleKills };
}
