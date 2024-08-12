'use client';
import hasPiece from './hasPiece';
import isKingThreatened from './isKingThreatened';

//setCheck is only defined when checking if king has been threatened at start of round (happens in background)
export default function movementCalculation(team: string, piece: string, row: number, col: number, pieceToIgnore?: string, positionsToCheck?: string[][], checkForCheckmate?: boolean, check?: string[][], kingLoc?: string) {
	const enemy = team === 'w' ? 'b' : 'w';
	if (piece === 'p') return pawnCalculation(team, enemy, row, col, positionsToCheck, checkForCheckmate, check, kingLoc);
	if (!(piece === 'r' || piece === 'b' || piece === 'q' || piece === 'n' || piece === 'k')) return; //invalid input

	const moveset = pieceMovements[piece];
	const directions = moveset.directions;
	const maxMovement = moveset.maxMovement;
	let isCheckmate = true;

	directions.forEach((direction) => {
		for (let i = 1; i <= maxMovement; i++) {
			let toTest = document.getElementById(`${row + direction.rowDelta * i}-${col + direction.colDelta * i}`);
			// out of bounds, cannot continue in this direction so exit
			if (!toTest) break;
			let pieceAtLoc = hasPiece(toTest);

			//check if king has been threatened
			if (check) {
				if (toTest.id === kingLoc) {
					const path = Array.from(Array(i).keys()).map((x) => `${row + direction.rowDelta * x}-${col + direction.colDelta * x}`);
					check.push(path);
				}
				//if ignoring piece, do not break
				if (pieceAtLoc && pieceToIgnore !== toTest.id) break;
				else continue;
			}

			let canMove = !positionsToCheck || positionsToCheck.length === 0;
			if (piece !== 'k' && !canMove && positionsToCheck?.every((path) => path.includes(toTest.id))) canMove = true; //every attack path must be blocked by moving piece here
			else if (piece === 'k' && !canMove && !isKingThreatened(team, document.querySelector(`.${team}k`)?.id, toTest.id)) canMove = true;

			if (!canMove && pieceAtLoc) break;
			else if (!canMove) continue;
			else if (canMove && checkForCheckmate && piece !== 'k') isCheckmate = false;

			if (piece === 'k' && isKingThreatened(team, document.querySelector(`.${enemy}k`)?.id, toTest.id)) continue;
			else if (piece === 'k' && checkForCheckmate && (!pieceAtLoc || pieceAtLoc[0] === enemy)) {
				isCheckmate = false;
				console.log(toTest.id);
			}

			if (checkForCheckmate) continue;

			if (!pieceAtLoc)
				//show user possible moves/kills
				toTest?.classList.add('possible_move');
			else if (pieceAtLoc[0] === enemy) {
				toTest?.classList.add('possible_kill');
				break;
			} else break;
		}
	});
	if (check) return check;
	else if (checkForCheckmate) {
		if (!isCheckmate) console.log(team, piece);
		return isCheckmate;
	}
}

function pawnCalculation(team: string, enemy: string, row: number, col: number, positionsToCheck?: string[][], checkForCheckmate?: boolean, check?: string[][], kingLoc?: string) {
	function addMoveIfValid(row: number, col: number) {
		const toTest = document.getElementById(`${row}-${col}`);
		if (!toTest) return;
		const canMove = !positionsToCheck || positionsToCheck.length === 0 || positionsToCheck?.every((path) => path.includes(toTest.id));
		const pieceAtFront = hasPiece(toTest);

		if (!pieceAtFront && canMove) {
			if (checkForCheckmate) isCheckmate = false;
			else toTest?.classList.add('possible_move');
		} else if (pieceAtFront) return 'blocked';
	}

	//@to-do pawn transform at enemies last row
	const moveDirection = team === 'w' ? -1 : 1; //up/down based on white/black
	const startRow = team === 'w' ? 6 : 1; //if on start row allow to move 2 blocks (start row for white is 6th from top)
	let isCheckmate = true;

	//diagonal kill
	[1, -1].forEach((direction) => {
		//direction here is left/right
		const toTest = document.getElementById(`${row + moveDirection}-${col + direction}`);
		if (!toTest) return;
		let pieceAtLoc = hasPiece(toTest);
		if (!pieceAtLoc || pieceAtLoc[0] === team) return;
		if (check && toTest.id === kingLoc) check.push([`${row}-${col}`]);
		else if (!check && !positionsToCheck && pieceAtLoc && pieceAtLoc[0] === enemy) toTest?.classList.add('possible_kill'); //allow movement only if diagonal piece is enemy
		else if (!check && positionsToCheck && positionsToCheck.length <= 1 && positionsToCheck[0][0] === toTest.id) {
			//pawn cant kill if there are more than one agressors
			if (checkForCheckmate) isCheckmate = false;
			else toTest?.classList.add('possible_kill');
		}
	});

	if (check) return check;

	const front = addMoveIfValid(row + moveDirection, col); //basic 1 block movement
	//allow to move two spaces forward if at start and no other piece blocks it
	if (row === startRow && front !== 'blocked') addMoveIfValid(row + moveDirection * 2, col);

	if (checkForCheckmate) return isCheckmate;
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
