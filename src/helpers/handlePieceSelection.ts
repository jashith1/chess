import clearPreviousSelections from './clearPreviousSelections';
import movementCalculation from './movementCalculation';

export default function handlePieceSelection(e: any) {
	clearPreviousSelections();
	let classes = e?.target?.classList;
	let piece = classes[classes.length - 1];
	let [row, col] = e?.target?.id.split('-').map(Number);
	classes.add('bg-blue-500');

	movementCalculation(piece[0], piece[1], row, col);
}
