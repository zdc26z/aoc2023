// Day 2:  Cube Conundrum

const { open } = require('node:fs/promises');

const possibleCubes = {
	'red': 12,
	'green': 13,
	'blue': 14,
};

(async () => {
	const file = await open('./inputs/2.txt');
	var sum = 0;

	for await (const line of file.readLines()) {
		sum += testGame( line );
	}
	console.log(sum);
})();

/**
 * Tests a line of input to determine if the game is possible.
 *
 * @param string game The line of input.
 * @return 0 if the game is not possible, the ID of the game otherwise.
 */
function testGame( game ) {
	const { id, reveals } = prepare( game );
	for( reveal of reveals ) {
		if( !possible( reveal.trim() ) ) {
			return 0;
		}
	}
	return Number.parseInt( id );
}

function prepare( game ) {
	const space = game.indexOf(' ');
	const colon = game.indexOf(':');
	return { 
		'id': game.substring(space + 1, colon), 
		'reveals': game.substring(colon + 1).trim().split(';'),
	};
}

function possible( reveal ) {
	const colors = reveal.split(',');
	for( color of colors ) {
		color = color.trim();
		const space = color.indexOf(' ');
		const count = Number.parseInt( color.substring(0, space) );
		color = color.substring(space + 1);
		if( count > possibleCubes[ color ] ) {
			return false;
		}
	}
	return true;
}
