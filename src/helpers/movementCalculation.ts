'use client';
import { Dispatch, SetStateAction } from 'react';
import hasPiece from './hasPiece';

//setCheck is only defined when checking if king has been threatened at start of round (happens in background)
export default function movementCalculation(team: string, piece: string, row: number, col: number, pieceToIgnore?: string, positionsToCheck?: string[][], check?: string[][], setCheck?: Dispatch<SetStateAction<string[][]>>) {
	const enemy = team === 'w' ? 'b' : 'w';
	if (piece === 'p') return pawnCalculation(team, enemy, row, col, positionsToCheck, check, setCheck);
	if (!(piece === 'r' || piece === 'b' || piece === 'q' || piece === 'n' || piece === 'k')) return; //invalid input

	const moveset = pieceMovements[piece];
	const directions = moveset.directions;
	const maxMovement = moveset.maxMovement;

	directions.forEach((direction) => {
		for (let i = 1; i <= maxMovement; i++) {
			let toTest = document.getElementById(`${row + direction.rowDelta * i}-${col + direction.colDelta * i}`);
			// out of bounds, cannot continue in this direction so exit
			if (!toTest) break;
			let pieceAtLoc = hasPiece(toTest);

			//check if king has been threatened
			if (setCheck && check) {
				if (pieceAtLoc === `${enemy}k`) {
					const path = Array.from(Array(i).keys()).map((x) => `${row + direction.rowDelta * x}-${col + direction.colDelta * x}`);
					check.push(path);
				}
				if (pieceAtLoc && pieceToIgnore !== toTest.id) break; //if ignoring piece, do not break
				else continue;
			}

			const canMove = !positionsToCheck || positionsToCheck.length === 0 || positionsToCheck?.every(path => path.includes(toTest.id)); //every attack path must be blocked by going here
			if(!canMove) continue;

			//show user possible moves/kills
			if (!pieceAtLoc) toTest?.classList.add('possible_move');
			else if (pieceAtLoc[0] === enemy) {
				toTest?.classList.add('possible_kill');
				break;
			} else break;
		}
	});
	if (setCheck && check) {
		return check;
	}
}

function pawnCalculation(team: string, enemy: string, row: number, col: number, positionsToCheck?: string[][], check?: string[][], setCheck?: Dispatch<SetStateAction<string[][]>>) {
	function addMoveIfValid(row: number, col: number) {
		const toTest = document.getElementById(`${row}-${col}`);
		if (!toTest) return;
		const canMove = !positionsToCheck || positionsToCheck.length === 0 || positionsToCheck?.every((path) => path.includes(toTest.id));
		if (!hasPiece(toTest) && canMove) toTest?.classList.add('possible_move');
		else return 'blocked';
	}

	//@to-do pawn transform at enemies last row
	const moveDirection = team === 'w' ? -1 : 1; //up/down based on white/black
	const startRow = team === 'w' ? 6 : 1; //if on start row allow to move 2 blocks (start row for white is 6th from top)

	//diagonal kill
	[1, -1].forEach((direction) => {
		//direction here is left/right
		const toTest = document.getElementById(`${row + moveDirection}-${col + direction}`);
		if (!toTest) return;
		let pieceAtLoc = hasPiece(toTest);
		if (setCheck && check && pieceAtLoc === `${enemy}k`) check.push([`${row}-${col}`]);
		else if (!setCheck && pieceAtLoc && pieceAtLoc[0] === enemy) toTest?.classList.add('possible_kill'); //allow movement only if diagonal piece is enemy
		else if(!setCheck && positionsToCheck && positionsToCheck.length > 0 && positionsToCheck[0][0]===toTest.id) toTest?.classList.add('possible_kill');
	});

	if (setCheck || check) return check; //pawns cannot kill by moving forward

	const front = addMoveIfValid(row + moveDirection, col); //basic 1 block movement

	//allow to move two spaces forward if at start and no other piece blocks it
	if (row === startRow && front !== 'blocked') addMoveIfValid(row + moveDirection * 2, col);

}

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
