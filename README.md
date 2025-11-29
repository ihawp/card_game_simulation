# Rules

<sup>Last Updated: November 29, 2025.</sup>

A players turn consists of being dealt at least 1 card from the non-replacement deck.

A player wins by having the most "Grapples" at the end of the game.

## View the simulation:

[![Watch the simulation](https://img.youtube.com/vi/2ZGJhEYTmFs/0.jpg)](https://www.youtube.com/watch?v=2ZGJhEYTmFs)

## Events:
- receivedCards
- cardsSelected
- switchDealer
- queenTrade
- queenOfSpadesTrade
- removeAceOfSpades
- winner
- lastTurn
- highestGrapples
- expectedValues
- dealer
- player
- isDealerTurn
- turnsAsDealer
- lookedAtCard
- didntKeepCard
- dealtLeft
- dealtSelf
- chooseDirection
- dealtRight
- playerTurn
- multipleCards


## Card Values (in Grapples):
- Joker: -2
- Queen/King: -10
- Jack: 3
- Number Cards: 2, 3, 4, 5, 6, 7, 8, 9 are worth face value, except for 10. 10 is worth -10.
- Ace: 1 (except for the Ace of Spades, which must eventually be discarded).

## If the card is a...
- 2 or a Joker: The player can are dealt a second card on that turn only. This is called "Double-down."
- Jack: The player can can request to become the dealer by politely asking the current dealer to "tap out." If a dealer receives a Jack they cannot ask themselves to become dealer again. This would effectively reset their turns as dealer, allowing them more time as dealer.
- Ace of Spades: The player can either immediatley request to become the dealer and then discard the Ace of Spades, or just discard the Ace of Spades. 

## Dealer:
There are 54 cards (standard deck with 2 jokers), any player can and likely will play as the dealer.

Any dealer can look at the top card before any of their turns while they are the dealer. The dealer can deal the card they see to themselves or give it to the player on the left/right of them. If the dealer chose to give the card to another player, the cards will be dealt in that direction, ultimately the dealer must choose which direction the cards will be dealt each time it is their turn. 'Their turn' is when the dealer is dealing to themselves.

If any player draws the Ace of Spades they can redeem it to immediatley become the dealer, or discard it.

The first dealer is determined by pulling cards  (every player gets a card) from the pile until only one person has the highest value card.

A dealer becoming the dealer by "tap-out" does not make it the dealers turn, if the circle has a direction and it is not whoever just became the dealers turn, the dealer must continue dealing in that direction. Once it is the dealers turn again they can utilize the listed options for their potential card.

## Dealer: Tap Out
A dealer can "tap out" and the player to their left will become the dealer.

A dealer must "tap out" after 2 turns (2 rotations around the circle, 8 deals). The dealer can look at the top card before their first turn.

## Loan Shark:
Any player who draws a Queen can trade it for 3 cards from another players hand or keep it. 

The Queen of Spades can be traded for half of another players hand. If the amount of cards that the player you are taking from has is odd, the player must give you (n-1)/2 cards in return for your queen or 3 cards, whichever is larger. If the player does not have at least 3 cards, you can take all of their cards, or not it's up to you, they're your friend.

Assuming all players are keeping their cards generally hidden, the player must point at the cards they want to trade the Queen for. The other player must accept the trade. The queen is 'disabled' and does not have the same functionality after the initial pull from the deck and trade are made.