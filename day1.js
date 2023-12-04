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
	return Number.parseInt( numbers[0] + numbers[ numbers.length - 1 ] );
}

function convertWords( line ) {
	console.log('before: ', line);
	for( let i=0; i < digits.length; i++ ) {
		let pos = line.indexOf( digits[i] );
		if( pos >= 0 ) {
			console.log(digits[i]);
			line = line.substring(0, pos) + i + line.substring(pos + 1);
		}
	}
	console.log('after: ', line);
	return line;
}
