// Day 11: Cosmic Expansion

const { open } = require('node:fs/promises');

(async () => {
	const file = await open('./inputs/11.txt');
	var universe = [];

	for await( const line of file.readLines() ) {
		universe.push( line.split('') );
	}

	const expanders = expand( universe );
  console.log(expanders);

  var sum = totalDistance( mapThe( universe ), expanders );

  console.log('Part 1:  the sum of the shortest distances is ', sum);

  sum = totalDistance( mapThe( universe ), expanders, 999999 );
  console.log('Part 2:  the sum of the shortest distances is ', sum);

})();

function totalDistance( galaxies, expanders, expansionFactor = 1 ) {
	var count = galaxies.length;
  var sum = 0;
	for( let i=1; i<count; i++ ) {
		let galaxy = galaxies.shift();
    for( let j=0; j<galaxies.length; j++ ) {
      let x1 = galaxy.x;
      let y1 = galaxy.y;
      let x2 = galaxies[j].x;
      let y2 = galaxies[j].y;
      for( column of expanders.columns ) {
        if( column < galaxy.x ) {
          x1 += expansionFactor;
        }
        if( column < galaxies[j].x ) {
          x2 += expansionFactor;
        }
      }
      for( row of expanders.rows ) {
        if( row < galaxy.y ) {
          y1 += expansionFactor;
        }
        if( row < galaxies[j].y ) {
          y2 += expansionFactor;
        }
      }
      let distance = Math.abs( x2 - x1 ) + Math.abs( y2 - y1 ) ;
      // console.log(i, '(', galaxy.x, ',', galaxy.y, ')', i+j+1, '(', x2, ',', y2, ')', distance);
      sum += distance;
    }
	}
  return sum;
}

function expand( universe ) {
  const expandedUniverse = {
    columns: [],
    rows: [],
  };
	const columns = [];
	for( let i=0; i<universe.length; i++ ) {
		var expand = true;
		for( let j=0; j<universe[i].length; j++ ) {
			if( i === 0 && universe[i][j] === '.' ) {
				expandedUniverse.columns.push( j );
			} else if ( i === 0 ) {
        expand = false;
			} else if ( universe[i][j] !== '.' ) {
				expand = false;
        if( expandedUniverse.columns.includes( j ) ) {
          delete expandedUniverse.columns[ expandedUniverse.columns.indexOf( j ) ];
        }
			}
		}
		if( expand ) {
      expandedUniverse.rows.push( i );
		}
	}

  expandedUniverse.columns = expandedUniverse.columns.filter(Boolean);
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
		for( let j=0; j<universe[i].length; j++ ) {
			if( universe[i][j] !== '.' ) {
				galaxies.push( { x: j, y: i } );
			}
		}
	}
	return galaxies;
}

