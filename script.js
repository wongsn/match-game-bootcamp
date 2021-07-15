// Please implement exercise logic here

let minute;
let seconds;
const delayInMilliseconds = 1000;

let ref;

// boardSize has to be an even number
let nameInput;
const boardSize = 4;
let board = [];
let gameWins = 0;
let gameLoss = 0;
let totalGames = gameWins + gameLoss;
let winP = 0;
const checkWinRate = () => {
  if (totalGames == 0) {
    winP = 0;
  }
  winP = gameWins / totalGames * 100;
};
let firstCard = null;
let firstCardElement;
let deck;
let score = 0;
const maxScore = (boardSize * boardSize) / 2;
let start;
let canClick = true;

const makeDeck = () => {
  // create the empty deck at the beginning
  const newDeck = [];
  const suits = ['♦', '♣', '♥', '♠'];
  const colors = ['red', 'black'];

  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // make a variable of the current suit
    const currentSuit = suits[suitIndex];
    const currentColor = colors[suitIndex % 2];
    console.log(`current suit: ${currentSuit}`);
    console.log(`current color: ${currentColor}`);

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
        color: currentColor,
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
  let clickedCard = board[column][row];

  const clearCard = () => {
    canClick = true;
    firstCardElement.innerHTML = '';
    cardElement.innerHTML = '';
  };

  const nullify = () => {
    firstCard = null;
    clickedCard = null;
  };

  const mutateCard = () => {
    const p = firstCardElement.cloneNode(true);
    const q = firstCardElement.cloneNode(true);
    cardElement.replaceWith(p);
    cardElement.setAttribute('style', `color: ${clickedCard.color}`);
    cardElement.innerHTML = `${clickedCard.name}<br>${clickedCard.suit}`;
    firstCardElement.replaceWith(q);
    cardElement.setAttribute('style', `color: ${firstCard.color}`);
    firstCardElement.innerHTML = `${firstCard.name}<br>${firstCard.suit}`;
    p.id = 'score';
    q.id = 'score';
  };

  if (canClick == false) {

  }
  // the user already clicked on this square
  else if ((cardElement.innerText !== '' && firstCardElement == undefined) || cardElement.innerText !== '') {
    setTimeout(() => { nullify(); }, 0);
    setTimeout(() => { clearCard(); }, 0);
    console.log(firstCard);
  } else if (firstCard === null) {
    // if third card clicked before all cards cleared
    if (firstCardElement !== undefined) {
      // reset the stage first
      clearCard();
      console.log('first turn');
      setTimeout(() => { firstCard = clickedCard; }, 0);
      // turn this card over
      cardElement.setAttribute('style', `color: ${clickedCard.color}`);
      cardElement.innerHTML = `${clickedCard.name}<br>${clickedCard.suit}`;
      console.log(cardElement);
      // hold onto this for later when it may not match
      firstCardElement = cardElement;
    }
    console.log('first turn');
    setTimeout(() => { firstCard = clickedCard; }, 0);
    // turn this card over
    cardElement.setAttribute('style', `color: ${clickedCard.color}`);
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
      cardElement.setAttribute('style', `color: ${clickedCard.color}`);
      cardElement.innerHTML = `${clickedCard.name}<br>${clickedCard.suit}`;
      if (score == maxScore) {
        gameWins += 1;
        score = 0;
        clearInterval(ref);
        totalGames = gameWins + gameLoss;
        checkWinRate();
        document.getElementById('giveup-button').disabled = true;
        const end = window.performance.now();
        const timing = Math.floor((end - start) / 1000);
        setTimeout(scoreBoard.innerHTML = `<br>You won, in a time of ${timing}s.<br>Your winning rate is ${winP}% - Total Games Played: ${totalGames}`, 5000);
        document.getElementById('start-button').disabled = false;
        return;
      // eslint-disable-next-line no-else-return
      } else {
        scoreBoard.innerHTML = `${score} out of ${maxScore}`;
        setTimeout(() => { scoreBoard.innerHTML += '<br>Match!'; }, 3000);
      }
    } else {
      console.log('NOT a match');
      // turn this card back over
      cardElement.setAttribute('style', `color: ${clickedCard.color}`);
      cardElement.innerHTML = `${clickedCard.name}<br>${clickedCard.suit}`;
      canClick = false;
      setTimeout(() => { clearCard(); }, 3000);
    }

    // reset the first card
    setTimeout(() => { nullify(); }, 0);
  }
};

// create all the board elements that will go on the screen
// return the built board
const buildBoardElements = (board) => {
  // create the element that everything will go inside of
  const boardElement = document.createElement('div');

  // give it a class for CSS purposes
  boardElement.classList.add('board');
  boardElement.id = 'board';
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
      square.id = i * boardSize + j;

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
inputField.setAttribute('style', 'text-align:center');
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

const scoreBoard = document.createElement('div');
scoreBoard.classList.add('scoreBoard');
scoreBoard.innerHTML = 'Welcome!<br> To start, input your name and click the start button';
document.body.appendChild(scoreBoard);
const timer = document.createElement('div');
timer.classList.add('timer');
document.body.appendChild(timer);

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
  minute = 2;
  seconds = 59;
  getName();
  start = window.performance.now();
  if (totalGames > 0) {
    document.getElementById('board').remove();
    board = [];
  }
  makeGame();
  document.getElementById('start-button').disabled = true;
  document.getElementById('giveup-button').disabled = false;
  scoreBoard.innerHTML = `Welcome ${nameInput}!<br> This is Game #${totalGames + 1}. <br>Your winning percentage is ${Math.floor(winP)}%.`;
  timer.innerHTML = `Time left: ${minute}:${seconds}`;

  ref = setInterval(() => {
    timer.innerHTML = `Time left: ${minute}:${seconds}`;

    if (minute <= 0 && seconds <= 0) {
      clearInterval(ref);
      giveUp();
    } else if (minute > 0 && seconds < 1) {
      minute -= 1;
      seconds = 60;
    } seconds -= 1;
  }, delayInMilliseconds);

  document.getElementById('input').disabled = true;
};

const giveUp = () => {
  gameLoss++;
  totalGames = gameWins + gameLoss;
  checkWinRate();
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      const k = boardSize * i + j;
      const card = board[i][j];
      if (document.getElementById(k) == null) {
        continue;
      } const p = document.getElementById(k).cloneNode(true);
      document.getElementById(k).replaceWith(p);
      document.getElementById(k).innerHTML = `${card.name}<br>${card.suit}`;
    }
  }
  score = 0;
  clearInterval(ref);
  scoreBoard.innerHTML = `Too bad! Try again! <br>
  Your winning rate is ${Math.floor(winP)}% - Total Games Played: ${totalGames}`;
  document.getElementById('start-button').disabled = false;
  document.getElementById('giveup-button').disabled = true;
};

startButton.addEventListener('click', startGame);
giveupButton.addEventListener('click', giveUp);

// setInterval
