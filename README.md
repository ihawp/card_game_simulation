# Rules

<sup>Last Updated: November 29, 2025.</sup>

A players turn consists of being dealt at least 1 card from the non-replacement deck.

A player wins by having the most "Grapples" at the end of the game.

## View the simulation:

[![Watch the simulation](https://img.youtube.com/vi/2ZGJhEYTmFs/0.jpg)](https://www.youtube.com/watch?v=2ZGJhEYTmFs)

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

# Probabilites

An outline of the probabilities of the game + examples.

## Player/Dealer Turn:
r = amount of that card type remaining
x = amount of cards remaining in the deck

Player receives a card. Can be modeled as 1/x for that specific card, or r/x for that specific card type (2, 3, Jack, etc).

q = amount of special cards remaining in deck

The odds that that card is a special card can be modeled as q/x.

"50/50 chance in simulation" = The simulation can't make human decisions, so I use a random number generator to create a value between 0 and 1, if the value is below 0.5 it does one thing, if it is above 0.5 it does a different thing.

t = total amount of cards decided the player can take
p = total amount of cards to choose from the selected player.

### If the special card is a...
	- 2/Joker: The players turn starts over and they receive another card to make a decision with. 100% chance, the player must request and accept the second card.
	- Queen: The player can choose between keeping the queen or trading it for another players cards with predefined formulas. 50/50 chance in simulation. The player can then choose t cards from p, which creates some number of possible combinations.
	- Ace of Spades: The player can choose between discarding the ace or immediatley becoming the dealer and discarding the ace. 50/50 chance in simulation.
	- Jack: The player can politely request to become the dealer or keep the jack (50/50 chance in simulation). If they decide to ask the other dealer, the other dealer has to decide whether they want to continue being the dealer, or if they want to give up their position to the other player, there is a 50/50 chance of both in the simulation.

## Dealer Turn difference:

### A dealer, on their turn... 

- Can choose to peek the top card (50/50 chance in simulation) 
- Can choose whether they want to deal to themselves, or to their left or right (32.333/self = 35.333/32.333 chance in simulation). In the simulation, a dealer deals away cards with a value < 1.

Player receives a card. The chance of receiving a card is 1 / the amount of cards remaining in the deck. 

The chance of that card enabling the player to do something afterward is the amount of cards with a "special ability" remaining / total amount of cards in the deck.

As shown in the simulation there is a also a probability for any specific type of card. At the beginning of the game this is 4/54 for all cards except the Joker, which is 2/54

The total amount of cards with a "special ability" is all Jacks, Queens, Jokers, 2s, and the Ace of Spades. Which is 15 cards. So at the beginning of the game, the odds of receiving one of the cards is 15/54.

The 2s/Jokers are a forced taking of the next card from the deck, while the other special ability cards (jacks, queens, ace of spades) are decision based, the player who receives the card can decide if they want to use its powers or not.

For example, if a player decides to use their queen to do a queen trade, they first figure out how many cards they are allowed to select. In the simulation I use Math.floor(amount of cards in selected players hand / 2), in real life you might say "John has 9 cards, so let's minus 1 and divide that by 2, which is 4, so Samantha can take 4 cards from John," or "John has 8 cards, so let's divide by 2 and then minus 1, so Samantha can take 3 cards from John," and so on. Once that number k = 4 has been determined, and we know the total amount of cards in players hand = 10, there are 10C4 (210) different combinations available. The probabilities for choosing the best cards available varies by the hand available for choosing from.

Another example is the odds of a player receiving the same card twice. This can ONLY happen if the player receives a 2/Joker, or the player becomes the dealer because they received a Jack/Ace of Spades or the dealer to their right "taps out" AND they decide to deal to themselves. Let's take the case of a player receiving the Ace of Spades to become the dealer, they choose dealing to themselves, which is about a +-35% chance in the simulation (in general), the odds of receiving the first ace were 4/54 (though the odds of it being the Ace of Spades were 1/54), the odds of then receiving a second ace is 3/53, which makes the P(two aces) = 4/54 * 3/53 = 12/2862 = 0.00419287% chance.

### Multiple 2s

There is also the possibility that a player receives multiple 2s, with 34 cards in the deck, and three 2s remaining. The first 2 is 3/34, the second 2 is 2/33, and a third 2 is 1/32, which makes the P(three twos) = 3/34 * 2/33 * 1/33 = 6 / 35,904 = 0.00016711% chance.

The odds of a player receiving any card that allows them the situation to receive another card is (the amount of that card remaining / the amount of cards remaining in the deck) * (the amount of the other card remaining / the amount of cards remaining in the deck - 1).
