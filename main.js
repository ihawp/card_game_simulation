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

        this.init();
    }

    init() {
        this.cards = []; // for replay.
        this.data.forEach((item, index) => {
            this.cards.push(
                new Card(
                    item.type,
                    item.name,
                    item.value,
                    index
                )
            );
        });

        this.shuffle();
    }

    // https://www.geeksforgeeks.org/dsa/shuffle-a-given-array-using-fisher-yates-shuffle-algorithm/
    shuffle() {
        console.log(this.cards);
        for (let i = this.cards.length - 1; i >= 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let k = this.cards[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = k;
            // [arr[i], arr[j]] = [arr[j], arr[i]] not a fan of this.
        }
        console.log(this.cards);
    }

    deal(player) {

        // Pick card up from deck and give the card to the player.
        // shift returns the element it removes the from 'top' (0th index)
        const card = this.cards.shift();
        player.addCard(card);
        player.decide(card);
    }

    getCards() { return this.cards; }
    getCardCount() { return this.cards.length; }
}

class Player {
    constructor(n, c, w, tl, tr) {
        // Info would be attached to session, or at least pulled from database.
        this.name = n;
        this.colour = c;
        this.wins = w;
        this.cards = [];

        this.toLeft = tl; // integer 
        this.toRight = tr; // integer of player index in circle..? right!?
    
        this.isDealer = false;
    }

    addCard(card) {
        this.cards.push(card);
    }

    removeCard(index) {
        this.cards.splice(index, 1); // remove 1 card at specified index.
    }

    // decide what to do with the card you have been dealt.
    decide() {

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

class Game {
    constructor(data) {
        this.data = data;
        this.dealer = undefined; // The current dealer (a player instance).
        this.players = []; // In order from dealer to left of dealer all the way around the circle.
        this.turn = 0;
        this.deck = new Deck();

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

        this.startRunning();
    }

    run() {
        while (this.deck.getCardCount() > 0 && this.running) {
            this.deck.deal(this.dealer);
            console.log(this.deck.getCards());

            this.monitor();
        }
    }

    monitor() {
        // Monitor the game stats in real time to find probability statistics.
        console.log('bananaphone');
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

    nextTurn() { this.turn++; }
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