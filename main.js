/*
    𝑃(𝐴 𝑜𝑟 𝐵) = 𝑃(𝐴) + 𝑃(𝐵) − 𝑃(𝐴 𝑎𝑛𝑑 𝐵)
    𝑃(𝐴|𝐵) = 𝑃(𝐴 𝑎𝑛𝑑 𝐵) 𝑃(𝐵)
*/

class Card {
    constructor(t, n, v, i) {
        this.type = t;
        this.name = n;
        this.value = v;
        this.index = i;
    }
}

/*
switch (this.type) {
    case 'spades':
        break;
    case 'clubs':
        break;
    case 'diamonds':
        break;
    case 'hearts':
        break;
    case 'joker':
        break;
    default:
        console.log('no type?');
        break;
}

switch (this.name) {
    case 'Ace':
        break;
    case '2':
        break;
    case '3':
        break;
    case '4':
        break;
    case '5':
        break;
    case '6':
        break;
    case '7':
        break;
    case '8':
        break;
    case '9':
        break;
    case '10':
        break;
    case 'Jack':
        break;
    case 'Queen':
        break;
    case 'King':
        break;
    case 'Joker':
        break;
}

*/

class Dealer {
    constructor() {
        this.player = undefined;
        this.deck = new Deck();
    }


}

class Deck {
    constructor() {
        this.data = [
            { type: "spades", name: "Ace", value: 1 },
            { type: "spades", name: "2", value: 2 },
            { type: "spades", name: "3", value: 3 },
            { type: "spades", name: "4", value: 4 },
            { type: "spades", name: "5", value: 5 },
            { type: "spades", name: "6", value: 6 },
            { type: "spades", name: "7", value: 7 },
            { type: "spades", name: "8", value: 8 },
            { type: "spades", name: "9", value: 9 },
            { type: "spades", name: "10", value: 10 },
            { type: "spades", name: "Jack", value: 0 },
            { type: "spades", name: "Queen", value: 10 },
            { type: "spades", name: "King", value: 10 },
            { type: "hearts", name: "Ace", value: 1 },
            { type: "hearts", name: "2", value: 2 },
            { type: "hearts", name: "3", value: 3 },
            { type: "hearts", name: "4", value: 4 },
            { type: "hearts", name: "5", value: 5 },
            { type: "hearts", name: "6", value: 6 },
            { type: "hearts", name: "7", value: 7 },
            { type: "hearts", name: "8", value: 8 },
            { type: "hearts", name: "9", value: 9 },
            { type: "hearts", name: "10", value: 10 },
            { type: "hearts", name: "Jack", value: 0 },
            { type: "hearts", name: "Queen", value: 10 },
            { type: "hearts", name: "King", value: 10 },
            { type: "diamonds", name: "Ace", value: 1 },
            { type: "diamonds", name: "2", value: 2 },
            { type: "diamonds", name: "3", value: 3 },
            { type: "diamonds", name: "4", value: 4 },
            { type: "diamonds", name: "5", value: 5 },
            { type: "diamonds", name: "6", value: 6 },
            { type: "diamonds", name: "7", value: 7 },
            { type: "diamonds", name: "8", value: 8 },
            { type: "diamonds", name: "9", value: 9 },
            { type: "diamonds", name: "10", value: 10 },
            { type: "diamonds", name: "Jack", value: 0 },
            { type: "diamonds", name: "Queen", value: 10 },
            { type: "diamonds", name: "King", value: 10 },
            { type: "clubs", name: "Ace", value: 1 },
            { type: "clubs", name: "2", value: 2 },
            { type: "clubs", name: "3", value: 3 },
            { type: "clubs", name: "4", value: 4 },
            { type: "clubs", name: "5", value: 5 },
            { type: "clubs", name: "6", value: 6 },
            { type: "clubs", name: "7", value: 7 },
            { type: "clubs", name: "8", value: 8 },
            { type: "clubs", name: "9", value: 9 },
            { type: "clubs", name: "10", value: 10 },
            { type: "clubs", name: "Jack", value: 0 },
            { type: "clubs", name: "Queen", value: 10 },
            { type: "clubs", name: "King", value: 10 },
            { type: "joker", name: "Joker 1", value: 0 },
            { type: "joker", name: "Joker 2", value: 0 }
        ];
        this.cards = [];

        this.data.forEach((item, index) => {
            const card = new Card(
                item.type,
                item.name,
                item.value,
                index
            );
            this.cards.push(card);
        });

        this.init();
    }

    init() {
        this.cards = []; // for replay.
        this.data.forEach((item, index) => {
            const card = new Card(
                item.type,
                item.name,
                item.value,
                index
            );
            this.cards.push(card);
        });
        this.shuffle();
    }

    // https://www.geeksforgeeks.org/dsa/shuffle-a-given-array-using-fisher-yates-shuffle-algorithm/
    // Fisher-Yates shuffle.
    shuffle() {
        const { cards } = this;
        for (let i = cards.length - 1; i >= 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        this.cards = cards;
    }

    deal(player) {

        return new Promise((res, rej) => {
            if (this.cards[0] == undefined) {
                rej("Game over.");
            }

            if (player.isDealer) {
                console.log(player, 'this play is a dealer');
            }

            // Pick card up from deck and give the card to the player.
            // shift returns the element it removes the from 'top' (0th index)
            const card = this.cards.shift();

            player.addCard(card);
            const response = this.checkCard(card, player);

            if (response != 'self') {
                res(true);
            } else {
                res(true);
                console.warn('here', card);
            }

        });

    }

    // perform automatic checking for things players can't ask for because this is code, not real life card game with friends.
    checkCard(card, player) {
        switch (card.name) {
            case 'Joker':
            case '2':
                this.deal(player);
                return 'self';
            default:
                break;
        }

        player.decide(card);
    }

    getCards() { return this.cards; }
    getCardCount() { return this.cards.length; }
}

class Player {
    constructor(n, c, w, tl, tr) {
        this.name = n;
        this.colour = c;
        this.wins = w;
        this.cards = [];

        this.toLeft = tl; // integer 
        this.toRight = tr; // integer of player index in circle..? right!? going clockwise.
    
        this.isDealer = false;
    }

    addCard(card) {
        this.cards.push(card);
    }

    removeCard(index) {
        this.cards.splice(index, 1); // remove 1 card at specified index.
    }

    // decide what to do with the card you have been dealt.
    decide(card) {
        // 2s and jokers automatically dealt with, as well as cards with value as name (numbers)
        switch (card.name) {
            case 'Queen':
                break;
            case 'Ace':
                break;
            default:
                break;
        }
    }

    setToLeft(value) { this.toLeft = value; }
    setToRight(value) { this.toRight = value; }
    setIsDealer(value) { this.isDealer = value; }

    getToLeft() { return this.toLeft; }
    getToRight() { return this.toRight; }
    getWins() { return this.wins; }
    getName() { return this.name; }
    getColour() { return this.colour; }
    getCards() { return this.cards; } // for eventual probability testing, with different paths.
    getIsDealer() { return this.isDealer; }
}

class Monitor {
    constructor() {


        // the states saved at the beginning and end of the most recent cycle.
        this.currentStart = undefined;
        this.currentEnd = undefined;

    }

    start() {

    }

    end() {

    }

    compare() {

    }

}

class Game {
    constructor(data) {
        this.data = data;
        this.dealer = undefined; // The current dealer (a player instance).
        this.players = []; // In order from dealer to left of dealer all the way around the circle.
        this.turn = 0;
        this.deck = new Deck();
        this.monitor = new Monitor();

        this.init();
    }

    init() {

        this.players = [];

        // Create players from player data.
        this.data.forEach((index, item) => {
            const player = new Player(item.name, item.colour, item.wins)

            player.setToLeft(index + 1);
            player.setToRight(index - 1);

            if (index === this.data.length - 1) player.setToLeft(0);
            if (index === 0) player.setToRight(data.length - 1); // the index of the last player (not yet created at this point).
        
            this.players.push(player);
        });

        // Determine the first dealer.
        const dealerIndex = Math.floor(Math.random() * (this.players.length - 1));
        this.dealer = this.players[dealerIndex];
        this.turn = dealerIndex;

        this.startRunning();
    }

    async run() {
        while (this.deck.getCardCount() > 0 && this.running) {
            this.monitor.start();

            // dealer deals a card to the proper player (the player whos turn it is)
            // that player decides what to do with the card, or Deck() automatically
            // deals with the card.

            const player = this.players[this.turn];
            const response = await this.deck.deal(player);
            
            console.log(response);

            this.nextTurn();

            this.monitor.end();
        }
    }

    reset() {
        this.deck.init();
        this.init();
    }

    switchDealer(player) {
        // references the player instance held inside the this.players array.
        this.dealer.setIsDealer(false);
        player.setIsDealer(true);
        this.dealer = player;
    }

    startRunning() { 
        this.running = true;
        this.run();
    }

    nextTurn() {
        if (this.turn + 1 == this.players.length - 1) return this.turn = 0;
        this.turn++;
    }
    getTurn() { return this.turn; }

    stopRunning() { this.running = false; }
}

new Game([
    { name: "PlayerOne", colour: "blue", wins: 15 },
    { name: "PlayerTwo", colour: "red", wins: 12 },
    { name: "PlayerThree", colour: "green", wins: 18 },
    { name: "PlayerFour", colour: "purple", wins: 20 }
]);

// run tests on game with lots of stuff and things!