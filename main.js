import fsync from 'node:fs';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

/*
    𝑃(𝐴 𝑜𝑟 𝐵) = 𝑃(𝐴) + 𝑃(𝐵) − 𝑃(𝐴 𝑎𝑛𝑑 𝐵)
    𝑃(𝐴|𝐵) = 𝑃(𝐴 𝑎𝑛𝑑 𝐵) 𝑃(𝐵)

    There is hanging promise error for game over. Sometimes.
*/

class Card {
    constructor(t, n, v, i) {
        this.type = t;
        this.name = n;
        this.value = v;
        this.index = i;
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
            { type: "spades", name: "10", value: -10 },
            { type: "spades", name: "Jack", value: 3 },
            { type: "spades", name: "Queen", value: -10 },
            { type: "spades", name: "King", value: -10 },
            { type: "hearts", name: "Ace", value: 1 },
            { type: "hearts", name: "2", value: 2 },
            { type: "hearts", name: "3", value: 3 },
            { type: "hearts", name: "4", value: 4 },
            { type: "hearts", name: "5", value: 5 },
            { type: "hearts", name: "6", value: 6 },
            { type: "hearts", name: "7", value: 7 },
            { type: "hearts", name: "8", value: 8 },
            { type: "hearts", name: "9", value: 9 },
            { type: "hearts", name: "10", value: -10 },
            { type: "hearts", name: "Jack", value: 3 },
            { type: "hearts", name: "Queen", value: -10 },
            { type: "hearts", name: "King", value: -10 },
            { type: "diamonds", name: "Ace", value: 1 },
            { type: "diamonds", name: "2", value: 2 },
            { type: "diamonds", name: "3", value: 3 },
            { type: "diamonds", name: "4", value: 4 },
            { type: "diamonds", name: "5", value: 5 },
            { type: "diamonds", name: "6", value: 6 },
            { type: "diamonds", name: "7", value: 7 },
            { type: "diamonds", name: "8", value: 8 },
            { type: "diamonds", name: "9", value: 9 },
            { type: "diamonds", name: "10", value: -10 },
            { type: "diamonds", name: "Jack", value: 3 },
            { type: "diamonds", name: "Queen", value: -10 },
            { type: "diamonds", name: "King", value: -10 },
            { type: "clubs", name: "Ace", value: 1 },
            { type: "clubs", name: "2", value: 2 },
            { type: "clubs", name: "3", value: 3 },
            { type: "clubs", name: "4", value: 4 },
            { type: "clubs", name: "5", value: 5 },
            { type: "clubs", name: "6", value: 6 },
            { type: "clubs", name: "7", value: 7 },
            { type: "clubs", name: "8", value: 8 },
            { type: "clubs", name: "9", value: 9 },
            { type: "clubs", name: "10", value: -10 },
            { type: "clubs", name: "Jack", value: 3 },
            { type: "clubs", name: "Queen", value: -10 },
            { type: "clubs", name: "King", value: -10 },
            { type: "joker", name: "Joker", value: -2 },
            { type: "joker", name: "Joker", value: -2 }
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
            if (this.cards[0] == undefined || this.cards.length == 0) return rej("Game over.");

            // Pick card up from deck and give the card to the player.
            // shift returns the element it removes the from 'top' (0th index)
            const card = this.cards.shift();
            player.addCard(card);

            const response = this.checkCard(card, player);
            response != 'self' ? res(true) : res('self');

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

    peekTopCard = () => { return this.cards[0]; }
    getCards = () => { return this.cards; }
    getCardCount = () => { return this.cards.length; }
}

class Player {
    constructor(n, c, w, tl, tr, pc, interact, pi) {
        this.name = n;
        this.colour = c;
        this.wins = w;
        this.cards = [];
        this.id = crypto.randomUUID(); // UUID v4.

        this.toLeft = tl; // integer 
        this.toRight = tr; // integer of player index in circle..? right!? going clockwise.
    
        this.isDealer = false;
        this.playerCount = pc;
        this.interact = interact;
        this.playerIndex = pi;

        this.timesAsDealer = 0;
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

    getRandomIndex() {
        return Math.floor(Math.random() * this.playerCount + 1);
    }

    determineRequestedIndex() {
        const requestedIndex = this.getRandomIndex();
        if (requestedIndex !== this.playerIndex) return requestedIndex;
        return Math.random() > 0.5 ? this.getToLeft() : this.getToRight();
    }

    // Decide what to do with the card you have been dealt.
    async decide(card, player) {
        const requestedIndex = this.determineRequestedIndex();
        await this.interact(card, this.getCardCount() - 1, player, requestedIndex);
    }

    queenTrade = async (index, player2) => {

        // give the card to the other player.
        this.give(index, player2);

        // Select three random cards to take from the other player.
        for (let i = 0; i < 3; i++) {

            // Select a random number based on the amount of cards they have.
            const count = player2.getCardCount();
            if (count == 0) continue;

            // Take the card from the other player.
            const cardSelected = Math.floor(Math.random() * (count - 1));
            await this.take(cardSelected, player2);
        }
    }

    // Take half of the other players hand.
    queenOfSpadesTrade = async (index, player2) => {
        // Trade for half of the other players hand or (n / 2) - 1 cards (where n is
        // total number of cards in their hand).
        // give the card to the other player.
        this.give(index, player2);

        const count = player2.getCardCount();
        const cc = (count / 2) - 1;
        const cards = cc > 3 ? cc : 3;

        // Select three random cards to take from the other player.
        // or (count/2)-1
        for (let i = 0; i < (count < 3 ? count : cards) ; i++) {

            // Select a random number based on the amount of cards they have.
            const count = player2.getCardCount();
            if (count == 0) continue;

            // Take the card from the other player.
            const cardSelected = Math.floor(Math.random() * (count - 1));
            await this.take(cardSelected, player2);
        }
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

    // Trade 1 for 1...or take!?
    trade = (index1, index2, otherPlayer) => {
        if (index1) this.give(index1, otherPlayer);
        if (index2) this.take(index2, otherPlayer);
    }

    addTimeAsDealer = () => { this.timesAsDealer++; }

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
            turnsAsDealer: 0, // essentially cards dealt
            index: 0,
            direction: 0, // clockwise, 1 is counter-clockwise.
        };
        this.turn = 0; // Index of the player (in this.players) whos turn it is.
        this.winner = undefined;

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
                this.interact,
                index
            );

            if (index === this.data.length - 1) player.setToLeft(0);
            if (index === 0) player.setToRight(this.data.length - 1); // the index of the last player (not yet created at this point).

            this.players.push(player);
        });

        // Determine the first dealer.
        const dealerIndex = Math.floor(Math.random() * (this.players.length - 1));
        this.dealer = {
            player: this.players[dealerIndex],
            turnsAsDealer: 0,
            index: dealerIndex,
        };
        this.turn = dealerIndex;
    }

    maybeSwitchDealer(player) {
        const wantsToStopDealing = Math.random() > 0.5;

        if (this.dealer.player.id == player.id) return;

        if (wantsToStopDealing || player.id != this.dealer.player.id) {
            this.switchDealer(player);
        }
    }

    switchDealer(player) {
        if (this.dealer.player.id == player.id) return;
        this.dealer.player.setIsDealer(false);
        player.setIsDealer(true);
        player.addTimeAsDealer();
        this.dealer.player = player;
        this.dealer.index = player.playerIndex;
        this.dealer.turnsAsDealer = 0;
    }

    updateDealDirection(direction) {
        this.dealer = { ...this.dealer, direction };
    }

    // start interactions with other players based on card received when applicable.
    interact = async (card, index, player, requestedIndex) => {

        const randomFloat = Math.random();
        const trade = randomFloat > 0.5;
        const isSpades = card.type == 'spades';
        const player2 = this.players[requestedIndex];

        switch (card.name) {
            case 'Queen':
                isSpades ? await player.queenOfSpadesTrade(index, player2) : trade ? await player.queenTrade(index, player, player2) : null;
                break;
            case 'Ace':
                if (isSpades) {
                    player.removeCard(index); // discard (no one can have the ace of spades).
                    this.maybeSwitchDealer(player); // use maybe because maybe the player just wants to discard the ace.
                }
                break;
            case 'Jack':
                this.maybeSwitchDealer(player); // Politely request to become dealer.
                break;
            default:
                break;
        }
    }

    nextTurn() {

        if (!this.dealer.direction) {
            if (this.turn + 1 == this.getPlayers().length) return this.turn = 0;
            this.turn++;
        } else if (this.dealer.direction) {
            if (this.turn - 1 < 0) return this.turn = this.getPlayers().length - 1;
            this.turn--;
        }

    }

    checkWinner() {
        let mostGrapples = 0;
        let winner = undefined;

        this.getPlayers().forEach(player => {
            const cards = player.getCards();
            if (cards.length == 0) return;
            let grapples = 0;
            cards.forEach(card => grapples += card.value);
            if (grapples > mostGrapples) this.winner = player;
        });

        console.warn('Winner:', this.winner.id, '\n', 'Times as Dealer:', this.winner.timesAsDealer);
    }

    addDealerTurn() { this.dealer.turnsAsDealer++; }
    getDealerTurns() { return this.dealer.turnsAsDealer; }
    getPlayers = () => { return this.players; }
    getTurn = () => { return this.turn; }
}

class Monitor2 {
    constructor(pm, d) {
        this.playerManager = pm;
        this.deck = d;
        this.log = ``;
    }

    log(value) {
        this.log += `${value}\n`;
        return this.log;
    }

    monitor() {

        // Who has the best odds of winning in the current game state?

        // Determine who has the most "Grapples." Does that tie into their odds of winning?

    }

    // https://www.geeksforgeeks.org/dsa/program-calculate-value-ncr/
    factorial(num) {
        if (num < 0) return 0;
        if (num <= 1) return 1;
        let result = 1;
        for (let i = 2; i <= num; i++) result *= i;
        return result;
    }

    // call with no arguments for current odds of getting 1 card.
    nCr(n = this.deck.cards.length, r = 1) {
        if (r < 0 || r > n) return 0;
        return Math.ceil(this.factorial(n) / (this.factorial(r) * this.factorial(n - r)));
    }
}

/*
class Monitor {
    constructor(pm, d) {
        this.playerManager = pm;
        this.deck = d;
    
        this.originalDeckCopy = { ...d }
        this.originalPlayerManager = { ...pm };

        this.allStates = [];
        this.current = {};
    }

    // total crap, way overengineered.
    nCr(n = this.deck.cards.length, r = 1) {
        // this.deck.cards.length
        // this.playerManager.turn
        // this.playerManager.winner

        //         n!
        //    -----------
        //    r! (n - r)!

        //          nF
        //    -------------
        //    ( rF )( dcF )

        //    nF  = n!
        //    dcF = (n - r)!
        //    rF = r!

        //    Where nF should have its values divided by either rF or dcF depening on which has more matching
        //    values in its factorial array, and where those values multiply to a larger value than rF/dcF (depening
        //    on what was chosen).

        const nF = this.getFactorialValues(n); // n!

        const dcF = [ ...nF ].splice(r, nF.length); // (n-r)!
        const nFdcFDivide = this.divideFactorials(nF, dcF);

        // nF is top value nF / rF, check for the cancellations between the arrays, the returned array is the left over values on top for use as nF in next step of equation. If, the length of this array 
        // is less then the dcFDivide array then this part should be determined canceled and dcF should be used on the current bottom value in multiplyFactorial.
        const rF = this.getFactorialValues(r); // r!
        const nFrFDivide = this.divideFactorials(nF, rF);

        const top = nFdcFDivide.length <= nFrFDivide.length ? nFdcFDivide : nFrFDivide;
        const bottom = nFdcFDivide.length >= nFrFDivide.length ? dcF : rF;

        // use the nFdcFDivide values...because it makes the most possible cancellations with the bottom array.
        // so the nFrFDivide portion of the equation now does not exist, it has been cancelled out, and the factorial values from rF are what multiply should be divided by (once rF is multipled).

        const tm = this.multiplyFactorial(top);
        const bm = this.multiplyFactorial(bottom);
        const oddsString = `${tm} / ${bm}`;
        const odds = tm / bm;
    }

    getFactorialValues(num) {
        const values = [];
        while (num > 0) {
            values.push(num);
            num--;
        }
        return values;
    }

    divideFactorials(fA1, fA2) {
        if (fA1[0] != fA1.length || fA2[0] != fA2.length || fA2[0] > fA1[0]) {
            console.error('not a full factorial', fA1, fA2);
            return false;
        }
        const fA1Copy = [ ...fA1 ];
        fA1Copy.splice(fA1[0] - fA2[0], fA2.length);
        return fA1Copy;
    }

    // ^^^ refer to divideFactorials() for documentation ^^^
    multiplyFactorial(fA) {
        let value = fA[0];
        for (let i = 1; i < fA.length; i++) {
            value *= fA[i];
        }
        return value;
    }
    
}
*/

class GameManager {
    constructor(data, times) {
        this.data = data;
        this.times = times;
        this.timesRan = 0;
        this.gameOver = false;

        this.init();
    }

    init() {
        this.playerManager = new PlayerManager(this.data);
        this.deck = new Deck();
        this.monitor = new Monitor2(this.playerManager, this.deck);
        this.startRunning();
    }

    async run() {
        while (this.deck.getCardCount() > 0 && this.running) {
            // dealer deals a card to the proper player (the player whos turn it is)
            // that player decides what to do with the card, or Deck() automatically
            // deals with the card.
            this.monitor.monitor();

            const player = this.playerManager.getPlayers()[this.playerManager.getTurn()];
            const response = {m:undefined};

            // Dealer Turn.
            if (this.playerManager.dealer.index == this.playerManager.turn) {

                // if it is the dealers turn the dealer has the option to...
                // look at the card,
                // then decide whether to give it to themself and choose the direction of deal,
                // or deal it to the next player in the circle.
                const randomNumber = Math.random();
                const lookAtCard = randomNumber > 0.5;
                let sway = 0.25;

                if (lookAtCard) {
                    sway = 0.15;
                    const card = this.deck.peekTopCard();
                    if (card.value < 1) sway = 0.5; // Don't keep the card.
                }

                if (randomNumber < sway) {
                    response.m = await this.deck.deal(this.playerManager.getPlayers()[player.getToLeft()]);
                    this.playerManager.updateDealDirection(0);
                    this.playerManager.nextTurn(); // skip the player who just got 'the dealers card.'
                }

                if (sway <= randomNumber && randomNumber <= 1 - sway) {
                    response.m = await this.deck.deal(player);
                    this.playerManager.updateDealDirection(randomNumber > 0.5 ? 0 : 1);
                }

                if (randomNumber > 1 - sway) {
                    response.m = await this.deck.deal(this.playerManager.getPlayers()[player.getToRight()]);
                    this.playerManager.updateDealDirection(1);
                    this.playerManager.nextTurn(); // move to the player who just got 'the dealers card.'
                }

            } else {
                response.m = await this.deck.deal(player);
            }

            if (response.m != 'self') {
                this.playerManager.nextTurn(); // potentially skip any players that got dealers cards.
                this.playerManager.addDealerTurn();
            }

            // check for out of range.
            let newIndex = 1;
            let pl = this.playerManager.players.length;
            let di = this.playerManager.dealer.index;
            if (di + newIndex == pl) newIndex = newIndex - pl;

            let newDealer = this.playerManager.getPlayers()[di + newIndex];
            if (this.playerManager.getDealerTurns() == 8) this.playerManager.switchDealer(newDealer);

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
        this.playerManager.checkWinner();
        if (this.timesRan < this.times) this.reset();
    }

    reset() {
        this.init();
        this.startRunning();
    }

    getRunning = () => { return this.running; }

}

new GameManager(
    [
        { name: "PlayerOne", colour: "blue", wins: 15 },
        { name: "PlayerTwo", colour: "red", wins: 12 },
        { name: "PlayerThree", colour: "green", wins: 18 }
    ],
    1 // Amount of simulated games to run.
);