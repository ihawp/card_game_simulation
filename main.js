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

            this.logger.log[this.logger.getTurn()]['receivedCard'] = card.id;

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

        this.logger.logKV('possibleCardsCount', `${count}`);

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
        this.logger.logKV('queenTrade', true);
        this.logger.logKV('playerSelectedQueenTrade', player2.playerIndex);
    }

    calculateQueenTradeCards(player2) {
        const count = player2.getCardCount();
        const cc = Math.floor(count / 2);
        const cards = cc > 3 ? cc : 3;
        return count < 3 ? count : cards;
    }

    // Take about half of the other players hand.
    queenOfSpadesTrade = async (index, player2) => {
        this.logger.logKV('queenOfSpadesTrade', true);
        const count = this.calculateQueenTradeCards(player2);
        this.queenTrade(index, player2, count);
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
        const dealerIndex = Math.floor(Math.random() * (this.players.length));
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
                    if (isSpades) {
                        return await player.queenOfSpadesTrade(index, player2);
                    }
                    const count = player.calculateQueenTradeCards(player2);
                    await player.queenTrade(index, player2, count);
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

    addDealerTurn() { this.dealer.turnsAsDealer++; }
    getDealerTurns() { return this.dealer.turnsAsDealer; }
    getDealDirection() { return this.dealer.direction; }
    getPlayers = () => { return this.players; }
    getTurn = () => { return this.turn; }
}

class Logger {
    constructor() {
        this.log = {};
        this.turn = 1; // count of total amount of turns (not related to PlayerManager.turn / turnIndex whatever it is called).
    }

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
            odds[typeOfCard] = { chance: ((countOfCardType / cards.length) * 100).toFixed(2), amount: countOfCardType };
        });

        return odds;
    }

    monitor(turn) {
        this.lastTurn = this.turn;
        this.turn = turn;

        if (turn == -1) this.logger.logKV('lastTurn', true);
        if (turn == 1) {
            const cards = this.deck.getCards();
            this.startingDeck = [...cards];
        }
    }

    monitorEnd() {
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
        let isSelf = 0;
        while (this.deck.getCardCount() > 0 && this.running) {
            turn++;
            this.logger.createTurn(turn);
            // dealer deals a card to the proper player (the player whos turn it is)
            // that player decides what to do with the card, or Deck() automatically
            // deals with the card.
            this.monitor.monitor(turn);

            this.playerManager.addDealerTurn();

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

                if (lookAtCard && !isSelf) {
                    sway = 0.15;
                    isSelf = 0;
                    const card = this.deck.peekTopCard();

                    this.logger.logKV('lookedAtCard', true);

                    if (card.value < 1) {
                        sway = 0.5; // Don't keep the card.
                        this.logger.logKV('didntKeepCard', true);
                    }
                }

                if (randomNumber < sway) {
                    try {
                        const toLeft = this.playerManager.getPlayers()[player.getToLeft()];
                        response.m = await this.deck.deal(toLeft);
                        this.logger.logKV('player', toLeft.playerIndex);
                    } catch (error) {}
                    this.playerManager.updateDealDirection(0);
                    this.logger.logKV('dealtLeft', true);
                    this.playerManager.nextTurn();
                }

                if (sway <= randomNumber && randomNumber <= 1 - sway) {
                    try {
                        response.m = await this.deck.deal(player);
                    } catch (error) {}

                    let dir = randomNumber > 0.5 ? 0 : 1;
                    this.playerManager.updateDealDirection(dir);
                    this.logger.logKV('dealtSelf', true);
                    this.logger.logKV('chooseDirection', dir);
                }

                if (randomNumber > 1 - sway) {
                    try {
                        const toRight = this.playerManager.getPlayers()[player.getToRight()];
                        response.m = await this.deck.deal(toRight);
                        this.logger.logKV('player', toRight.playerIndex);
                    } catch (error) {}
                    this.playerManager.updateDealDirection(1);
                    this.logger.logKV('dealtRight', true);
                    this.playerManager.nextTurn();
                }

            } else {
                this.logger.logKV('playerTurn', true);
                response.m = await this.deck.deal(player);
            }

            if (response.m != 'self') {
                this.playerManager.nextTurn();
            } else {
                isSelf = 1;
            }

            this.monitor.monitorEnd();

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
        this.playbackManager = new PlaybackManager(this.monitor);
    }

    reset() {
        this.init();
        this.startRunning();
    }

    getRunning = () => { return this.running; }

}

class PlaybackManager {
    constructor(monitor) {
        this.dom = document.getElementById("dom");
        this.players = monitor.playerManager.players;
        this.log = monitor.logger.log;
        this.logLength = Object.keys(this.log).length;
        this.turn = 0;
        this.deck = [...monitor.startingDeck];
        this.buttonSync = [];

        this.statDOM = {};

        this.images = {
            'spades': 'spades.svg',
            'clubs': 'clubs.svg',
            'diamonds': 'diamonds.png',
            'hearts': 'hearts.svg',
            'joker': 'joker.png'
        }

        this.init();
    }

    // http://youtube.com/watch?v=UgE05IwjrJQ
    createCirclePositions(playerCount, r) {
        const radius = r / 2;
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

    init = () => {
        const parent = document.createElement('div');
        parent.style.display = 'flex';
        parent.style.flexDireciton = 'row';
        parent.style.alignItems = 'center';
        parent.style.marginLeft = '2rem';


        const buttonContainer = document.createElement('div');
        const forwardButton = this.createButton('Start');
        forwardButton.addEventListener('click', this.nextTurn.bind(this));
        buttonContainer.appendChild(forwardButton);
        this.buttonSync.push(forwardButton);

        const playersContainer = document.createElement('div');
        const height = window.innerHeight / 2;
        const heightString = `${height + 140}px`;
        playersContainer.style.position = 'relative';
        playersContainer.style.height = heightString;
        playersContainer.style.width = `${window.innerWidth}px`;

        let { length } = this.players;
        const circlePositions = this.circlePositions = this.createCirclePositions(length, height);
        this.players.forEach(player => {
            const position = player.position = circlePositions[player.playerIndex];
            playersContainer.appendChild(this.createPlayer(player, position));
        });
        playersContainer.style.userSelect = 'none';
        this.playersContainer = playersContainer;

        parent.appendChild(playersContainer);
        parent.appendChild(buttonContainer);
        parent.appendChild(this.createStatBoard());

        this.dom.appendChild(parent);

    }

    createButton(innertext) {
        const button = document.createElement('button');
        button.innerText = innertext;
        return button;
    }

    createPlayer(player, position) {
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.left = `${position[0]}px`;
        div.style.top = `${position[1]}px`;

        const cardContainer = document.createElement('div');
        cardContainer.style.width = '160px';
        cardContainer.style.height = 'max-content';
        cardContainer.style.display = 'flex';
        cardContainer.style.flexDirection = 'row';
        cardContainer.style.flexWrap = 'wrap';
        cardContainer.style.width = window.innerHeight / 2;
        player.cardContainer = cardContainer;
        div.appendChild(cardContainer);

        const profileContainer = document.createElement('div');
        profileContainer.style.display = 'flex';
        profileContainer.style.flexDirection = 'row';
        profileContainer.style.alignItems = 'center';
        profileContainer.style.gap = '.75rem';

        const image = document.createElement('img');
        image.src = player.image;
        image.style.height = '30px';
        image.style.width = '30px';
        const name = document.createElement('p');
        name.innerText = player.name;

        profileContainer.appendChild(image);
        profileContainer.appendChild(name);
        div.appendChild(profileContainer);
        return div;
    }

    createStatBoard() {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.marginLeft = '2rem';

        const expectedValues = document.createElement('table');

        const turnCountContainer = document.createElement('div');
        turnCountContainer.style.display = 'flex';
        turnCountContainer.style.flexDirection = 'row';
        turnCountContainer.style.alignItems = 'center';
        turnCountContainer.innerText = 'Turn #';
        const turnCount = document.createElement('p');
        turnCountContainer.appendChild(turnCount);

        this.statDOM = { 
            ...this.statDOM, 
            expectedValues,
            turnCount
        };

        div.appendChild(turnCountContainer);
        div.appendChild(expectedValues);
        return div;
    }

    createCard(realCard) {
        const card = document.createElement('div');
        card.id = realCard.id;
        card.dataset.value = realCard.value;
        card.style.backgroundColor = '#fff';
        card.style.position = 'absolute';
        card.style.height = '110px';
        card.style.width = '80px';
        card.style.borderRadius = '4px';

        if (realCard.type == 'spades' || realCard.type == 'clubs') {
            card.style.color = '#000';
        } else if (realCard.type == 'diamonds' || realCard.type == 'hearts') {
            card.style.color = 'red';
        }

        const name = document.createElement('p');
        const name2 = document.createElement('p');
        name.style.position = name2.style.position = 'absolute';
        name.style.top = name.style.right = '2px';
        name.style.fontWeight = name2.style.fontWeight = 'bold';
        name2.style.bottom = name2.style.left = '2px';

        name.innerText = name2.innerText = Number.isFinite(+realCard.name) ? realCard.name : realCard.name[0];

        card.appendChild(name);
        card.appendChild(name2);

        const image = document.createElement('img');
        image.src = 'images/' + this.images[realCard.type];
        image.style.position = 'absolute';
        image.style.left = image.style.top = '2px';
        image.style.width = image.style.height = '20px';
        const image2 = image.cloneNode();
        image2.style.top = image2.style.left = 'unset';
        image2.style.bottom = image2.style.right = '2px';
        card.appendChild(image);
        card.appendChild(image2);


        return card;
    }

    nextTurn(event) {
        event.preventDefault();

        
        if (this.turn + 1 > this.logLength) return;
        this.turn++;
        this.generateState(this.turn, 0);

        setTimeout(() => {
            this.buttonSync[0].dispatchEvent(new Event('click'));
        }, 2500);
    }

    
    async animateMovement(duration, element, finalContainer, startX, startY, endX, endY) {
        return new Promise((res, rej) => {
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                
                const progress = Math.min(elapsed / duration, 1);
                const currentX = startX + (endX - startX) * progress;
                const currentY = startY + (endY - startY) * progress;
                element.style.transform = `translate(${currentX}px, ${currentY}px)`;

                const currentWidth = String(element.style.width).replace('px', '');
                const currentHeight = String(element.style.height).replace('px', '');

                if (progress < 1 && currentWidth > 40) {
                    element.style.width = `${currentWidth - 1}px`;
                    element.style.height = `${currentHeight - 2}px`;
                }

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    finalContainer.appendChild(element);
                    element.style.transform = `translate(${0}px, ${0}px)`;
                    element.style.position = 'relative';
                    element.style.height = '40px';
                    element.style.width = '30px';
                    return res(true);
                }
            }

            // Start the very first frame loop
            requestAnimationFrame(update);
        });
    }

    async queenTrade(turn, finishedHanding) {
        if (this.log[turn]['queenTrade'] && finishedHanding) {
            return new Promise(async (res, rej) => {
                const cardsSelected = this.log[turn]['cardsSelected'];
                const cardReceived = this.log[turn]['receivedCard']; // id of card (the queen)
                const queenDOM = document.getElementById(cardReceived);
                const realPlayer = this.players[this.log[turn]['player']];
                const actualPlayer = this.players[this.log[turn]['playerSelectedQueenTrade']]; // the actual player, selected by their index.
                // Move the queen from the player who received the queens inventory
                // to the other players inventory.
                this.playersContainer.appendChild(queenDOM);
                await this.animateMovement(
                    750,
                    queenDOM,
                    actualPlayer.cardContainer,
                    realPlayer.position[0],
                    realPlayer.position[1],
                    actualPlayer.position[0],
                    actualPlayer.position[1]
                );
                // for each of the cards selected move the cards from the
                // selectedplayers inventory to the players (person who
                // got the queen) inventory
                if (cardsSelected.length == 0) return res(true);
                cardsSelected.forEach(async item => {
                    const realCard = document.getElementById(item);
                    this.playersContainer.appendChild(realCard);
                    await this.animateMovement(
                        750, 
                        realCard, 
                        realPlayer.cardContainer,
                        actualPlayer.position[0],
                        actualPlayer.position[1],
                        realPlayer.position[0],
                        realPlayer.position[1]
                    );
                });
                res(true);
            });
        } else {
            return true;
        }
    }

    async generateState(turn, direction) {

        this.disableButtons();

        this.statDOM['turnCount'].innerText = turn > 0 ? turn : '';

        const turnInfo = this.log[turn];
        if (turnInfo == undefined) return;
        
        const keys = Object.keys(turnInfo);
        keys.forEach(async key => {

            const value = turnInfo[key];

            switch (key) {
                case 'dealer':
                    const dealer = this.playersContainer.children[value];
                    if (keys.includes('switchDealer')) return dealer.style.backgroundColor = 'transparent';
                    
                    // if going backwards a turn.
                    if (!direction && this.log[turn + 1] != undefined && Object.keys(this.log[turn + 1]).includes('switchDealer')) {
                        const oldDealer = this.log[turn + 1].switchDealer;
                        this.playersContainer.children[oldDealer].style.backgroundColor = 'transparent';
                    }
                    dealer.style.backgroundColor = 'pink';
                    break;
                case 'receivedCard':
                    // display animation of dealer handing the cards to the player.
                    // get the cards values by the ids in value (which is array []).
                    // they are received in the order [0 -> n];

                    const dealerIndex = this.log[turn]['dealer'];
                    const playerIndex = this.log[turn]['player'];
                    const dealer2 = this.circlePositions[dealerIndex];
                    const player = this.circlePositions[playerIndex];
                    const x1 = dealer2[0];
                    const y1 = dealer2[1];
                    const x2 = player[0];
                    const y2 = player[1];

                    const realCard = this.findCardById(value);
                    const card = this.createCard(realCard);

                    this.playersContainer.appendChild(card);
                    const finishedHanding = await this.animateMovement(500, card, this.players[playerIndex].cardContainer, x1, y1, x2, y2);

                    const queenTrade = await this.queenTrade(turn, finishedHanding);

                    if (this.log[turn]['lastTurn'] != undefined && queenTrade) {

                        setTimeout(() => {
                            let winner = undefined;
                            let highest = 0;
                            let pcccTotalLength = 0;
                            for (const player of this.players) {
                                const pccc = player.cardContainer.children;
                                pcccTotalLength += pccc.length;
                                let value = 0;
                                for (const card of pccc) {
                                    value += Number(card.dataset.value);
                                }
                                if (value > highest) {
                                    highest = value;
                                    winner = player.id;
                                }
                            }

                            const p = this.players.find(player => player.id == winner);
                            alert(`Player ${p.name} wins with ${highest} grapples!`);
                        }, 1500);
                    }
                    break;
                case 'switchDealer':
                    const newDealer = this.playersContainer.children[value];
                    newDealer.style.backgroundColor = 'pink';
                    break;
                case 'expectedValues':
                    this.fillExpectedValuesTable(this.statDOM['expectedValues'], value);
                    break;
            }
            
        });

    }

    disableButtons() {
        this.buttonSync.forEach(button => {
            button.disabled = 'disabled';
        });
    }

    enableButtons() {
        this.buttonSync.forEach(button => {
            button.disabled = undefined;
        });
    }

    findCardById(id) {
        return this.deck.find(item => item.id == id);
    }

    fillExpectedValuesTable(table, list) {
        const tbody = table.querySelector('tbody') || table.createTBody();
        tbody.innerHTML = '';

        const keys = Object.keys(list);

        if (keys.length === 0) {
            const row = tbody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 3;
            cell.innerText = 'No data available.';
            return;
        }
        
        if (!table.querySelector('thead')) {
            const thead = table.createTHead();
            const headerRow = thead.insertRow();
            const headers = ['Card Name', 'Chance', 'Amount of Card Remaining'];
            headers.forEach(headerText => {
                const th = document.createElement('th');
                th.innerText = headerText;
                headerRow.appendChild(th);
            });
        }

        keys.forEach(key => {
            const row = tbody.insertRow();
            const cell1 = row.insertCell();
            const cell2 = row.insertCell();
            const cell3 = row.insertCell();

            cell1.innerText = `${key}`;
            cell2.innerText = `${list[key].chance}%`;
            cell3.innerText = `${list[key].amount}`;

        });
    }
    
}

new GameManager(
    [
        { name: "PlayerOne", colour: "blue", wins: 15 },
        { name: "PlayerTwo", colour: "red", wins: 12 },
        { name: "PlayerThree", colour: "green", wins: 18 },
        { name: "PlayerFour", colour: "green", wins: 18 },
        { name: "PlayerFive", colour: "green", wins: 18 },
        { name: "PlayerSix", colour: "green", wins: 18 }
    ]
);