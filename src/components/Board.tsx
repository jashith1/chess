import handleMove from '@/helpers/handleMove';
import handlePieceSelection from '@/helpers/handlePieceSelection';
import hasPiece from '@/helpers/hasPiece';
import { Dispatch, SetStateAction } from 'react';

export default function Board({ turn, setTurn, check, setCheck, isCheckmate }: { turn: string; setTurn: Dispatch<SetStateAction<string>>; check: string[][]; setCheck: Dispatch<SetStateAction<string[][]>>; isCheckmate: boolean }) {
	function handleLocationSelection(e: any) {
		if (isCheckmate) return;
		e = e?.target;
		const piece = hasPiece(e);
		if (document.querySelector('.bg-blue-500') && (!piece || piece[0] !== turn)) return handleMove(e, setTurn);
		if (!piece || turn !== piece[0]) return;
		handlePieceSelection(e, piece, check, setCheck);
	}

	return (
		<div className='flex justify-center items-center min-h-screen p-4'>
			<div id='board' className='inline-grid grid-cols-8 shadow-lg' style={{ width: 'min(80vmin, 800px)' }}>
				{Array.from({ length: 64 }, (_, i) => {
					const row = Math.floor(i / 8);
					const col = i % 8;
					const white = (row + col) % 2 === 0;
					return <div className={`${white ? 'bg-white' : 'bg-black'} square`} id={`${row}-${col}`} key={`${row}-${col}`} onClick={handleLocationSelection} />;
				})}
			</div>
		</div>
	);
}
