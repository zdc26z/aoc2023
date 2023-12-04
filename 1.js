const { open } = require('node:fs/promises');

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
	for( let i=0; i < line.length; i++ ) {
		let candidate = Number.parseInt( line[i] );
		if( ! Number.isNaN( candidate ) ) {
			numbers.push( line[i] );
		}
	}
	return Number.parseInt( numbers[0] + numbers[ numbers.length - 1 ] );
}
