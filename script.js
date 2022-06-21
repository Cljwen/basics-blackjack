// Global variables needed

var cardDeck = [];
var shuffledCardDeck = [];
// To store drawn cards into respective arrays
var playerCards = [];
var compCards = [];
var gameMode = "Deal Cards";
var blackJackCheck = "False";
// for calculation of card values of player and computer
var playerCardValue = 0;
var compCardValue = 0;

// To output and display drawn card names & suits to player
var playerCardsOutput;
var compCardsOutput;

var main = function (input) {
  if (gameMode == "Deal Cards") {
    cardDeck = deckGenerator();
    console.log(cardDeck);
    // Shuffle card deck automatically at the start
    shuffledCardDeck = shuffleTheDeck(cardDeck);
    dealCards();
    console.log(playerCards);
    console.log(compCards);
    var myOutputValue = blackjackCheck(playerCards, compCards);
    if (blackJackCheck == "True") {
      resetBlackJack();
      return myOutputValue;
    }

    console.log("The PLAYER CARD VALUE is " + playerCardValue);
    // output cards and score to player for decision making
    gameMode = "Hit or Stand";
    playerCardsOutput = outputCardsDrawn(playerCards);

    return `Your Hand: <br> ${playerCardsOutput} <br> Your cards total: ${playerCardValue}. <br> Submit "hit" to draw another card or "stand" to pass.`;
  }
  // Let player choose to hit or stand
  if (gameMode == "Hit or Stand") {
    if (input.toUpperCase() != "STAND" && input.toUpperCase() != "HIT") {
      return `Submit "hit" to draw another card or "stand" to pass. <br> <br> Your Hand: <br> ${playerCardsOutput} <br> Your cards total: ${playerCardValue}. <br> `;
    }
    if (input.toUpperCase() == "STAND") {
      compAutoPlay(compCards);
      myOutputValue = winnerCheck(playerCardValue, compCardValue);
      resetBlackJack();
      // return win / loss results
      return myOutputValue;
    }

    //player decides to draw a card
    if (input.toUpperCase() == "HIT") {
      console.log("The START FUNCTION Player Card Value is " + playerCardValue);
      // push a card into the player's array
      playerCards.push(drawCard());
      console.log(playerCards);
      playerCardValue = scoreCalculation(playerCards);
      console.log(
        "After hitting a card, the player's card score is" + playerCardValue
      );
      if (playerCardValue > 21) {
        compAutoPlay(compCards);
        console.log("Computer's card value is " + compCardValue);
        myOutputValue = winnerCheck(playerCardValue, compCardValue);
        resetBlackJack();
        // return win / loss results
        return "You bust! <br>" + myOutputValue;
      }
      console.log("The Player Card Value is " + playerCardValue);
      playerCardsOutput = outputCardsDrawn(playerCards);
      return `Your Hand: <br> ${playerCardsOutput} <br> Your cards total: ${playerCardValue} <br> Submit "hit" to draw another card or "stand" to pass.`;
    }
  }
};

// helper function to display drawn card names and suits to player
var outputCardsDrawn = function (cardsArray) {
  var cardsDrawn = "";
  for (var m = 0; m < cardsArray.length; m++) {
    cardsDrawn =
      cardsDrawn + cardsArray[m].name + " of " + cardsArray[m].suit + "<br>";
  }
  return cardsDrawn;
};

// Computer auto-draw function with score calculation
var compAutoPlay = function (compCards) {
  // calculate score for computer --> draw automatically if below 17
  compCardValue = scoreCalculation(compCards);
  console.log("The Comp Card Value is " + compCardValue);
  while (compCardValue < 17) {
    compCards.push(drawCard());
    compCardValue = scoreCalculation(compCards);
    console.log(
      "After drawn card, the Comp Card Value now is " + compCardValue
    );
  }
};

// score comparison function
var winnerCheck = function (playerCardValue, compCardValue) {
  // check if there is a draw in scores --> if yes return tie message

  var cardsTally =
    "Player's Cards: <br>  " +
    outputCardsDrawn(playerCards) +
    "<br> Total card value: <br>" +
    playerCardValue +
    "<br> <br> Computer's cards are: <br>" +
    outputCardsDrawn(compCards) +
    "<br> Total card value: <br>" +
    compCardValue;

  if (
    playerCardValue == compCardValue ||
    (playerCardValue > 21 && compCardValue > 21)
  ) {
    var message = "It's a tie! <br>";
    return message + cardsTally;
  }

  if (playerCardValue > 21 && compCardValue <= 21) {
    message = "Computer wins! <br>";
    return message + cardsTally;
  } else if (playerCardValue <= 21 && compCardValue > 21) {
    message = "Player wins! <br>";
    return message + cardsTally;
  }

  if (playerCardValue <= 21 && compCardValue <= 21) {
    if (playerCardValue > compCardValue) {
      message = " Player wins! <br>";
    } else {
      message = "Computer wins! <br>";
    }
    return message + cardsTally;
  }
};

// card score calculation function with check for number of ace cards
var scoreCalculation = function (cardArray) {
  var aceCardPosition = [];
  console.log("Card Array taken in at score calculation");
  console.log(cardArray);

  // check for ace cards and keep a record of which position it is in
  for (var a = 0; a < cardArray.length; a++) {
    if (cardArray[a].rank == 1) {
      aceCardPosition.push(a);
    }
  }
  console.log("aceCardPosition Array is");
  console.log(aceCardPosition);

  // if number of cards > 2, value of ace is equal to 1
  if (cardArray.length > 2 && aceCardPosition != []) {
    for (var i = 0; i < aceCardPosition.length; i++) {
      cardArray[aceCardPosition[i]].value = 1;
    }
  }

  var finalCardValue = 0;
  // add all values of the cards in a loop
  for (var j = 0; j < cardArray.length; j++) {
    finalCardValue = finalCardValue + cardArray[j].value;
    console.log(finalCardValue);
  }

  return finalCardValue;
};

// reset function to revert all arrays and variables
var resetBlackJack = function () {
  playerCards = [];
  compCards = [];
  gameMode = "Deal Cards";
  blackJackCheck = "False";
  playerCardsOutput;
  compCardsOutput;
};

//

// NEED TO CLEAN UP: Check for winning condition of blackjack
var blackjackCheck = function (playerCards, compCards) {
  playerCardValue = scoreCalculation(playerCards);
  compCardValue = scoreCalculation(compCards);
  var playerWonMessage = "";
  var compWonMessage = "";
  var cardsTally =
    "Player's Cards: <br>  " +
    outputCardsDrawn(playerCards) +
    "<br> Computer's cards are: <br>" +
    outputCardsDrawn(compCards);

  if (playerCardValue == 21) {
    playerWonMessage = `You drew black jack! <br>`;
    blackJackCheck = "True";
  }
  if (compCardValue == 21) {
    compWonMessage = `Computer drew black jack! <br> `;
    blackJackCheck = "True";
  }
  return (
    playerWonMessage +
    compWonMessage +
    "<br>" +
    cardsTally +
    "<br><br> Please press submit to shuffle the cards and deal again."
  );
};

var drawCard = function () {
  var card = shuffledCardDeck.pop();
  return card;
};

// first deal of cards
var dealCards = function () {
  var numOfDealtCards = 0;
  playerCards = [
    { name: `Ace`, rank: 1, value: 11, suit: `Diamonds ♦️` },
    { name: `9`, rank: 9, value: 9, suit: `Hearts ♥️` },
    //{ name: `3`, rank: 3, value: 3, suit: `Hearts` },
  ];
  compCards = [
    { name: `ace`, rank: 1, value: 11, suit: `clubs` },
    { name: `two`, rank: 12, value: 2, suit: `spades` },
  ];
  console.log("PLAYER cards are " + playerCards);
  console.log("COMPUTER cards are " + compCards);
  return playerCards, compCards;

  while (numOfDealtCards < 2) {
    playerCards = playerCards.push(drawCard());
    compCards = compCards.push(drawCard());
    numOfDealtCards = numOfDealtCards + 1;
  }
  return playerCards, compCards;
};

// Generate a random number for use in functions
var getRandomNum = function (maxNum) {
  var randomNum = Math.floor(Math.random() * maxNum);
  return randomNum;
};

// Shuffle function for generated card deck
var shuffleTheDeck = function () {
  var currentCardPosition = 0;
  // loop the shuffling from card 1 to card 52
  while (currentCardPosition < cardDeck.length) {
    // generate a number or position to draw from
    var randomPosition = getRandomNum(cardDeck.length);
    // store both cards in temporary variables
    var randomCard = cardDeck[randomPosition];
    var currentCard = cardDeck[currentCardPosition];
    // slide random card into the current card deck position
    cardDeck[currentCardPosition] = randomCard;
    // slide current card into random deck position
    cardDeck[randomPosition] = currentCard;
    currentCardPosition = currentCardPosition + 1;
  }
  return cardDeck;
};

// Generate card deck
var deckGenerator = function () {
  // a card deck consists of 4 suits and 13 cards in each suit
  var suitCounter = 0;
  var suitArray = ["Diamonds♦️", "Clubs♣️", "Hearts♥️", "Spades♠️"];
  // for every suit, generate 13 cards
  while (suitCounter < suitArray.length) {
    var cardCounter = 1;
    while (cardCounter <= 13) {
      var card = {
        name: `${cardCounter}`,
        rank: cardCounter,
        value: cardCounter,
        suit: `${suitArray[suitCounter]}`,
      };
      // change the name for special cards: ace, jack, queen and king
      if (cardCounter == 1) {
        card.name = "Ace";
        card.value = 11;
      } else if (cardCounter == 11) {
        card.name = "Jack";
        card.value = 10;
      } else if (cardCounter == 12) {
        card.name = "Queen";
        card.value = 10;
      } else if (cardCounter == 13) {
        card.name = "King";
        card.value = 10;
      }
      // add the card into the card deck
      cardDeck.push(card);
      cardCounter = cardCounter + 1;
    }
    suitCounter = suitCounter + 1;
  }
  return cardDeck;
};

// IGNORE FIRST: check how many users there are

// More comfortable features

// Betting: The player starts with 100 points. Each round the player wagers a number of points before their hand is dealt. Keep track of the player's points throughout the game.

// Multiplayer: Enable multiple players to play against the dealer, where players can take turns. The game hides and shows relevant hand according to the turn.

// Splitting: Add hand-splitting functionality to the game. If the player has two of the same kind of card, they can choose to split and get dealt 2 new cards. Dealer is not allowed to split.
