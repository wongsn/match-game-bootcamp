// Please implement exercise logic here

// boardSize has to be an even number
const boardSize = 4;
const board = [];
let firstCard = null;
let firstCardElement;
let deck;
let score = 0;
const maxScore = (boardSize * boardSize) / 2;
let start;
const scoreBoard = document.createElement('div');
scoreBoard.classList.add('scoreBoard');
scoreBoard.innerHTML = `${score} out of ${maxScore}`;

const makeDeck = () => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ['♦', '♣', '♥', '♠'];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];
    console.log(`current suit: ${currentSuit}`);

    // loop to create all cards in this suit
    // rank 1-13
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // Convert rankCounter to string
      let cardName = `${rankCounter}`;

      // 1, 11, 12 ,13
      if (cardName === '1') {
        cardName = 'A';
      } else if (cardName === '11') {
        cardName = 'J';
      } else if (cardName === '12') {
        cardName = 'Q';
      } else if (cardName === '13') {
        cardName = 'K';
      }

      // make a single card object variable
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
      };

      console.log(`rank: ${rankCounter}`);

      // add the card to the deck
      newDeck.push(card); // add double the cards to the deck
      // newDeck.push(card);
    }
  }
  return newDeck;
};

// Get a random index ranging from 0 (inclusive) to max (exclusive).
const getRandomIndex = (max) => Math.floor(Math.random() * max);

// Shuffle an array of cards
const shuffleCards = (cards) => {
  // Loop over the card deck array once
  for (let currentIndex = 0; currentIndex < cards.length; currentIndex += 1) {
    // Select a random index in the deck
    const randomIndex = getRandomIndex(cards.length);
    // Select the card that corresponds to randomIndex
    const randomCard = cards[randomIndex];
    // Select the card that corresponds to currentIndex
    const currentCard = cards[currentIndex];
    // Swap positions of randomCard and currentCard in the deck
    cards[currentIndex] = randomCard;
    cards[randomIndex] = currentCard;
  }
  // Return the shuffled deck
  return cards;
};

const squareClick = (cardElement, column, row) => {
  console.log(cardElement);

  console.log('FIRST CARD DOM ELEMENT', firstCard);

  console.log('BOARD CLICKED CARD', board[column][row]);

  const clickedCard = board[column][row];

  // the user already clicked on this square
  if (cardElement.innerText !== '') {
    return;
  }

  // first turn
  if (firstCard === null) {
    console.log('first turn');
    firstCard = clickedCard;
    // turn this card over
    cardElement.innerHTML = `${clickedCard.name}<br>${clickedCard.suit}`;

    // hold onto this for later when it may not match
    firstCardElement = cardElement;

    // second turn
  } else {
    console.log('second turn');
    if (
      clickedCard.name === firstCard.name
        && clickedCard.suit === firstCard.suit
    ) {
      console.log('match');
      score += 1;
      scoreBoard.innerHTML = `${score} out of ${maxScore}`;
      // turn this card over
      cardElement.innerHTML = `${clickedCard.name}<br>${clickedCard.suit}`;
    } else {
      console.log('NOT a match');

      // turn this card back over
      firstCardElement.innerText = '';
    }

    // reset the first card
    firstCard = null;
  }

  if (score == maxScore) {
    const end = window.performance.now();
    const timing = Math.floor((end - start) / 1000);
    scoreBoard.innerHTML += `You won, in a time of ${timing}s`;
  }
};

// create all the board elements that will go on the screen
// return the built board
const buildBoardElements = (board) => {
  // create the element that everything will go inside of
  const boardElement = document.createElement('div');

  // give it a class for CSS purposes
  boardElement.classList.add('board');

  // use the board data structure we passed in to create the correct size board
  for (let i = 0; i < board.length; i += 1) {
    // make a var for just this row of cards
    const row = board[i];

    // make an element for this row of cards
    const rowElement = document.createElement('div');
    rowElement.classList.add('row');

    // make all the squares for this row
    for (let j = 0; j < row.length; j += 1) {
      // create the square element
      const square = document.createElement('div');

      // set a class for CSS purposes
      square.classList.add('square');

      // set the click event
      // eslint-disable-next-line
      square.addEventListener('click', (event) => {
        // we will want to pass in the card element so
        // that we can change how it looks on screen, i.e.,
        // "turn the card over"
        squareClick(event.currentTarget, i, j);
      });

      rowElement.appendChild(square);
    }
    boardElement.appendChild(rowElement);
  }

  return boardElement;
};

const startButton = document.createElement('button');
startButton.id = 'start-button';
startButton.innerText = 'Click to start';
document.body.appendChild(startButton);

// const giveupButton = document.createElement('button');
// startButton.id = 'giveup-button';
// startButton.innerText = 'Give up?';
// document.body.appendChild(giveupButton);

// startButton.addEventListener('click', giveup);

const makeGame = () => {
  // create this special deck by getting the doubled cards and
  // making a smaller array that is ( boardSize squared ) number of cards
  // create double, slice, shuffle - 1
  // create one, shuffle, double, slice - 2
  const singledeck = makeDeck();
  const shuffledsingle = shuffleCards(singledeck);
  const duplicateDeck = (deck) => {
    const double = [];
    for (let i = 0; i < deck.length; i += 1) {
      double.push(deck[i]);
      double.push(deck[i]);
    }
    return double;
  };
  const duplicated = duplicateDeck(shuffledsingle);
  console.log(duplicated);
  const deckSubset = duplicated.slice(0, boardSize * boardSize);
  deck = shuffleCards(deckSubset);

  // console.log(deck);
  // eslint-disable-next-line max-len
  // this does not generate a true scrambled deck, rather it shuffles the first #boardsize^2 number of cards from a sequential deck

  // deal the cards out to the board data structure
  for (let i = 0; i < boardSize; i += 1) {
    board.push([]);
    for (let j = 0; j < boardSize; j += 1) {
      board[i].push(deck.pop());
    }
  }

  const boardEl = buildBoardElements(board);

  document.body.insertBefore(boardEl, startButton);
};

const startGame = () => {
  start = window.performance.now();
  makeGame();
  document.getElementById('start-button').disabled = true;
};

startButton.addEventListener('click', startGame);
// const giveup = (board) {

// }

document.body.appendChild(scoreBoard);
