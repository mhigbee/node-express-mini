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

// Get random word
const getRandomWord = () => {
  const arrayOfWords = readWords();
  return arrayOfWords[(Math.floor(Math.random() * arrayOfWords.length))];
};

// Keep track of random word;

const finalWord = getRandomWord().toLowerCase();

let wordSoFar = '';

const setWordSoFarToSymbols = () => {
  if(wordSoFar.length !== finalWord.length) {
    for (let i = 0; i < finalWord.length; i++) {
      wordSoFar = wordSoFar.concat('-');
    };
  }
};

const setWordSoFar = (letterGuess) => {
  if(letterGuess.length === 1) {
    for (let i = 0; i < finalWord.length; i++){
      if(finalWord[i] === letterGuess) {
        wordSoFar.splice(i, 0, letterGuess);
      }
    }
  }
  return "Please guess using one letter";
}

// TODO: your code to handle requests

server.get('/', (req, res) => {
  res.send(wordSoFar);
  setWordSoFarToSymbols();
  console.log(wordSoFar);
});

server.post('/guess', (req, res) => {
  // get the user letter
  // verify that it is only one letter
  // compare the letter to the finalWord
  // if that letter (req) is found in the finalWord
  // then we change wordSoFar to reflect that.
  // wordSoFar (splice i in the letter)
  let letterGuess = req.body.data;
  setWordSoFar(letterGuess);
  res.send(finalWord);
});

server.listen(3000);
