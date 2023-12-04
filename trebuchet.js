// Day 1:  Trebuchet?!

const { open } = require('node:fs/promises');

const digits = [
	'zero',
	'one',
	'two',
	'three',
	'four',
	'five',
	'six',
	'seven',
	'eight',
	'nine'
];

(async () => {
  const file = await open('./inputs/1.txt');
	var sum = 0;

  for await (const line of file.readLines()) {
		sum += parseInput(line);
  }
	console.log(sum);

})();

function parseInput( line ) {
	const numbers = [];
	line = convertWords( line );
	for( let i=0; i < line.length; i++ ) {
		let candidate = Number.parseInt( line[i] );
		if( ! Number.isNaN( candidate ) ) {
			numbers.push( line[i] );
		}
	}
	let number = Number.parseInt( numbers[0] + numbers[ numbers.length - 1 ] );
	return number
}

function convertWords( line ) {
	for( let i=0; i < digits.length; i++ ) {
		let pos = line.indexOf( digits[i] );
		// There may be more than one occurrence of a number word per line
		while( pos >= 0 ) {
			// Words may overlap, so replace the second letter instead of the first B-)
			line = line.substring(0, pos + 1) + i + line.substring(pos + 2);
			pos = line.indexOf( digits[i] );
		}
	}
	return line;
}
