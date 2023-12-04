// Day 4:  Scratch Cards

const { open } = require('node:fs/promises');

(async () => {
	const file = await open('./inputs/4.txt');
	var points = 0;

	for await (const line of file.readLines()) {
		points += calcPoints( line );
	}
	console.log('Part 1:  total points ' + points);
})();

function calcPoints( card ) {
	const { winningNumbers, myNumbers } = parseCard( card );
	var points = 0;
	for( number of myNumbers ) {
		if( winningNumbers.includes( number ) ) {
			if( ! points ) {
				points = 1;
			} else {
				points *= 2;
			}
		}
	}
	return points;
}

function parseCard( card ) {
	// Strip the game label (for now?)
	card = card.substring( card.indexOf(':') + 1 );
	const pipe = card.indexOf('|');
	const winningNumbers = card.substring(0, pipe).trim().split(' ').filter(Boolean).map( (n) => Number.parseInt(n) );
	const myNumbers = card.substring(pipe + 1).trim().split(' ').filter(Boolean).map( (n) => Number.parseInt(n) );
	return { winningNumbers, myNumbers };
}
