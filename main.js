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
        this.id = crypto.randomUUID();
    }
}

class Deck {
    constructor(l) {
        this.logger = l;
        this.data = [
            { type: "spades", name: "Ace", value: 0 },
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
        return new Promise(async (res, rej) => {
            if (this.cards[0] == undefined || this.cards.length == 0) return rej("Game over.");

            // Pick card up from deck and give the card to the player.
            // shift returns the element it removes the from 'top' (0th index)
            const card = this.cards.shift();

            if (this.logger.getKV('receivedCards') == undefined) {
                this.logger.logKV('receivedCards', []);
            }
            this.logger.log[this.logger.getTurn()]['receivedCards'].push(card.id);

            player.addCard(card);

            const response = await this.checkCard(card, player);
            response != 'self' ? res(true) : res('self');

        });
    }

    // perform automatic checking for things players can't ask for because this is code, not real life card game with friends.
    async checkCard(card, player) {

        switch (card.name) {
            case 'Joker':
            case '2':
                try {
                    await this.deal(player);
                } catch (error) {
                    console.log(error);
                }
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
    constructor(n, c, w, tl, tr, pc, interact, pi, l) {
        this.name = n;
        this.colour = c;
        this.wins = w;
        this.cards = [];
        this.id = crypto.randomUUID(); // UUID v4.

        this.image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQVktBlaScn2b61HilE6uEhDoEHJaz6K8noQ&s";

        this.toLeft = tl; // integer 
        this.toRight = tr; // integer of player index in circle..? right!? going clockwise.
    
        this.isDealer = false;
        this.playerCount = pc;
        this.interact = interact;
        this.playerIndex = pi;
        this.logger = l;

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

    queenTrade = async (index, player2, count) => {

        // give the card to the other player.
        this.give(index, player2);

        // Select three random cards to take from the other player.
        let cardsSelected = [];
        for (let i = 0; i < count; i++) {

            // Select a random number based on the amount of cards they have.
            const count = player2.getCardCount();
            if (count == 0) continue;

            // Take the card from the other player.
            const cardSelected = Math.floor(Math.random() * (count - 1));
            cardsSelected.push(await this.take(cardSelected, player2));
        }
        this.logger.logKV('cardsSelected', cardsSelected);
    }

    // Take about half of the other players hand.
    queenOfSpadesTrade = async (index, player2) => {
        const count = player2.getCardCount();
        const cc = Math.floor(count / 2);
        const cards = cc > 3 ? cc : 3;
        const final = count < 3 ? count : cards;
        this.queenTrade(index, player2, final);
    }

    // otherPlayer references a player object.
    take = async (index, otherPlayer) => {
        const takeCard = otherPlayer.getCards()[index];
        this.addCard(takeCard);
        otherPlayer.removeCard(index);
        return takeCard.id;
    }

    // otherPlayer references a player object.
    give = (index, otherPlayer) => {
        // give a card to a player from a certain index in your cards.
        otherPlayer.addCard(this.getCards()[index]);
        this.removeCard(index);
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
    constructor(d, l) {
        this.data = d;
        this.logger = l;
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
                index,
                this.logger
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
        this.logger.logKV('switchDealer', player.playerIndex);
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
                if (trade) {
                    this.logger.logKV('queenTrade', true);
                    if (isSpades) {
                        this.logger.logKV('queenOfSpadesTrade', true);
                        await player.queenOfSpadesTrade(index, player2);
                        return;
                    }
                    await player.queenTrade(index, player2);
                }
                break;
            case 'Ace':
                if (isSpades) {
                    player.removeCard(index); // discard (no one can have the ace of spades).
                    this.logger.logKV('removeAceOfSpades', true);
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

        // if this.dealer.direction is 0 then the game is going clockwise
        // if it is 1 then the game is going counter-clockwise.

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

        this.logger.logKV('winner', this.winner.id);

        console.warn('Winner:', this.winner.id, '\n', 'Times as Dealer:', this.winner.timesAsDealer);
    }

    addDealerTurn() { this.dealer.turnsAsDealer++; }
    getDealerTurns() { return this.dealer.turnsAsDealer; }
    getDealDirection() { return this.dealer.direction; }
    getPlayers = () => { return this.players; }
    getTurn = () => { return this.turn; }
}

class Logger {
    constructor() {
        this.log = {};
        this.turn = 1;
    }

    /*
        highestGrapples
        expectedValues
        isDealerTurn
        peekingCard
        dealtLeft
        dealtRight
        dealtSelf
        chooseDirection
        tradingQueen
        tradingQueenOfSpades
        aceOfSpadesForDealer
    */
    logKV(key, value) {
        this.log[this.turn][key] = value;
    }

    getKV(key) {
        return this.log[this.turn][key];
    }

    getTurn = () => this.turn;

    createTurn(turn) {
        this.log[turn] = {};
        this.turn = turn;
    }
}

class Monitor {
    constructor(pm, d, l) {
        this.playerManager = pm;
        this.deck = d;
        this.logger = l;
        this.startingDeck = undefined;

        this.lastTurn = undefined;
        this.turn = 1;
    }

    findTotalGrapples(player) {
        let val = 0;
        player.cards.forEach(card => val += card.value);
        return val;
    }

    findHighestGrapples(players) {
        let topVal = 0;
        let leader = players[0];
        players.forEach(player => {
            let val = this.findTotalGrapples(player);
            if (val >= topVal) {
                topVal = val;
                leader = player;
            }
        });
        return { leader, topVal };
    }

    countCardsInDeck(deck) {
        const map = new Map();
        deck.forEach(card => {
            map.set(card.name, (map.get(card.name) || 0) + 1);
        });
        return map;
    }

    findExpectedValues(deck) {
        // Determine the amount of each card in the deck.
        const { cards } = deck;
        const cardMap = this.countCardsInDeck(cards);
        const odds = {};

        cardMap.forEach((countOfCardType, typeOfCard) => {
            odds[typeOfCard] = ((countOfCardType / cards.length) * 100).toFixed(2);
        });

        return odds;
    }

    monitor(turn) {
        this.lastTurn = this.turn;
        this.turn = turn;

        if (turn == -1) this.logger.logKV('lastTurn', this.lastTurn);
        if (turn == 1) {
            const cards = this.deck.getCards();
            this.startingDeck = [...cards];
        }

        // Determine who has the most "Grapples." Does that tie into their odds of winning?
        const highestGrapples = this.findHighestGrapples(this.playerManager.players);
        let expectedValues = this.findExpectedValues(this.deck);

        this.logger.logKV('highestGrapples', highestGrapples);
        this.logger.logKV('expectedValues', expectedValues);
    }

    // https://www.geeksforgeeks.org/dsa/program-calculate-value-ncr/
    factorial(num) {
        if (num < 0) return 0;
        if (num <= 1) return 1;
        let result = 1;
        for (let i = 2; i <= num; i++) result *= i;
        return result;
    }

    nCr(n, r) {
        if (r < 0 || r > n) return 0;
        return Math.ceil(this.factorial(n) / (this.factorial(r) * this.factorial(n - r)));
    }
}

class GameManager {
    constructor(data) {
        this.data = data;
        this.timesRan = 0;
        this.gameOver = false;

        this.init();
    }

    init() {
        this.logger = new Logger();
        this.playerManager = new PlayerManager(this.data, this.logger);
        this.deck = new Deck(this.logger);
        this.monitor = new Monitor(this.playerManager, this.deck, this.logger);
        if (this.playerbackManager?.clear) this.playerbackManager.clear();
        this.playerbackManager = undefined;
        this.startRunning();
    }

    async run() {
        let turn = 0;
        while (this.deck.getCardCount() > 0 && this.running) {
            turn++;
            this.logger.createTurn(turn);
            // dealer deals a card to the proper player (the player whos turn it is)
            // that player decides what to do with the card, or Deck() automatically
            // deals with the card.
            this.monitor.monitor(turn);

            const player = this.playerManager.getPlayers()[this.playerManager.getTurn()];
            const response = {m:undefined};

            // Current dealer, and current player whos turn it is.
            this.logger.logKV('dealer', this.playerManager.dealer.index);
            this.logger.logKV('player', player.playerIndex);

            // Dealer Turn.
            if (this.playerManager.dealer.index == this.playerManager.turn) {

                this.logger.logKV('isDealerTurn', true);

                this.logger.logKV('turnsAsDealer', this.playerManager.getDealerTurns());

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

                    this.logger.logKV('lookedAtCard', true);

                    if (card.value < 1) {
                        sway = 0.5; // Don't keep the card.
                        this.logger.logKV('didntKeepCard', true);
                    }
                }

                if (randomNumber < sway) {
                    try {
                        response.m = await this.deck.deal(this.playerManager.getPlayers()[player.getToLeft()]);
                    } catch (error) {
                        console.log(error);
                    }
                    this.playerManager.updateDealDirection(0);
                    this.logger.logKV('dealtLeft', true);
                    this.playerManager.nextTurn(); // move to the player who just got 'the dealers card.'
                }

                if (sway <= randomNumber && randomNumber <= 1 - sway) {
                    try {
                        response.m = await this.deck.deal(player);
                    } catch (error) {
                        console.log(error);
                    }

                    let dir = randomNumber > 0.5 ? 0 : 1;
                    this.playerManager.updateDealDirection(dir);
                    this.logger.logKV('dealtSelf', true);
                    this.logger.logKV('chooseDirection', dir);
                }

                if (randomNumber > 1 - sway) {
                    try {
                        response.m = await this.deck.deal(this.playerManager.getPlayers()[player.getToRight()]);
                    } catch (error) {
                        console.log(error);
                    }
                    this.playerManager.updateDealDirection(1);
                    this.logger.logKV('dealtRight', true);
                    this.playerManager.nextTurn(); // move to the player who just got 'the dealers card.'
                }

            } else {
                this.logger.logKV('playerTurn', true);
                response.m = await this.deck.deal(player);
            }

            if (response.m == 'self') {
                this.logger.logKV('multipleCards', true);
            } else {
                this.playerManager.nextTurn(); // potentially skip any players that got dealers cards.
                this.playerManager.addDealerTurn();
            }



            // Dealer will still switch between one player receiving multiple cards on their turn.

            // check for out of range.
            let newIndex = 1;
            let pl = this.playerManager.players.length;
            let di = this.playerManager.dealer.index;
            if (di + newIndex == pl) newIndex = newIndex - pl;

            let newDealer = this.playerManager.getPlayers()[di + newIndex];
            if (this.playerManager.getDealerTurns() == 8) this.playerManager.switchDealer(newDealer);

        }

        this.monitor.monitor(-1); // -1 signals end of game, its all kind of useless.
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
        this.playbackManager = new PlaybackManager(this.monitor);
    }

    reset() {
        this.init();
        this.startRunning();
    }

    getRunning = () => { return this.running; }

}

// Stream the results through console GUI? Or web GUI?
// Then I can put it on my website and send to my math teacher for viewing.
// My goal is to NOT capture each entire state of the game for each turn, but instead the starting deck, and which cards were received by each player on each turn + times players used special cards, how they used them etc. to display animations of where the cards went.
class PlaybackManager {
    constructor(monitor) {
        this.dom = document.getElementById("dom");
        this.players = monitor.playerManager.players;
        this.log = monitor.logger.log;
        this.logLength = Object.keys(this.log);
        this.turn = 0;

        console.log(monitor.logger);

        this.init();
    }

    createCirclePositions(playerCount, height) {
        const radius = height / 2;
        const centerX = radius;
        const centerY = radius;
        const positions = [];
        const angleIncrementDegrees = 360 / playerCount;
        for (let i = 0; i < playerCount; i++) {
            const currentAngleDegrees = i * angleIncrementDegrees;
            const currentAngleRadians = (currentAngleDegrees * Math.PI) / 180;
            const x = centerX + (radius * Math.cos(currentAngleRadians));
            const y = centerY + (radius * Math.sin(currentAngleRadians));
            positions.push([x, y]);
        }
        return positions; // Where each array in the positions array corresponds to the correct player.playerIndex.
    }

    init() {

        let { length } = this.players;
        // generate players in circle even distance from each other.
        const circlePositions = this.createCirclePositions(length, window.innerHeight / 2);
        console.log(circlePositions);

        // generate dom

        const parent = document.createElement('div');

        const buttonContainer = document.createElement('div');
        const backButton = this.createButton(this.lastTurn, 'Last Turn');
        const forwardButton = this.createButton(this.nextTurn, 'Next Turn');
        buttonContainer.appendChild(backButton);
        buttonContainer.appendChild(forwardButton);

        const playersContainer = document.createElement('div');
        playersContainer.style.position = 'relative';
        playersContainer.style.width = '100%';
        playersContainer.style.height = '100%';
        playersContainer.style.backgroundColor = 'red';
        this.players.forEach(player => {
            const position = circlePositions[player.playerIndex];
            const p = this.createPlayer(player, position);
            
            // I need to create a shape that has as many points as there are players
            // and that is the height of the screen.
            // like with numbers.

            console.log(player.playerIndex);

            p.style.position = 'absolute';
            p.style.left = `${position[0]}px`;
            p.style.top = `${position[1]}px`;
            
            player.position = circlePositions[player.playerIndex];
            playersContainer.appendChild(p);
        });

        parent.appendChild(playersContainer);
        parent.appendChild(buttonContainer);

        this.dom.appendChild(parent);

    }

    createButton(onclick, innertext) {
        const button = document.createElement('button');
        button.innerText = innertext;
        button.addEventListener('onclick', onclick);
        return button;
    }

    createPlayer(player, position) {
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.left = `${position[0]}px`;
        div.style.top = `${position[1]}px`;
        const image = document.createElement('img');
        image.src = player.image;
        image.style.height = '100px';
        image.style.width = '100px';
        const name = document.createElement('h2');
        name.innerText = player.name;
        div.appendChild(image);
        div.appendChild(name);
        return div;
    }

    lastTurn() {
        if (this.turn - 1 < 0) return;
        this.turn--;
        this.generateState(this.turn);
    }

    nextTurn() {
        if (this.turn + 1 > this.logLength) return;
        this.turn++;
        this.generateState(this.turn);
    }

    generateState(turn) {
        console.log(turn);
    }
    
}

new GameManager(
    [
        { name: "PlayerOne", colour: "blue", wins: 15 },
        { name: "PlayerTwo", colour: "red", wins: 12 },
        { name: "PlayerThree", colour: "green", wins: 18 },
        { name: "PlayerFour", colour: "green", wins: 18 },
        { name: "PlayerFour", colour: "green", wins: 18 },
        { name: "PlayerFive", colour: "green", wins: 18 },
        { name: "PlayerSix", colour: "green", wins: 18 },
        { name: "PlayerSeven", colour: "green", wins: 18 }
    ]
);