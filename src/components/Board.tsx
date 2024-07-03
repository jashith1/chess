import BlackTile from './BlackTile';
import WhiteTile from './WhiteTile';

export default function Board() {
	return (
		<>
			{Array.from({ length: 8 }, (_, row) => (
				<div key={row}>
					{
						//if both row and column are even or odd then generate white tile, if not generate black tile. Not using ternary operator to improve readability
						Array.from({ length: 8 }, (_, col) => {
							if ((col % 2 === 0 && row % 2 === 0) || (col % 2 !== 0 && row % 2 !== 0)) return <WhiteTile />;
							else return <BlackTile />;
						})
					}
				</div>
			))}
		</>
	);
}
