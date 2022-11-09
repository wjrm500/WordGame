import { Box } from './Box.js';
import { Player } from './Player.js';
import { Grid } from './Grid.js';

let grid = new Grid(document.getElementById('grid'));

let missingWords = ['BE', 'FOR', 'IS', 'WAS']; // As this grows, put in separate file and load

function createGrid(dimension) {
    for (let i = 0; i < dimension; i++) {
        let row = document.createElement('div');
        row.classList.add('row');
        for (let j = 0; j < dimension; j++) {
            let outerBox = document.createElement('div');
            outerBox.classList.add('outer-box');
            let innerBox = document.createElement('div');
            innerBox.classList.add('inner-box', 'active');
            outerBox.appendChild(innerBox);
            row.appendChild(outerBox);
            let box = new Box(innerBox, i, j);
            grid.addBox(box);
        }
        grid.elem.appendChild(row);
    }
}

export function colorBoxes() {
    for (let box of grid.boxes) {
        if (box.player != null) {
            box.elem.style.backgroundColor = box.player.color;
            box.elem.style.color = 'white';
            box.elem.style.border = '1px solid black';
        }
    }
}

function enableGrid() {
    document.getElementById('prompt').innerHTML = 'Click a square next to one of your squares.';
    for (let elem of document.getElementsByClassName('inner-box')) {
        elem.classList.replace('inactive', 'active');
    }
}

export function disableGrid() {
    for (let elem of document.getElementsByClassName('inner-box')) {
        elem.classList.replace('active', 'inactive');
    }
}

export function enableWordEntry() {
    document.getElementById('prompt').innerHTML = 'Enter a word that can be formed by your letters.';
    document.getElementById('word-entry-container').classList.replace('inactive', 'active');
    document.getElementById('word-entry').disabled = false;
    document.getElementById('word-entry').focus();
}

function disableWordEntry() {
    document.getElementById('word-entry-container').classList.replace('active', 'inactive');
    document.getElementById('word-entry').disabled = true;
    document.getElementById('word-entry').value = '';
}

function checkWin() {
    let actualScores = players.slice(0, activePlayerIndex + 1).map(x => x.score);
    let potentialScores = players.slice(activePlayerIndex + 1).map(x => x.score + x.boxes.length + 1);
    let allScores = [...actualScores, ...potentialScores];
    for (let i = 0; i < players.length; i++) {
        let player = players[i];
        if (player.score >= winningScore) {
            let allScoresCopy = [...allScores];
            allScoresCopy.splice(i, 1);
            let scoreToBeat = Math.max(...allScoresCopy);
            if (player.score > scoreToBeat) {
                disableGrid();
                disableWordEntry();
                document.getElementById('winner-banner').classList.add('fade-in');
                document.getElementById('winning-player').innerHTML = player.name;
                return true;
            }
        }
    }
    return false;
}

function changePlayer() {
    if (checkWin()) return; 
    timeTaken = 0;
    activePlayerIndex += 1;
    if (activePlayerIndex >= players.length) {
        activePlayerIndex = 0;
    }
    let player = players[activePlayerIndex];
    document.getElementById('active-player').style.color = player.color;
    document.getElementById('active-player').innerHTML = player.name;
    enableGrid();
    disableWordEntry();
    clearInterval(countdownInterval);
    countdownInterval = setInterval(countdown, 50);
}

let textFlash = document.getElementById('text-flash');
textFlash.addEventListener('animationend', function() {
    if (this.classList.contains('font-grow')) {
        this.classList.remove('font-grow');
    }
});

export function flyingText(color, content) {
    textFlash.style.color = color;
    textFlash.innerHTML = content;
    textFlash.classList.add('font-grow');
}

let dimension = 5;
let winningScore = dimension * 5;
document.getElementById('winning-score').innerHTML = winningScore;
var timeLimit = 30;
var timeTaken = 0;
function countdown() {
    if (timeTaken >= timeLimit) {
        changePlayer();
    }
    document.getElementById('timer').innerHTML = Math.round(timeLimit - timeTaken);
    timeTaken += 0.05;
}
countdown();
let countdownInterval = setInterval(countdown, 50);
function volatileBoxes() {
    if (Math.random() > (1 - dimension / 50)) {
        let randomBox = grid.getRandomBox();
        randomBox.elem.classList.add('shaking');
        setTimeout(function() {
            randomBox.switchLetter();
            randomBox.elem.classList.remove('shaking');
        }, 5000);
    }
}
setInterval(volatileBoxes, 1000);
createGrid(dimension);
let player1 = new Player('Player 1', grid.getBox(0, 0), 'red', document.getElementById('player-1-score'));
let player2 = new Player('Player 2', grid.getBox(dimension - 1, dimension - 1), 'blue', document.getElementById('player-2-score'));
export let players = [player1, player2];
export let activePlayerIndex = 0;
colorBoxes();
document.getElementById('active-player').innerHTML = players[activePlayerIndex].name;
document.getElementById('word-entry').addEventListener('keypress', function(evt) {
    if (evt.key == 'Enter') {
        let player = players[activePlayerIndex];
        let word = this.value.toUpperCase();

        // Check whether player has already used word
        if (player.wordsUsed.includes(word)) {
            flyingText('red', 'Already used!');
            changePlayer();
            return;
        }
        
        // Check whether word can be formed from letters
        let wordLetters = word.split('');
        let playerLetters = [];
        for (let box of player.boxes) {
            playerLetters.push(box.letter);
        }
        for (let wordLetter of wordLetters) {
            let letterIndex = playerLetters.findIndex(x => x == wordLetter);
            if (letterIndex == -1) {
                flyingText('red', 'Incorrect letters!');
                changePlayer();
                return;
            } else {
                playerLetters.splice(letterIndex, 1);
            }
        }

        // Check whether word is valid English
        let url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + word;
        fetch(url).then(
            response => {
                response.json().then(function() {
                    if (missingWords.includes(word) || response.status == 200) {
                        player.wordsUsed.push(word);
                        let playerScore = parseInt(player.scoreElement.innerHTML);
                        playerScore += word.length;
                        player.score += word.length;
                        player.scoreElement.innerHTML = playerScore;
                        flyingText('limegreen', '+' + word.length); 
                    } else {
                        flyingText('red', 'Invalid word!');
                    }
                    changePlayer();
                });
            }
        )
    }
});