// Day 11: Cosmic Expansion

const { open } = require('node:fs/promises');

(async () => {
	const file = await open('./inputs/11.txt');
	var universe = [];

	for await( const line of file.readLines() ) {
		universe.push( line.split('') );
	}

	universe = expand( universe );

	const galaxies = mapThe( universe );

	var count = galaxies.length;
	for( let i=1; i<count; i++ ) {
		let galaxy = galaxies.shift();
	}
})();

function expand( universe ) {
	const expandedUniverse = [];
	const columns = [];
	for( let i=0; i<universe.length; i++ ) {
		var expand = true;
		const row = [];
		for( let j=0; j<universe[i].length; j++ ) {
			row.push(universe[i][j]);
			if( i === 0 && universe[i][j] === '.' ) {
				columns.push( true );
			} else if ( i === 0 ) {
				columns.push( false );
			} else if ( universe[i][j] !== '.' ) {
				expand = false;
				columns[j] = false;
			}
		}
		expandedUniverse.push( row );
		if( expand ) {
			expandedUniverse.push( row );
		}
	}

	for( let i=0; i<expandedUniverse.length; i++ ) {
		const row = [];
		for( let j=0; j<columns.length; j++ ) {
			row.push( expandedUniverse[i][j] );
			if( columns[j] ) {
				row.push( expandedUniverse[i][j] );
			}
		}
		expandedUniverse[i] = row;
	}
	
	return expandedUniverse;
}

function print( universe ) {
	for( let i=0; i<universe.length; i++ ) {
		let row = '';
		for( let j=0; j<universe[i].length; j++ ) {
			row += universe[i][j];
		}
		console.log(row);
	}
}

function mapThe( universe ) {
	const galaxies = [];
	for( let i=0; i<universe.length; i++ ) {
		for( let j=0; j<universe.length; j++ ) {
			if( universe[i][j] !== '.' ) {
				galaxies.push( { x: j, y: i } );
			}
		}
	}
	return galaxies;
}

