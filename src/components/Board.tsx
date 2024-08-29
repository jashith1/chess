import getPieceImage from '@/helpers/getPieceImage';
import handleMove from '@/helpers/handleMove';
import handlePieceSelection from '@/helpers/handlePieceSelection';
import hasPiece from '@/helpers/hasPiece';
import { Dispatch, SetStateAction, useState } from 'react';

export default function Board({ turn, setTurn, check, setCheck, isCheckmate }: { turn: string; setTurn: Dispatch<SetStateAction<string>>; check: string[][]; setCheck: Dispatch<SetStateAction<string[][]>>; isCheckmate: boolean }) {
	const [moves, setMoves] = useState<{ location: string; piece: string }[]>([]);
	function handleLocationSelection(e: any) {
		if (isCheckmate) return;
		e = e?.target;
		const piece = hasPiece(e);
		if (document.querySelector('.bg-blue-500') && (!piece || piece[0] !== turn)) return handleMove(e, setTurn, moves, setMoves);
		if (!piece || turn !== piece[0]) return;
		handlePieceSelection(e, piece, check, setCheck);
	}

	return (
		<div className='flex justify-center items-center min-h-screen p-4'>
			<div id='board' className='inline-grid grid-cols-8 shadow-lg' style={{ width: 'min(80vmin, 1200px)' }}>
				{Array.from({ length: 64 }, (_, i) => {
					const row = Math.floor(i / 8);
					const col = i % 8;
					const white = (row + col) % 2 === 0;
					return <div className={`${white ? 'bg-white' : 'bg-black'} square`} id={`${row}-${col}`} key={`${row}-${col}`} onClick={handleLocationSelection} />;
				})}
			</div>
			<div className='w-full md:w-64 bg-stone-600 shadow-lg rounded-lg overflow-hidden'>
				<div className='bg-gray-800 text-white p-4'>
					<h2 className='text-xl font-bold'>Game History</h2>
				</div>

				<div className='h-[calc(80vmin-4rem)] max-h-[calc(1200px-4rem)] overflow-y-auto p-4 text-black'>
					<ul className='space-y-2'>
						{moves.map((move, index) => (
							<li key={index} className='flex items-center transition-all duration-200 hover:bg-gray-100 p-2 rounded'>
								<span className='w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full mr-2 transition-all duration-200 group-hover:bg-gray-300'>{index + 1}</span>
								<img className='w-8 h-8 flex items-center justify-center mr-2' src={getPieceImage(move.piece)}></img>
								<span className='flex-grow'>{move.location}</span>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}
