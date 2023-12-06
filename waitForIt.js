// Day 6:  Wait For It

const { readFileSync } = require('node:fs');

const file = readFileSync( './inputs/6.txt', { 'encoding': 'utf8' } );
const lines = file.split('\n').filter(Boolean);

const times = readLine( lines[0] );
const distances = readLine( lines[1] );

part1( times, distances );
part2( times, distances );

function readLine( line ) {
	return line.substring( line.indexOf( ':' ) + 1 ).split( ' ' ).filter( Boolean ).map( (n) => { return Number.parseInt(n); });
}

function part1( times, distances ) {
	var product = 1;
	for( let i=0; i<times.length; i++ ) {
		let { min, max } = quadratic( times[i], distances [i] );
		product *= (max - min) + 1;  // Add 1 because we want the number of possible ways to win
	}

	console.log( 'Part 1: the total product is ', product );
}

function part2( times, distances ) {
	var time = '';
	var distance = '';
	for( let i=0; i<times.length; i++ ) {
		time += times[i];
		distance += distances[i];
	}

	let { min, max } = quadratic( Number.parseInt( time ), Number.parseInt( distance ) );
	console.log( 'Part 2:  the number of ways to win is ', (max - min) + 1 );
}

function quadratic( time, distance ) {
	let sqrt = Math.sqrt( time ** 2 - 4 * (distance + 1) );
	let min = (-time + sqrt)/-2;
	let max = (-time - sqrt)/-2;
	return { 'min': Math.ceil( min ), 'max': Math.floor( max ) };
}

