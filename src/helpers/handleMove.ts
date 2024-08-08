import { Dispatch, SetStateAction } from 'react';
import clearPreviousSelections from './clearPreviousSelections';
import hasPiece from './hasPiece';

export default function handleMove(newLocation: any, setTurn: Dispatch<SetStateAction<string>>) {
	const previousLocation = document.querySelector('.bg-blue-500');
	const previousLocationClasses = previousLocation?.classList;

	const piece = hasPiece(previousLocation);
	if (!piece) return; //make sure there is a piece to move
	const enemy = piece[0] === 'w' ? 'b' : 'w';

	if (!newLocation.classList.contains('possible_move') && !newLocation.classList.contains('possible_kill')) return; //make sure move is valid

	previousLocationClasses?.remove(piece);
	//kill any enemy pawn on new location
	newLocation.classList.remove(hasPiece(newLocation));
	clearPreviousSelections();
	newLocation.classList.add(piece);
	setTurn(enemy);
}
