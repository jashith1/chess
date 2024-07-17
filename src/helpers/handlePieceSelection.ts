import clearPreviousSelections from './clearPreviousSelections';
import movementCalculation from './movementCalculation';

export default function handlePieceSelection(e: any, piece: string, setTurn: any) {
	clearPreviousSelections();
	let [row, col] = e?.id.split('-').map(Number);
	e.classList.add('bg-blue-500');
	movementCalculation(piece[0], piece[1], row, col);
}
