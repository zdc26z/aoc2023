// Day 4:  Scratch Cards

const { open } = require('node:fs/promises');

(async () => {
	const file = await open('./inputs/4.txt');
	const cards = [[]]; // To 1-index the array
	var points = 0;

	for await (const line of file.readLines()) {
		const { winningNumbers, myNumbers } = parseCard( line );
		// Assume the card label is correct.
		cards.push( new Card( winningNumbers, myNumbers ) );
		points += calcPoints( winningNumbers, myNumbers );
	}
	winMoreCards( cards );
	console.log('Part 1:  total points ' + points);
	console.log('Part 2:  total number of cards is ' + countAllCards( cards ));
})();

function calcPoints( winningNumbers, myNumbers ) {
	var points = 0;
	for( number of myNumbers ) {
		if( winningNumbers.includes( number ) ) {
			if( ! points ) {
				points = 1;
			} else {
				points *= 2;
			}
		}
	}
	return points;
}

function countWinners( card ) {
	var count = 0;
	for( number of card.myNumbers ) {
		if( card.winningNumbers.includes( number ) ) {
			count++;
		}
	}
	return count;
}

function winMoreCards( cards ) {
	for(let i=1; i<cards.length; i++) {
		const winners = countWinners( cards[i] );
		for(let j=0; j < cards[i].copies; j++) {
			for(let k=i+1; k <= i + winners; k++) {
				cards[k].copy();
			}
		}
	}
}

function countAllCards( cards ) {
	var count = 0;
	for(let i=1; i < cards.length; i++ ) {
		count += cards[i].copies;
	}
	return count;
}

function parseCard( card ) {
	// Strip the game label (for now?)
	card = card.substring( card.indexOf(':') + 1 );
	const pipe = card.indexOf('|');
	const winningNumbers = card.substring(0, pipe).trim().split(' ').filter(Boolean).map( (n) => Number.parseInt(n) );
	const myNumbers = card.substring(pipe + 1).trim().split(' ').filter(Boolean).map( (n) => Number.parseInt(n) );
	return { winningNumbers, myNumbers };
}

class Card {
	copies = 1;
	winningNumbers;
	myNumbers;

	constructor( winningNumbers, myNumbers ) {
		this.winningNumbers = winningNumbers;
		this.myNumbers = myNumbers;
	}

	copy() {
		this.copies++;
	}
}
