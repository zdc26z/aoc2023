// Day 3:  Gear Ratios

const { open } = require('node:fs/promises');

(async () => {
	const file = await open('./inputs/3.txt');
	const symbols = []; // boolean values for each position in the schematic
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
				let number = ch;
				sRow.push(false);
				i++;
				while( ! Number.isNaN( Number.parseInt( line.charAt(i) ) ) ) {
					sRow.push(false);
					number += line.charAt( i );
					i++;
				}
				numbers.push({
					'row': row,
					'col': col,
					'value': number,
				});
			} else { // Symbols, by process of elimination.
				sRow.push(true);
			}
		}
		symbols.push( sRow );
		row++;
	}
})();
