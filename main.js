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

    async deal(player) {

        return new Promise((res, rej) => {
            if (this.cards[0] == undefined) {
                rej("Game over.");
            }

            // Pick card up from deck and give the card to the player.
            // shift returns the element it removes the from 'top' (0th index)
            const card = this.cards.shift();

            player.addCard(card);
            const response = this.checkCard(card, player);

            if (response != 'self') {
                res(true);
            } else {
                res('self');
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


        player.decide(card, player);
    }

    getCards = () => { return this.cards; }
    getCardCount = () => { return this.cards.length; }
}

class Player {
    constructor(n, c, w, tl, tr, pc, interact) {
        this.name = n;
        this.colour = c;
        this.wins = w;
        this.cards = [];

        this.toLeft = tl; // integer 
        this.toRight = tr; // integer of player index in circle..? right!? going clockwise.
    
        this.isDealer = false;
        this.playerCount = pc;
        this.interact = interact;
    }

    // Returns push so you get new length of array.
    addCard(card) {
        return this.cards.push(card);
    }

    // Returns splice to get array of deleted elements
    // Access the 'deleted' card at x[0];
    removeCard(index) {
        return this.cards.splice(index, 1); // remove 1 card at specified index.
    }

    // decide what to do with the card you have been dealt.
    async decide(card, player) {
        // console.log('Card:', card == undefined ? 'IT IS UNDEFINED' : false, 'Player:', player == undefined ? 'IT IS UNDEFINED' : false);
        // 2s and jokers automatically dealt with, as well as cards with value as name (numbers)
        // choose random player with Math.random() * this.playerCount, the player count should be passed.
        // console.log(typeof requestedIndex == 'number' ? true : 'IT IS NOT A NUMBER');
        const requestedIndex = Math.floor(Math.random() * this.playerCount);  // If needed for now.
        await this.interact(card, this.getCardCount() - 1, player, requestedIndex);
    }

    queenTrade = async (index, player1, player2) => {

        if (index == undefined || player1 == undefined || player2 == undefined) {
            console.log(index, player1, player2);
        }

        // give the card to the other player.
        this.give(index, player2);

        // select three random cards to take from the other player.
        for (let i = 0; i < 3; i++) {

            // select a random number based on the amount of cards they have
            const count = player2.getCardCount();

            if (count == 0) continue;

            console.log(count, player2.getCards());

            const cardSelected = Math.floor(Math.random() * (count - 1));

            await this.take(cardSelected, player2);

        }
    }

    queenOfSpadesTrade = (card, player1, player2) => {
        // trade for half of the other players hand or (n - 1) / 2 cards (where n is
        // total number of cards in their hand).
    }

    // otherPlayer references a player object.
    take = async (index, otherPlayer) => new Promise((res, rej) => {
        // take a card from a player at a certain index
        this.addCard(otherPlayer.getCards()[index]);
        otherPlayer.removeCard(index);
        res(true);
    });

    // otherPlayer references a player object.
    give = (index, otherPlayer) => {
        // give a card to a player from a certain index in your cards.
        otherPlayer.addCard(this.getCards()[index]);
        this.removeCard(index);
    }

    // trade 1 for 1
    // index1 and index2 are indexes of cards to be traded
    // index1 is the Player instance card to trade, and index2 is the otherPlayer
    // card instance to trade.
    // otherPlayer is the player object to trade with.
    trade = (index1, index2, otherPlayer) => {
        if (index1) this.give(index1, otherPlayer);
        if (index2) this.take(index2, otherPlayer);
    }

    setToLeft(value) { this.toLeft = value; }
    setToRight(value) { this.toRight = value; }
    setIsDealer(value) { this.isDealer = value; }

    getToLeft = () => { return this.toLeft; }
    getToRight = () => { return this.toRight; }
    getWins = () => { return this.wins; }
    getName = () => { return this.name; }
    getColour = () => { return this.colour; }
    getCards = () => { return this.cards; } // for eventual probability testing, with different paths.
    getIsDealer = () => { return this.isDealer; }
    getCardCount = () => { return this.cards.length; }
}

class PlayerManager {
    constructor(data) {
        this.data = data;
        this.players = [];
        this.dealer = {
            player: undefined,
            turnsAsDealer: 0,
            index: 0,
        };
        this.turn = 0; // Index of the player (in this.players) whos turn it is.

        this.init();
    }

    init() {
        // Create players from player data.
        this.players = [];
        this.data.forEach((item, index) => {
            const player = new Player(
                item.name,
                item.colour,
                item.wins,
                index + 1,
                index - 1,
                this.players.length,
                this.interact
            );

            if (index === this.data.length - 1) player.setToLeft(0);
            if (index === 0) player.setToRight(this.data.length - 1); // the index of the last player (not yet created at this point).

            this.players.push(player);
        });

        // Determine the first dealer.
        const dealerIndex = Math.floor(Math.random() * (this.players.length - 1));
        this.dealer = this.players[dealerIndex];
        this.turn = dealerIndex;
    }

    maybeSwitchDealer(player) {
        const wantsToStopDealing = Math.random() > 0.5;

        if (wantsToStopDealing) {
            this.switchDealer(player);
        }
    }

    switchDealer(player) {
        this.dealer.setIsDealer(false);
        player.setIsDealer(true);
        this.dealer = player;
    }

    // start interactions with other players based on card received.
    interact = async (card, index, player, requestedIndex) => {

        if (card == undefined || index == undefined || player == undefined || requestedIndex == undefined) {
            console.log(card, index, player, requestedIndex);
        }

        const randomFloat = Math.random();
        const trade = randomFloat > 0.5;
        const isSpades = card.type == 'Spades';
        const player2 = this.players[requestedIndex];

        switch (card.name) {
            case 'Queen':
                trade ? await player.queenTrade(index, player, player2) : null;
                break;
            case 'Ace':
                // place on table etc. using Table();
                isSpades ? true : false;
                break;
            default:
                // Log information about the interact() use.
                break;
        }

        
    }

    nextTurn() {
        if (this.turn + 1 == this.getPlayers().length - 1) return this.turn = 0;
        this.turn++;
    }

    addDealerTurn() { this.dealer.turnsAsDealer++; }
    getDealerTurns() { return this.dealer.turnsAsDealer; }
    getPlayers = () => { return this.players; }
    getTurn = () => { return this.turn; }
}

class Game {
    constructor(data, times) {
        this.data = data;
        this.times = times;
        this.timesRan = 0;

        this.playerManager = new PlayerManager(data); // In order from dealer to left of dealer all the way around the circle.
        this.deck = new Deck(); // the deck of cards.
        // this.monitor = new Monitor(); // Logging

        this.startRunning();
    }

    init() {
        this.playerManager = new PlayerManager(this.data);
        this.deck = new Deck();
        // this.monitor = new Monitor();
    }

    async run() {
        while (this.deck.getCardCount() > 0 && this.running) {
            // this.monitor.start();

            // dealer deals a card to the proper player (the player whos turn it is)
            // that player decides what to do with the card, or Deck() automatically
            // deals with the card.

            const player = this.playerManager.getPlayers()[this.playerManager.getTurn()];
            const response = await this.deck.deal(player);

            if (response != 'self') this.playerManager.nextTurn();

            if (response != 'self') this.playerManager.addDealerTurn();

            if (this.playerManager.getDealerTurns() > 4) {

                // set the 


                this.playerManager.switchDealer(
                    this.playerManager.getPlayers()[]
                );
            }



            // this.monitor.end();
        }
        this.stopRunning();
    }

    startRunning() {
        this.running = true;
        this.timesRan++;
        this.run();
    }

    stopRunning() {
        this.running = false;
        this.checkWinner();
    }

    checkWinner() {
        const players = this.playerManager.getPlayers();

        let mostGrapples = 0;
        let winner = undefined;

        players.forEach(player => {

            const cards = player.getCards();

            let grapples = 0;

            cards.forEach(card => {
                grapples += card.value;
            });

            if (grapples > mostGrapples) winner = player;
        });

        console.log(winner);

        if (this.timesRan < this.times) this.reset();
    }

    reset() {
        this.init();
        this.startRunning();
    }



}

// Game runs automatically with 4 players X times.
new Game(
    [
        { name: "PlayerOne", colour: "blue", wins: 15 },
        { name: "PlayerTwo", colour: "red", wins: 12 },
        { name: "PlayerThree", colour: "green", wins: 18 },
        { name: "PlayerFour", colour: "purple", wins: 20 }
    ],
    4 // Amount of simulated games to run.
);

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

// Manager class of the cards with special abilities.
/*
class Table {
    constructor() {
        this.aceOfSpades = {
            onTable: false,
            playerOwner: undefined, // reference to player object
            card: undefined,
            redeemable: true,
            discarded: false,
            turnsLeft: 3
        }
        this.copy = this.aceOfSpades.copy();
    }

    placeOnTable(playerOwner, card) {

        this.aceOfSpades = {
            onTable: true,
            playerOwner,
            card
        }

    }

    // Place in discard pile.
    removeFromTable() {
        this.aceOfSpades = this.copy;
    }

    manageAceOfSpades(player, card) {
        if (!this.aceOfSpades.redeemable) return false;
        if (!this.aceOfSpades.onTable) return false;
        if (playerOwner.name != player.name) return false;

        // check the turns
        //remove a turn

        if (this.aceOfSpades.turnsLeft - 1 < 0) {
            this.removeFromTable(player, card)    
            return false;
        }
        this.aceOfSpades.turnsLeft--;
    }
}
*/


// run tests on game with lots of stuff and things!