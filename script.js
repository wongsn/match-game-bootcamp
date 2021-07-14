// Please implement exercise logic here

// boardSize has to be an even number
let nameInput;
const boardSize = 4;
const board = [];
let gameWins = 0;
const gameLoss = 0;
let totalGames = gameWins + gameLoss;
let winP = 0;
const checkWinRate = () => {
  if (totalGames == 0) {
    winP = 0;
  }
  winP = gameWins / totalGames;
};
let firstCard = null;
let firstCardElement;
let deck;
let score = 0;
const maxScore = (boardSize * boardSize) / 2;
let start;
const scoreBoard = document.createElement('div');
scoreBoard.classList.add('scoreBoard');
scoreBoard.innerHTML = 'Welcome! To start, input your name and click the start button';

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
  // console.log(firstCard != null);

  console.log('BOARD CLICKED CARD', board[column][row]);
  const clickedCard = board[column][row];

  const clearCard = () => {
    firstCardElement.innerText = '';
    cardElement.innerText = '';
  };

  const mutateCard = () => {
    cardElement.replaceWith(firstCardElement.cloneNode(true));
    cardElement.innerHTML = `${clickedCard.name}<br>${clickedCard.suit}`;
    firstCardElement.replaceWith(firstCardElement.cloneNode(true));
    firstCardElement.innerHTML = `${firstCard.name}<br>${firstCard.suit}`;
  };

  // the user already clicked on this square
  if (cardElement.innerText !== '') {
    firstCard = null;
    setTimeout(clearCard, 0);
    console.log(firstCard);
  } else if (firstCard === null) {
    console.log('first turn');
    setTimeout(() => { firstCard = clickedCard; }, 0);
    // turn this card over
    cardElement.innerHTML = `${clickedCard.name}<br>${clickedCard.suit}`;
    console.log(cardElement);
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
      console.log(clickedCard.name, firstCard.name);
      mutateCard();
      // turn this card over
      cardElement.innerHTML = `${clickedCard.name}<br>${clickedCard.suit}`;
      if (score == maxScore) {
        gameWins += 1;
        const end = window.performance.now();
        const timing = Math.floor((end - start) / 1000);
        setTimeout(scoreBoard.innerHTML = `<br>You won, in a time of ${timing}s.<br>Your winning rate is ${winP}% - Total Games Played: ${totalGames}`, 5000);
        document.getElementById('start-button').disabled = false;
        return;
      }
      scoreBoard.innerHTML = `${score} out of ${maxScore}`;
      scoreBoard.innerHTML += '<br>Match!';
      setTimeout(() => { scoreBoard.innerHTML = `${score} out of ${maxScore}`; }, 3000);
    } else {
      console.log('NOT a match');
      // turn this card back over
      cardElement.innerHTML = `${clickedCard.name}<br>${clickedCard.suit}`;
      firstCard = null;
      setTimeout(clearCard, 1000);
    }

    // reset the first card
    firstCard = null;
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
      square.id = i * 4 + j;

      const clickEvent = (event) => {
        // we will want to pass in the card element so
        // that we can change how it looks on screen, i.e.,
        // "turn the card over"
        squareClick(event.currentTarget, i, j);
      };

      // set the click event
      // eslint-disable-next-line
      square.addEventListener('click', clickEvent);

      rowElement.appendChild(square);
    }
    boardElement.appendChild(rowElement);
  }

  return boardElement;
};

const inputField = document.createElement('input');
inputField.setAttribute('id', 'input');
inputField.setAttribute('type', 'string');
inputField.innerText = 'Input your name!';
document.body.appendChild(inputField);

const startButton = document.createElement('button');
startButton.id = 'start-button';
startButton.innerText = 'Start';
document.body.appendChild(startButton);

const giveupButton = document.createElement('button');
giveupButton.id = 'giveup-button';
giveupButton.innerText = 'Give up?';
giveupButton.disabled = true;
document.body.appendChild(giveupButton);

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

const getName = () => {
  if (totalGames == 0) {
    nameInput = document.getElementById('input').value;
  }
};

const startGame = () => {
  getName();
  start = window.performance.now();
  makeGame();
  document.getElementById('start-button').disabled = true;
  document.getElementById('giveup-button').disabled = false;
  scoreBoard.innerHTML = `Welcome ${nameInput}!<br>You've scored 0 out of ${maxScore}<br>This is your first game.`;
  document.getElementById('input').disabled = true;
};

const giveUp = () => {
  totalGames += 1;
  checkWinRate();
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      const k = 4 * i + j;
      const card = board[i][j];
      document.getElementById(k).innerHTML = `${card.name}<br>${card.suit}`;
    }
  }
  scoreBoard.innerHTML = `Too bad! Try again! <br>
  Your winning rate is ${winP}% - Total Games Played: ${totalGames}`;
  document.getElementById('start-button').disabled = false;
};

startButton.addEventListener('click', startGame);
giveupButton.addEventListener('click', giveUp);

document.body.appendChild(scoreBoard);
