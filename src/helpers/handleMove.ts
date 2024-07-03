import clearPreviousSelections from './clearPreviousSelections';
import handlePieceSelection from './handlePieceSelection';
import hasPiece from './hasPiece';

export default function handleMove(e: any) {
	const previousLocation = document.querySelector('.bg-blue-500');
	const previousLocationClasses = previousLocation?.classList;
	//@ts-ignore
	const pieceClass = hasPiece(previousLocation);
	if (pieceClass) previousLocationClasses?.remove(pieceClass);
	previousLocation?.removeEventListener('click', handlePieceSelection);

	const newLocation = e?.target;
	newLocation.classList.remove(hasPiece(newLocation));
	clearPreviousSelections();
	newLocation.classList.add(pieceClass);
	e.target.addEventListener('click', handlePieceSelection);
}
