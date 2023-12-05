// Day 5:  If You Give a Seed a Fertilizer

const { open } = require('node:fs/promises');

(async () => {
	const file = await open('./inputs/5.txt');
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

	for( seed of seeds ) {
		seed = seedToLocation( seed, maps );
		if( ! lowestLocation || seed < lowestLocation ) {
			lowestLocation = seed;
		}
	}

	console.log('Part 1:  closest location is ', lowestLocation);

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

class AlmanacMap {
	#ranges = [];

	addRange( range ) {
		this.#ranges.push( range );
	}

	convert( value ) {
		for( const range of this.#ranges ) {
			if( range.inRange( value ) ) {
				return range.convert( value );
			}
		}
		return value;
	}
}

class MapRange {
	#start;
	#end;
	#delta;

	constructor( destStart, sourceStart, length ) {
		this.#start = sourceStart;
		this.#end = sourceStart + length;
		this.#delta = destStart - sourceStart;
	}

	inRange( value ) {
		return value >= this.#start && value <= this.#end;
	}

	convert( value ) {
		if ( this.inRange( value ) ) {
			return value + this.#delta;
		}
		return false;
	}
}
