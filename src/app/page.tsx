'use client';
import Board from '@/components/Board';
import isKingThreatened from '@/helpers/isKingThreatened';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

export default function Home() {
	const [turn, setTurn] = useState('w');
	const [check, setCheck] = useState<string[][]>([]); //contains path from attacking piece to king
	const [checkmate, setCheckmate] = useState(false);

	useEffect(() => {
		initializeBoard();
	}, []);

	useEffect(() => {
		isKingThreatened(turn, '', '', setCheck, setCheckmate);
	}, [turn]);

	useEffect(() => {
		if (!checkmate) return;
		const winner = turn === 'w' ? 'b' : 'w';
		const yOrigin = winner === 'b' ? 0 : 1; //spawn on side of winner, ie at top if black wins and bottom if white wins
		const angle = winner === 'b' ? -90 : 90; //spawn making it fall downward if black is winner else upward if winner is white
		//top/bottom confettis
		[0.25, 0.75].forEach((xOrigin) => {
			//spawn 2 confettis, one at 1/4 and the other at 3/4 of screen horizontally
			confetti({ origin: { x: xOrigin, y: yOrigin }, angle: angle, scalar: 2, particleCount: 100, spread: 90 });
		});

		//sideways confetti
		confetti({ origin: { x: 0, y: 0.5 }, angle: 0, scalar: 2, particleCount: 100, spread: 90 });
		confetti({ origin: { x: 1, y: 0.5 }, angle: 180, scalar: 2, particleCount: 100, spread: 90 });
	}, [checkmate]);

	return (
		<>
			<Board turn={turn} setTurn={setTurn} check={check} setCheck={setCheck} isCheckmate={checkmate} />
			{check.length > 0 && <h1>{check + ` has been checked`}</h1>}
			{checkmate && <h1>Congrats! {turn === 'w' ? 'black' : 'white'} won!</h1>}
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
