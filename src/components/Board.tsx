export default function Board() {
	return (
		<div id='board'>
			{Array.from({ length: 8 }, (_, row) => (
				<div key={row}>
					{Array.from({ length: 8 }, (_, col) => {
						let white = false;
						//if both row and column are even or odd then generate white tile, if not generate black tile. Not using ternary operator to improve readability
						if ((col % 2 === 0 && row % 2 === 0) || (col % 2 !== 0 && row % 2 !== 0)) white = true;
						return <div className={`rectangle ${white ? 'bg-white' : 'bg-black'}`} id={`${row}-${col}`} key={`${row}-${col}`} />;
					})}
				</div>
			))}
		</div>
	);
}
