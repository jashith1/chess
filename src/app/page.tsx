'use client';
import Board from '@/components/Board';
import { useEffect } from 'react';

export default function Home() {
	useEffect(() => {
		initializeBoard();
	}, []);

	return (
		<>
			<Board />
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

			elm.addEventListener('click', handlePawnSelection);

			elm.classList.add('piece');
			if (row === 0 || row === 1) elm.classList.add(row === 0 ? 'bp' : `b${positionStack[col]}`);
			else elm.classList.add(row === 6 ? 'wp' : `w${positionStack[col]}`);
		}
	});
}

function clearPreviousSelections() {
	document.querySelectorAll('.possible_move').forEach((e) => {
		e.classList.remove('possible_move');
	});
	document.querySelectorAll('.bg-blue-500').forEach((e) => {
		e.classList.remove('bg-blue-500');
	});
}

function handlePawnSelection(e: any) {
	clearPreviousSelections();
	let classes = e?.target?.classList;
	let piece = classes[classes.length - 1];
	let [row, col] = e?.target?.id.split('-').map(Number);
	classes.add('bg-blue-500');

	if (piece === 'wp') {
		document.getElementById(`${row - 1}-${col}`)?.classList.add('possible_move');
		document.getElementById(`${row - 2}-${col}`)?.classList.add('possible_move');
	}
}
