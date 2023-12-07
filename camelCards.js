// Day 7:  Camel Cards

const { open } = require('node:fs/promises');

(async () => {
	const file = await open('./inputs/7.txt');
	const hands = [];
	const wildHands = [];

	for await( const line of file.readLines() ) {
		hands.push( parseLine( line ) );
		wildHands.push( parseLine( line, true ) );
	}

	hands.sort( sortHands );
	wildHands.sort( sortHands );

	var winnings = 0;

	for( let i=0; i < hands.length; i++ ) {
		let rank = i+1;
		winnings += hands[i].bid * rank;
	}

	console.log('Part 1:  Total winnings $' + winnings);

	winnings = 0;

	for( let i=0; i < wildHands.length; i++ ) {
		let rank = i+1;
		winnings += wildHands[i].bid * rank;
	}

	console.log('Part 2:  Total winnings $' + winnings);
})();

function sortHands( a, b ) {
	let aDec = Number.parseInt( a.rank, 13 );
	let bDec = Number.parseInt( b.rank, 13 );

	return aDec - bDec;
}

function parseLine( line, jokers = false ) {
	const hand = line.split( ' ' ).filter( Boolean );
	return new Hand( hand[0], Number.parseInt( hand[1] ), jokers );
}

class Hand {
	bid;
	cards;
	type;
	rank;
	jokers;

	HANDS = {
		'HIGHCARD': 1,
		'PAIR': 2,
		'TWOPAIR': 3,
		'THREEOFAKIND': 4,
		'FULLHOUSE': 5,
		'FOUROFAKIND': 6,
		'FIVEOFAKIND': 7,
	}

	VALUES = {
		'2': '0',
		'3': '1',
		'4': '2',
		'5': '3',
		'6': '4',
		'7': '5',
		'8': '6',
		'9': '7',
		'T': '8',
		'J': '9',
		'Q': Number.parseInt( 10 ).toString( 13 ),
		'K': Number.parseInt( 11 ).toString( 13 ),
		'A': Number.parseInt( 12 ).toString( 13 ),
	}

	JOKERVALUES = {
		'J': '0',
		'2': '1',
		'3': '2',
		'4': '3',
		'5': '4',
		'6': '5',
		'7': '6',
		'8': '7',
		'9': '8',
		'T': '9',
		'Q': Number.parseInt( 10 ).toString( 13 ),
		'K': Number.parseInt( 11 ).toString( 13 ),
		'A': Number.parseInt( 12 ).toString( 13 ),
	}

	constructor( cards, bid, jokers = false ) {
		this.cards = cards.split('');
		this.bid = bid;
		this.jokers = jokers;
		this.#rankCards();
	}

	#rankCards() {
		let counts = [];
		let rankedCards = '';
		for( const card of this.cards ) {
			if( this.jokers ) {
				rankedCards += this.JOKERVALUES[card];
			} else {
				rankedCards += this.VALUES[card];
			}
			if( card in counts ) {
				counts[ card ]++;
			} else {
				counts[ card ] = 1;
			}
		}

		if( this.jokers && 'J' in counts ) {
			var bestCard = false;
			var max = 0;
			var jokers = counts.J;
			delete counts.J;
			Object.entries( counts ).forEach( entry => {
				const [ card, count ] = entry;
				if( count > max ) {
					bestCard = card;
					max = count;
				}
			} );

			counts[ bestCard ] += jokers;
		}

		let cardTypes = Object.keys( counts ).length;
		if( cardTypes === 1 ) {
			// Only one type of card, must by 5 of a kind.
			this.type = 'FIVEOFAKIND';
			this.rank = this.HANDS.FIVEOFAKIND + rankedCards;
			return;
		} else if ( cardTypes === 2 ) {
			// Two types of cards, either 4 of a kind or full house.
			let highCount = Math.max( ...Object.values( counts ) );
			if( highCount === 4 ) {
				this.type = 'FOUROFAKIND';
				this.rank = this.HANDS.FOUROFAKIND + rankedCards;
				return;
			} else {
				this.type = 'FULLHOUSE';
				this.rank = this.HANDS.FULLHOUSE + rankedCards;
				return;
			}
		} else if ( cardTypes === 3 ) {
			// 3 types of cards, either 3 of a kind or 2 pair.
			let highCount = Math.max( ...Object.values( counts ) );
			if( highCount === 3 ) {
				this.type = 'THREEOFAKIND';
				this.rank = this.HANDS.THREEOFAKIND + rankedCards;
				return;
			} else {
				this.type = 'TWOPAIR';
				this.rank = this.HANDS.TWOPAIR + rankedCards;
				return;
			}
		} else if ( cardTypes === 4 ) {
			this.type = 'PAIR';
			this.rank = this.HANDS.PAIR + rankedCards;
			return;
		} else {
			this.type = 'HIGHCARD';
			this.rank = this.HANDS.HIGHCARD + rankedCards;
			return;
		}
	}
}
