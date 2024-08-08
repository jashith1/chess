'use client';
import Board from '@/components/Board';
import movementCalculation from '@/helpers/movementCalculation';
import { useEffect, useState } from 'react';

export default function Home() {
	const [turn, setTurn] = useState('w');
	const [check, setCheck] = useState<string[][]>([]); //contains path from attacking piece to king

	useEffect(() => {
		initializeBoard();
	}, []);

	useEffect(() => {
		//at start of every turn reset check path
		setCheck([]);
	}, [turn]);

	useEffect(() => {
		//check if new player's king has been threatened by going through all enemy pieces
		const positionStack = ['r', 'n', 'b', 'q', 'k', 'p'];
		const enemy = turn === 'w' ? 'b' : 'w';
		positionStack.forEach((piece) => {
			document.querySelectorAll(`.${enemy}${piece}`).forEach((pieceElement) => {
				let [row, col] = pieceElement?.id.split('-').map(Number);
				movementCalculation(enemy, piece, row, col, [], check, setCheck);
				console.log(check);
			});
		});
		//"check" is a dependency because of double checks and the fact that useEffect is asynchronous, meaning it needs to be called multiple times if you need to capture path of more than one threatening piece
	}, [turn, check]);

	return (
		<>
			<Board turn={turn} setTurn={setTurn} check={check} setCheck={setCheck} />
			{check && <h1>{check + ` has been checked`}</h1>}
		</>
	);
}

function initializeBoard() {
	//rook, knight, bishop, queen, king, etc
	const positionStack = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
	const rowMappings = [0, 1, 6, 7];
	//row 2 and 3 will be treated as bottom 2 rows while 0 and 1 will be treated as top 2 rows.
	rowMappings.forEach((row, i) => {
		for (let col = 0; col < 8; col++) {
			const elm = document.getElementById(`${row}-${col}`);
			if (!elm) continue;

			if (row === 0 || row === 1) elm.classList.add(row === 1 ? 'bp' : `b${positionStack[col]}`);
			else elm.classList.add(row === 6 ? 'wp' : `w${positionStack[col]}`);
		}
	});
}
