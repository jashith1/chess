import handleMove from './handleMove';

export default function clearPreviousSelections() {
	document.querySelectorAll('.possible_move').forEach((e) => {
		e.removeEventListener('click', handleMove);
		e.classList.remove('possible_move');
	});
	document.querySelectorAll('.bg-blue-500').forEach((e) => {
		e.classList.remove('bg-blue-500');
	});
}
