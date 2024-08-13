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
		<div id='board'>
			{Array.from({ length: 8 }, (_, row) => (
				<div key={row}>
					{Array.from({ length: 8 }, (_, col) => {
						let white = false;
						//if both row and column are even or odd then generate white tile, if not generate black tile.
						if ((col % 2 === 0 && row % 2 === 0) || (col % 2 !== 0 && row % 2 !== 0)) white = true;
						return <div className={`rectangle ${white ? 'bg-white' : 'bg-black'}`} id={`${row}-${col}`} key={`${row}-${col}`} onClick={handleLocationSelection} />;
					})}
				</div>
			))}
		</div>
	);
}
