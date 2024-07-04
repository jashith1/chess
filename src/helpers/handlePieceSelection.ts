import clearPreviousSelections from './clearPreviousSelections';
import hasPiece from './hasPiece';
import movementCalculation from './movementCalculation';

export default function handlePieceSelection(e: any) {
	clearPreviousSelections();
	e = e?.target;
	let piece = hasPiece(e);
	if (!piece) return;
	let [row, col] = e?.id.split('-').map(Number);
	e.classList.add('bg-blue-500');

	movementCalculation(piece[0], piece[1], row, col);
}
