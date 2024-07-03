import handleMove from './handleMove';
import handlePieceSelection from './handlePieceSelection';
import hasPiece from './hasPiece';

export default function clearPreviousSelections() {
	document.querySelectorAll('.possible_move').forEach((e) => {
		e.removeEventListener('click', handleMove);
		e.classList.remove('possible_move');
	});
	document.querySelectorAll('.possible_kill').forEach((e) => {
		e.removeEventListener('click', handleMove);
		e.classList.remove('possible_kill');
		if (hasPiece(e)) e.addEventListener('click', handlePieceSelection);
	});
	document.querySelectorAll('.bg-blue-500').forEach((e) => {
		e.classList.remove('bg-blue-500');
	});
}
