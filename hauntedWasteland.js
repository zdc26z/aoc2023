// Day 8:  Haunted Wasteland

const { open } = require('node:fs/promises');
const LR = { 'L': 0, 'R': 1 };

(async () => {
  const file = await open('./inputs/8.txt');
  const instructions = [];
  const nodes = {};

  for await( const line of file.readLines() ) {
    if( ! instructions.length ) {
      instructions.push( ...line.split('') );
    } else if( line.length ) {
      [ key, values ] = line.split(' = ');
      nodes[ key.trim() ] = values.substring( values.indexOf( '(' ) + 1, values.indexOf( ')' ) )
                                  .split(', ');
    }
  }

  var steps = 0;
  var currentNode = 'AAA';

  while( currentNode !== 'ZZZ' ) {
    const index = steps % instructions.length;
    const instruction = instructions[ index ];
    currentNode = nodes[ currentNode ][ LR[ instruction ] ];
    steps++;
  }

  console.log('Part 1:  Got to ZZZ in ' + steps + ' steps.');

  steps = [];
  var currentNodes = findStartingNodes( nodes );

  for( let i=0; i < currentNodes.length; i++ ) {
    steps.push( findPath( currentNodes[i], nodes, instructions ) );
  }
  let total = lcm( ...steps );

  console.log('Part 2:  Got to Z nodes in ' + total + ' steps.');
})();

function findStartingNodes( nodes ) {
  const startingNodes = [];
  Object.keys( nodes ).forEach( key => {
    if( key[2] === 'A' ) {
      startingNodes.push( key )
    }
  } );
  return startingNodes;
}

function findPath( start, nodes, instructions ) {
  var steps = 0;
  var currentNode = start;

  while( currentNode[2] !== 'Z' ) {
    const instruction = instructions[ steps % instructions.length ];
    currentNode = nodes[ currentNode ][ LR[ instruction ] ];
    steps++;
  }
  return steps;
}

function lcm() {
  if( arguments.length > 2 ) {
    var args = Object.values( arguments );
    var a = args.shift();
    var b = lcm( ...args );
  } else {
    var a = arguments[0];
    var b = arguments[1];
  }
  return (a / gcd( a, b )) * b;
}

function gcd(a, b) {
  if( b === 0 ) {
    return a;
  }
  return gcd( b, a % b );
}

