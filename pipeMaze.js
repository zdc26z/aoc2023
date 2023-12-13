// Day 10:  Pipe Maze

const { open } = require('node:fs/promises');
const chalk = require('chalk');
var start = null;

(async () => {
	const file = await open('./inputs/10.txt');
	const sketch = [];
	const pipesInLoop = [];
 
	var row = 0;
	for await( const line of file.readLines() ) {
		sketch.push( parseLine( line, row ) );
		row++;
	}

	// I can see from the input that the start pipe has to be an L, 
	// so we go off to the north and east.
	var next1 = { x: start[1], y: start[0], direction: Pipe.NORTH };
	var next2 = { x: start[1], y: start[0], direction: Pipe.EAST };
	var steps = 1;
	while( true ) {
		next1 = sketch[next1.y][next1.x].passThrough(next1.x, next1.y, next1.direction);
		next2 = sketch[next2.y][next2.x].passThrough(next2.x, next2.y, next2.direction);
		if( next1.x === next2.x && next1.y === next2.y ) {
			sketch[next1.y][next1.x].inTheLoop = true;
			break;
		}
		steps++;
	}
	console.log('Part 1: the furthest node from start is', steps, 'steps.');

	outer: for( let i=1; i<sketch.length - 1; i++ ) {
		for( let j=1; j<sketch[i].length - 1; j++ ) {
			// Squares to skip in the first part (before we move away from the edges)
			// - squares that are part of the loop
			// - squares below null squares (ground)
			// - squares to the right of null squares (ground)
			// - squares below non-loop pipes
			// - squares to the right of non-loop pipes
			// - squares diagonally adjacent to ground or non-loop pipes
			//   (above and to the left or right)
			if( (sketch[i][j] !== null && sketch[i][j].inTheLoop) || 
				sketch[i-1][j] === null || sketch[i][j-1] === null 
				|| sketch[i-1][j-1] === null || sketch[i-1][j+1] === null
				|| ! sketch[i-1][j-1].inTheLoop || ! sketch[i-1][j+1].inTheLoop
				|| ! sketch[i-1][j].inTheLoop || ! sketch[i][j-1].inTheLoop ) {
				if( sketch[i][j] !== null ) {
					sketch[i][j].isOutside = true;
				}
				continue;
			}
			break outer;
			// console.log(i, j, sketch[i][j]); // This is the first potential inside square.
			// I am starting to form a plan.
			// 1. Go around the current square and try to squeeze between, recursively.
			// 2. If we can squeeze out anywhere, keep looping.
			// 3. If we can't squeeze out, check next squares in this order:
			//     i.  (x+1, y)
			//     ii. (x-1, y+1)
			// 4. Do recursive things!
			// 5. When we move to a new row, move as far left as possible.
			// 6. Try to squeeze through at every step of the process.
			// 7. This should create a recursive stack at the first actual 
			//    inside square that covers every other inside square.
			if( canEscapeFrom( sketch, i, j, true ) ) {
				// continue;
			}
		}
	}
	print( sketch );
})();

function parseLine( line, row ) {
	const pipes = [];
	var col = 0;
	for( square of line.split('') ) {
		switch( square ) {
			case '|':
				pipes.push( new VerticalPipe() );
				break;
			case '-':
				pipes.push( new HorizontalPipe() );
				break;
			case 'L':
				pipes.push( new LPipe() );
				break;
			case 'J':
				pipes.push( new JPipe() );
				break;
			case '7':
				pipes.push( new SevenPipe() );
				break;
			case 'F':
				pipes.push( new FPipe() );
				break;
			case 'S':
				pipes.push( new Pipe() );
				start = [ row, col ];
				break;
			default:
				pipes.push( null );
				break;
		}
		col++;
	}
	return pipes;
}

function canEscapeFrom( sketch, row, col, fullSearch = false ) {
	// Try to go out the northwest corner horizontally
	Pipe.canSqueezeByHorizontally( sketch[ row ][ col - 1 ] );
	// Try to go out the northwest corner vertically
	// Try to go out the northeast corner vertically
	// Try to go out the northeast corner horizontally
	// Try to go out the southeast corner horizontally
	// Try to go out the southeast corner vertically
	// Try to go out the southwest corner vertically
	// Try to go out the southwest corner horizontally
	return true;
}

function print( sketch ) {
	for( let i=0; i<sketch.length; i++ ) {
		let row = '';
		for( let j=0; j<sketch[i].length; j++ ) {
			if( sketch[i][j] === null ) {
				row += '.';
			} else if ( sketch[i][j].inTheLoop ) {
				row += chalk.green( sketch[i][j].symbol );
			} else if ( sketch[i][j].isOutside ) {
				row += chalk.red( sketch[i][j].symbol );
			} else {
				row += sketch[i][j].symbol;
			}
		}
		console.log(row);
	}
}

class Pipe {
	static EAST = 0;
	static SOUTH = 1;
	static WEST = 2;
	static NORTH = 3;
	static INVALID = {
		x: -1,
		y: -1,
		direction: false
	};
	static HORIZONTAL = 4;
	static VERTICAL = 5;
	inTheLoop = false;
	isOutside = false;
	symbol = 'S';

	passThrough( x, y, direction ) {
		this.inTheLoop = true;
		switch (direction) {
			case Pipe.EAST:
				return { x: x+1, y, direction };
			case Pipe.SOUTH:
				return { x, y: y+1, direction };
			case Pipe.WEST:
				return { x: x-1, y, direction };
			case Pipe.NORTH:
				return { x, y: y-1, direction };
		}
	}

	static canSqueezeBy( pipe, direction ) {
		if( direction === Pipe.HORIZONTAL ) {
			// Can we go over the top of this pipe?
			if( pipe instanceof VerticalPipe || pipe instanceof LPipe || pipe instanceof JPipe ) {
				return false;
			}
			return true;
		} else {
			// Can we go by to the right of this pipe?
			if( pipe instanceof HorizontalPipe || pipe instanceof LPipe || pipe instanceof FPipe ) {
				return false;
			}
			return true;
		}
	}

	static canSqueezeByHorizontally( pipe ) {
		return Pipe.canSqueezeBy( pipe, Pipe.HORIZONTAL );
	}

	static canSqueezeByVertically( pipe ) {
		return Pipe.canSqueezeBy( pipe, Pipe.VERTICAL );
	}
}

class VerticalPipe extends Pipe {
	symbol = '|';

	passThrough( x, y, direction ) {
		if( direction === Pipe.EAST || direction === Pipe.WEST ) {
			return Pipe.INVALID;
		} else {
			return super.passThrough( x, y, direction );
		}
	}
}

class HorizontalPipe extends Pipe {
	symbol = '-';

	passThrough( x, y, direction ) {
		if( direction == Pipe.NORTH || direction === Pipe.SOUTH	) {
			return Pipe.INVALID;
		} else {
			return super.passThrough( x, y, direction );
		}
	}
}

class LPipe extends Pipe {
	symbol = 'L';

	passThrough( x, y, direction ) {
		this.inTheLoop = true;
		if( direction === Pipe.SOUTH ) {
			return { x: x+1, y, direction: Pipe.EAST };
		} else if( direction === Pipe.WEST ) {
			return { x, y: y-1, direction: Pipe.NORTH };
		} else {
			return Pipe.INVALID;
		}
	}
}

class JPipe extends Pipe {
	symbol = 'J';

	passThrough( x, y, direction ) {
		this.inTheLoop = true;
		if( direction === Pipe.SOUTH ) {
			return { x: x-1, y, direction: Pipe.WEST };
		} else if( direction === Pipe.EAST ) {
			return { x, y: y-1, direction: Pipe.NORTH };
		} else {
			return Pipe.INVALID;
		}
	}
}

class SevenPipe extends Pipe {
	symbol = '7';

	passThrough( x, y, direction ) {
		this.inTheLoop = true;
		if( direction === Pipe.NORTH ) {
			return { x: x-1, y, direction: Pipe.WEST };
		} else if( direction === Pipe.EAST ) {
			return { x, y: y+1, direction: Pipe.SOUTH };
		} else {
			return Pipe.INVALID;
		}
	}
}

class FPipe extends Pipe {
	symbol = 'F';

	passThrough( x, y, direction ) {
		this.inTheLoop = true;
		if( direction === Pipe.NORTH ) {
			return { x: x+1, y, direction: Pipe.EAST };
		} else if( direction === Pipe.WEST ) {
			return { x, y: y+1, direction: Pipe.SOUTH };
		} else {
			return Pipe.INVALID;
		}
	}
}

