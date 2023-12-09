// Day 9:  Mirage Maintenance

const { open } = require('node:fs/promises');

(async () => {
	const file = await open('./inputs/9.txt');
	var sumNext = 0;
	var sumPrev = 0;

	for await( const line of file.readLines() ) {
		let values = line.split( ' ' )
										.filter( Boolean )
										.map( (n) => {
											return Number.parseInt( n );
										} );
		const { prev, next } = extrapolateValue( values );
		sumNext += next;
		sumPrev += prev;
	}

	console.log('Part 1:  The sum of the values is ', sumNext);
	console.log('Part 2r:  The sum of the values is ', sumPrev);
})();

function extrapolateValue( values ) {
	const nextLine = [];
	var keepGoing = false;
	for( let i=1; i<values.length; i++ ) {
		let diff = values[i] - values[i-1];
		var lastValue = values[i];
		nextLine.push( diff );
		if( diff !== 0 ) {
			keepGoing = true;
		}
	}

	if( keepGoing ) {
		const { prev, next } = extrapolateValue( nextLine );
		let prevValue = values[0] - prev;
		let nextValue = lastValue + next;
		return { prev: prevValue, next: nextValue };
	} else {
		return { prev: values[0], next: lastValue };
	}
}
