import clearPreviousSelections from './clearPreviousSelections';
import handlePieceSelection from './handlePieceSelection';

export default function handleMove(e: any) {
	const previousPiece = document.querySelector('.bg-blue-500');
	const previousPieceClasses = previousPiece?.classList;
	//@ts-ignore
	const pieceClass = Array.from(previousPieceClasses).find((className) => /^[wb][prnbqk]$/.test(className));
	if (pieceClass) previousPieceClasses?.remove(pieceClass);
	previousPiece?.removeEventListener('click', handlePieceSelection);

	clearPreviousSelections();
	e?.target?.classList.add(pieceClass);
	e.target.addEventListener('click', handlePieceSelection);
}
