export default function hasPiece(toTest: HTMLElement | Element | null) {
	if (!toTest) return false;
	return Array.from(toTest?.classList).find((className) => /^[wb][prnbqk]$/.test(className));
}
