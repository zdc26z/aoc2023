// Day 3:  Gear Ratios

const { open } = require('node:fs/promises');
var symbols = [];

(async () => {
	const file = await open('./inputs/3.txt');
	const numbers = await parseSchematic( file ); // symbols are a side effect
	var sum = 0;

	for( number of numbers ) {
		if( isPartNumber( number ) ) {
			sum += number.value;
		}
	}
	console.log(sum);
})();

function isPartNumber( number ) {
	const digits = number.value.toString().length;
	let rowStart = number.row - (number.row > 0);
	let rowEnd = number.row + (number.row < (symbols.length - 1));
	let colStart = number.col - (number.col > 0);
	let colEnd = Math.min(number.col + digits, (symbols[number.row].length - 1));
	for( let i=rowStart; i <= rowEnd; i++ ) {
		for( let j=colStart; j <= colEnd; j++ ) {
			if( symbols[i][j] ) {
				return true;
			}
		}
	}
	return false;
}
	
async function parseSchematic( file ) {
	const numbers = []; // numbers and their coordinates (first digit)
	var row = 0;

	for await (const line of file.readLines()) {
		sRow = [];
		for (let i=0; i < line.length; i++) {
			let col = i;
			let ch = line.charAt(i);
			if( ch === '.' ) { // Ignore periods.
				sRow.push(false);
				continue;
			} else if( ! Number.isNaN( Number.parseInt( ch ) ) ) {
				let number = '';
				while( ! Number.isNaN( Number.parseInt( line.charAt(i) ) ) ) {
					sRow.push(false);
					number += line.charAt( i );
					i++;
				}
				i--; // Don't skip the next non-number
				numbers.push({
					'row': row,
					'col': col,
					'value': Number.parseInt(number),
				});
			} else { // Symbols, by process of elimination.
				sRow.push(true);
			}
		}
		symbols.push( sRow );
		row++;
	}
	
	return numbers;
}
