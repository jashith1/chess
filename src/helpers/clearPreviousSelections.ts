export default function clearPreviousSelections() {
	document.querySelectorAll('.possible_move').forEach((e) => {
		e.classList.remove('possible_move');
	});
	document.querySelectorAll('.possible_kill').forEach((e) => {
		e.classList.remove('possible_kill');
	});
	document.querySelectorAll('.bg-blue-500').forEach((e) => {
		e.classList.remove('bg-blue-500');
	});
}
