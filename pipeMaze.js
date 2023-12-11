// Day 10:  Pipe Maze

const { open } = require('node:fs/promises');
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
			break;
		}
		steps++;
	}
	console.log('Part 1: the furthest node from start is', steps, 'steps.');
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
	inTheLoop = false;

	passThrough( x, y, direction ) {
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
		this.inTheLoop = true;
	}
}

class VerticalPipe extends Pipe {
	passThrough( x, y, direction ) {
		if( direction === Pipe.EAST || direction === Pipe.WEST ) {
			return Pipe.INVALID;
		} else {
			return super.passThrough( x, y, direction );
		}
	}
}

class HorizontalPipe extends Pipe {
	passThrough( x, y, direction ) {
		if( direction == Pipe.NORTH || direction === Pipe.SOUTH	) {
			return Pipe.INVALID;
		} else {
			return super.passThrough( x, y, direction );
		}
	}
}

class LPipe extends Pipe {
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

