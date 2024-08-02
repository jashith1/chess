'use client';
import Board from '@/components/Board';
import { useEffect, useState } from 'react';

export default function Home() {
	const [turn, setTurn] = useState('w');
	const [check, setCheck] = useState(''); //possible states: ['', 'w', 'b', 'cmw', 'cmb'], cm is checkmate and indicated color is the one currently experiencing check.

	useEffect(() => {
		initializeBoard();
	}, []);

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
