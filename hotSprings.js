// Day 12:  Hot Springs

const { open } = require('node:fs/promises');

(async() => {
	const file = await open('./inputs/12.txt');
	var sum = 0;

	for await( const line of file.readLines() ) {
		let record = line.split(' ');
		record = new Record( record[0], record[1].split(',').map( (n) => { return Number.parseInt(n); } ) );
		sum += record.getPossibleArrangements();
	}

	console.log('Part 1:  there are ', sum, 'possible arrangements.');
})();

class Record {
	data;
	groups;

	constructor( data, groups ) {
		this.data = data;
		this.groups = groups;
	}

	getPossibleArrangements() {
		const unknowns = this.data.split('?').length - 1;
		const totalPossibilities = Math.pow(2, unknowns);
		var count = 0;

		for( let i=0; i<totalPossibilities; i++ ) {
			const isBroken = i.toString(2).split('').map( (d) => { return d === '1'; } );
			const groups = [];
			var groupCount = 0;
			let possibility = '';
			for( const ch of this.data.split('') ) {
				if( ch === '?' ) {
					if( isBroken.pop() ) {
						possibility += '#';
						groupCount++;
					} else {
						possibility += '.';
						if( groupCount > 0 ) {
							groups.push( groupCount );
							groupCount = 0;
						}
					}
				} else if ( ch === '#' ) {
					possibility += ch;
					groupCount++;
				} else {
					possibility += ch;
					if( groupCount > 0 ) {
						groups.push( groupCount );
						groupCount = 0;
					}
				}
			}
			if( groupCount > 0 ) {
				groups.push( groupCount );
			}
			if( this.isMatch( groups ) ) {
				count++;
			}
		}

		return count;
	}

	isMatch( groups ) {
		return groups.length === this.groups.length &&
			groups.every((val, index) => { return val === this.groups[index] });
	}
}

