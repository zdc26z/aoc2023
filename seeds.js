// Day 5:  If You Give a Seed a Fertilizer

const { open } = require('node:fs/promises');

(async () => {
	const file = await open('./inputs/5.txt');
	const seedRanges = [];
	const maps = {};
	var lowestLocation = false;
	var seeds = [];
	var currentMap = false;

	for await (const line of file.readLines()) {
		if( line.indexOf('seeds:') >= 0 ) {
			seeds = line.substring( line.indexOf('seeds:') + 'seeds:'.length );
			seeds = seeds.split(' ').filter(Boolean).map( (n) => { return Number.parseInt(n) } );
		} else if ( line.indexOf('map') >= 0 ) {
			currentMap = line.substring( 0, line.indexOf('map') ).trim();
			maps[ currentMap ] = new AlmanacMap();
		} else if ( ! line.length ) {
			continue;
		} else {
			maps[ currentMap ].addRange( new MapRange( ...line.split(' ').filter(Boolean).map( (n) => { return Number.parseInt(n); } ) ) );
		}
	}

	for( let i=0; i < seeds.length; i++ ) {
		if( i%2 === 0 ) {
			seedRanges.push( { 'start': seeds[i] } );
		} else {
			let lastRange = seedRanges.pop();
			lastRange.length = seeds[i];
			seedRanges.push( lastRange );
		}
		let seed = seedToLocation( seeds[i], maps );
		if( ! lowestLocation || seed < lowestLocation ) {
			lowestLocation = seed;
		}
	}

	console.log('Part 1:  closest location is ', lowestLocation);

	console.log('Part 2:  closest location is ', closestLocation( seedRanges, maps ));

})();

function seedToLocation( seed, maps ) {
	// convert seed to location in several steps
	// seed-to-soil
	seed = maps['seed-to-soil'].convert( seed );
	// soil-to-fertilizer
	seed = maps['soil-to-fertilizer'].convert( seed );
	// fertilizer-to-water
	seed = maps['fertilizer-to-water'].convert( seed );
	// water-to-light
	seed = maps['water-to-light'].convert( seed );
	// light-to-temperature
	seed = maps['light-to-temperature'].convert( seed );
	// temperature-to-humidity
	seed = maps['temperature-to-humidity'].convert( seed );
	// humidity-to-location
	seed = maps['humidity-to-location'].convert( seed );
	return seed;
}

function locationToSeed( loc, maps ) {
	loc = maps['humidity-to-location'].revert( loc );
	loc = maps['temperature-to-humidity'].revert( loc );
	loc = maps['light-to-temperature'].revert( loc );
	loc = maps['water-to-light'].revert( loc );
	loc = maps['fertilizer-to-water'].revert( loc );
	loc = maps['soil-to-fertilizer'].revert( loc );
	loc = maps['seed-to-soil'].revert( loc );
	return loc;
}

function closestLocation( seedRanges, maps ) {
	let loc = 0;
	while( true ) {
		let seed = locationToSeed( loc, maps );
		for( range of seedRanges ) {
			if( seed >= range.start && seed <= ( range.start + range.length ) ) {
				return loc;
			}
		}
		loc++;
	}
}

class AlmanacMap {
	#ranges = [];

	addRange( range ) {
		this.#ranges.push( range );
	}

	convert( value ) {
		for( const range of this.#ranges ) {
			if( range.inSource( value ) ) {
				return range.convert( value );
			}
		}
		return value;
	}

	revert( value ) {
		for( const range of this.#ranges ) {
			if( range.inDest( value ) ) {
				return range.revert( value );
			}
		}
		return value;
	}
}

class MapRange {
	#destStart;
	#destEnd;
	#sourceStart;
	#sourceEnd;
	#delta;

	constructor( destStart, sourceStart, length ) {
		this.#sourceStart = sourceStart;
		this.#sourceEnd = sourceStart + length;
		this.#destStart = destStart;
		this.#destEnd = destStart + length;
		this.#delta = destStart - sourceStart;
	}

	inSource( value ) {
		return value >= this.#sourceStart && value <= this.#sourceEnd;
	}

	inDest( value ) {
		return value >= this.#destStart && value <= this.#destEnd;
	}

	convert( value ) {
		return value + this.#delta;
	}

	revert( value ) {
		return value - this.#delta;
	}
}
