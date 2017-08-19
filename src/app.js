const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

/* Returns a list of dictionary words from the words.txt file. */
const readWords = () => {
  const contents = fs.readFileSync('words.txt', 'utf8');
  return contents.split('\n');
};

// Set new String prototype method
String.prototype.splice = function(startIndex, charDelete, strInsert) {
  const charArray = this.split('');
  Array.prototype.splice.apply(charArray, arguments);
  return charArray.join('');
}

// Get random word
const getRandomWord = () => {
  const arrayOfWords = readWords();
  return arrayOfWords[(Math.floor(Math.random() * arrayOfWords.length))];
};

// Keep track of random word;
const finalWord = getRandomWord().toLowerCase();
console.log(finalWord);

let wordSoFar = '';

const initiateHiddenWord = (x) => {
  for (let i = 0; i < x.length - 1; i++) {
    wordSoFar += '-';
  }
}

initiateHiddenWord(finalWord);

console.log(`${wordSoFar}, ${wordSoFar.length}`);

// track guesses

const successfulGuesses = [];
const badGuesses = [];
let guesses = [];
let won = false;

const processGuess = (x) => {
  const resObj = { wordSoFar, guesses: guesses.length };
  if (won) return { message: 'You won! Refresh the page to try another word' };
  if (badGuesses.length === 5) {
    resObj = { message: 'You lost! Refresh the page to try another word.' };
    return resObj;
  }
  if (guesses.includes(x)) {
    resObj.message = `You\'ve already tried ${x}`;
    return resObj;
  }
  let wasgood = false;
  for (let i = 0; i < finalWord.length - 1; i++) {
    if (x === finalWord[i]) {
      let newWordSoFar = wordSoFar.split('');
      newWordSoFar[i] = x;
      wordSoFar = newWordSoFar.join('');
      console.log(wordSoFar);
      wasgood = true;
    }
  }
  if (wasgood) {
    successfulGuesses.push(x);
    if (checkWin(wordSoFar)) {
      won = true;
      return { message: 'You win!' };
    }
    resObj.wordSoFar = wordSoFar;
    resObj.message = `${x} was a good guess.`
  }
  else {
    badGuesses.push(x);
    resObj.message = `${x} was a bad guess.`
  }
  guesses = successfulGuesses.concat(badGuesses);
  resObj.guesses = guesses.length;
  resObj.guessesLeft = 5 - badGuesses.length;
  return resObj;
};

const checkWin = function(str) {
  let isGood = true;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '-') isGood = false;
  }
  return isGood;
}

// TODO: your code to handle requests

server.get('/', (req, res) => {
  res.send({ message: 'Welcome!  '});
});

server.post('/guess', (req, res) => {
  // get the user letter
  // verify that it is only one letter
  // compare the letter to the finalWord
  // if that letter (req) is found in the finalWord
  // then we change wordSoFar to reflect that.
  // wordSoFar (splice i in the letter)
  // const letterGuess = req.body.data;
  // setWordSoFar(letterGuess);
  // res.send(finalWord);
  const { letter } = req.body;
  console.log(req.body);
  if (!letter || letter.length !== 1) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: 'We need a single letter from you!' });
    return;
  }
  res.json(processGuess(letter));
});

server.listen(3000);
console.log('Server up and running on port 3000');
