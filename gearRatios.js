// Day 3:  Gear Ratios

const { open } = require('node:fs/promises');

(async () => {
	const file = await open('./inputs/3.txt');
	const { schematic, numbers } = await parseSchematic( file );
	var partNumbers = 0;

	for( number of numbers ) {
		if( isPartNumber( number, schematic ) ) {
			partNumbers += number.value;
		}
	}
	console.log('Sum of all part numbers: ' + partNumbers);

	console.log('Sum of all gear ratios: ' + addGearRatios(schematic));
})();

function isPartNumber( number, schematic ) {
	const digits = number.value.toString().length;
	let rowStart = number.row - (number.row > 0);
	let rowEnd = number.row + (number.row < (schematic.length - 1));
	let colStart = number.col - (number.col > 0);
	let colEnd = Math.min(number.col + digits, (schematic[number.row].length - 1));
	for( let i=rowStart; i <= rowEnd; i++ ) {
		for( let j=colStart; j <= colEnd; j++ ) {
			if( schematic[i][j].isSymbol ) {
				tagPartNumber(schematic, number.row, number.col, digits);
				return true;
			}
		}
	}
	return false;
}

function isGear( square, row, col, schematic ) {
	if( square.isSymbol && square.symbol === '*' ) {
		let rowStart = row - (row > 0);
		let rowEnd = row + (row < (schematic.length - 1));
		let colStart = col - (col > 0);
		let colEnd = col + (col < (schematic[row].length - 1));
		const partNumbers = [];
		for( let i=rowStart; i <= rowEnd; i++ ) {
			for( let j=colStart; j <= colEnd; j++ ) {
				if( schematic[i][j].isPartNumber && ! partNumbers.includes( schematic[i][j].value ) ) {
					partNumbers.push( schematic[i][j].value );
				}
			}
		}
		if( partNumbers.length === 2 ) {
			schematic[row][col].gearRatio = partNumbers[0] * partNumbers[1];
			return true;
		}
	}
	return false;
}

function addGearRatios( schematic ) {
	var sum = 0;
	for( let i=0; i < schematic.length; i++ ) {
		for( let j=0; j < schematic[i].length; j++ ) {
			if( isGear( schematic[i][j], i, j, schematic ) ) {
				sum += schematic[i][j].gearRatio;
			}
		}
	}
	return sum;
}

function tagPartNumber(schematic, row, col, length) {
	for( let i=col; i<(col + length); i++ ) {
		schematic[row][i].isPartNumber = true;
	}
}
	
async function parseSchematic( file ) {
	const numbers = []; // numbers and their coordinates (first digit)
	const cells = [];
	var row = 0;

	for await (const line of file.readLines()) {
		sRow = [];
		for (let i=0; i < line.length; i++) {
			let col = i;
			let ch = line.charAt(i);
			if( ch === '.' ) { // Ignore periods.
				sRow.push(new Square());
				continue;
			} else if( ! Number.isNaN( Number.parseInt( ch ) ) ) {
				let number = '';
				let digits = 0;
				while( ! Number.isNaN( Number.parseInt( line.charAt(i) ) ) ) {
					number += line.charAt( i );
					digits++;
					i++;
				}
				i--; // Don't skip the next non-number
				numbers.push({
					'row': row,
					'col': col,
					'value': Number.parseInt(number),
				});
				for( let j=0; j<digits; j++ ) {
					sRow.push(new NumberSquare( Number.parseInt(number) ));
				}
			} else { // Symbols, by process of elimination.
				sRow.push(new SchematicSymbol(ch));
			}
		}
		cells.push(sRow);
		row++;
	}
	
	return { 'schematic': cells, numbers };
}

class Square {
	isNumber = false;
	isPartNumber = false;
	isSymbol = false;
}

class NumberSquare extends Square {
	isNumber = true;
	value;

	constructor(value) {
		super();
		this.value = value;
	}
}

class SchematicSymbol extends Square {
	symbol;

	constructor(symbol) {
		super();
		this.symbol = symbol;
	}

	isSymbol = true;
}

