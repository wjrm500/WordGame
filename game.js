import { Box } from './Box.js';
import { Player } from './Player.js';
import { Grid } from './Grid.js';

const letterFrequencies = {
    'A': 0.0812,
    'B': 0.0149,
    'C': 0.0271,
    'D': 0.0432,
    'E': 0.1202,
    'F': 0.023,
    'G': 0.0203,
    'H': 0.0592,
    'I': 0.0731,
    'J': 0.001,
    'K': 0.0069,
    'L': 0.0398,
    'M': 0.0261,
    'N': 0.0695,
    'O': 0.0768,
    'P': 0.0182,
    'Q': 0.0011,
    'R': 0.0602,
    'S': 0.0628,
    'T': 0.091,
    'U': 0.0288,
    'V': 0.0111,
    'W': 0.0209,
    'X': 0.0017,
    'Y': 0.0211,
    'Z': 0.0007    
}

function generateRandomLetter() {
    let letter, sum = 0, r = Math.random();
    for (letter in letterFrequencies) {
        sum += letterFrequencies[letter];
        if (r <= sum) return letter;
    }
}

let grid = new Grid();

function createGrid(dimension) {
    let grid = document.getElementById('grid');
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
        }
        grid.appendChild(row);
    }
}

function createBoxes() {
    let rows = document.getElementsByClassName('row');
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        let boxElems = row.getElementsByClassName('inner-box')
        for (let j = 0; j < boxElems.length; j++) {
            let boxElem = boxElems[j];
            let box = new Box(boxElem, i, j);
            box.elem.addEventListener('click', function() {
                if (!document.getElementById('word-entry').disabled) {
                    alert('Enter a word!');
                    return;
                }
                let player = players[activePlayerIndex];
                let addBox = false;
                for (let playerBox of player.boxes) {
                    let sameBox = box.x == playerBox.x && box.y == playerBox.y;
                    if (!sameBox && Math.abs(playerBox.x - box.x) <= 1 && Math.abs(playerBox.y - box.y) <= 1) {
                        addBox = true;
                        break;
                    }
                }
                if (addBox) {
                    player.addBox(box);
                    box.setPlayer(player);
                    colorBoxes();
                    for (let elem of document.getElementsByClassName('inner-box')) {
                        elem.classList.replace('active', 'inactive');
                    }
                    document.getElementById('prompt').innerHTML = 'Enter a word that can be formed by your letters';
                    document.getElementById('word-entry-container').classList.replace('inactive', 'active');
                    document.getElementById('word-entry').disabled = false;
                    document.getElementById('word-entry').focus();
                } else {
                    alert('You can\'t go here!');
                }
            });
            box.setLetter(generateRandomLetter());
            grid.addBox(box);
        }
    }
}

function colorBoxes() {
    for (let box of grid.boxes) {
        if (box.player != null) {
            box.elem.style.backgroundColor = box.player.color;
            box.elem.style.color = 'white';
            box.elem.style.border = '1px solid black';
        }
    }
}

function changePlayer() {
    activePlayerIndex = activePlayerIndex == 0 ? 1 : 0;
    for (let elem of document.getElementsByClassName('inner-box')) {
        elem.classList.replace('inactive', 'active');
    }
    document.getElementById('active-player').innerHTML = players[activePlayerIndex].name;
    document.getElementById('word-entry-container').classList.replace('active', 'inactive');
    document.getElementById('word-entry').disabled = true;
    document.getElementById('word-entry').value = '';
    document.getElementById('prompt').innerHTML = 'Click a square next to one of your squares';
}

let dimension = 10;
createGrid(dimension);
createBoxes();
let player1 = new Player('Player 1', grid.getBox(0, 0), 'red', document.getElementById('player-1-score'));
let player2 = new Player('Player 2', grid.getBox(dimension - 1, dimension - 1), 'blue', document.getElementById('player-2-score'));
let players = [player1, player2];
let activePlayerIndex = 0;
colorBoxes();
document.getElementById('active-player').innerHTML = players[activePlayerIndex].name;
document.getElementById('word-entry').addEventListener('keypress', function(evt) {
    if (evt.key == 'Enter') {
        let player = players[activePlayerIndex];
        let word = this.value.toUpperCase();

        // Check whether player has already used word
        if (player.wordsUsed.includes(word)) {
            alert('You\'ve already used the word ' + word);
            changePlayer();
            return;
        }
        
        // Check whether word can be formed from letters
        let wordLetters = word.split('');
        let playerLetters = [];
        for (let box of player.boxes) {
            playerLetters.push(box.letter);
        }
        let playerLetterString = playerLetters.join(','); // Before splice
        for (let wordLetter of wordLetters) {
            let letterIndex = playerLetters.findIndex(x => x == wordLetter);
            if (letterIndex == -1) {
                alert('You cannot form the word \'' + word + '\' with the letters \'' + playerLetterString + '\'');
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
                response.json().then(function(json) {
                    if (response.status == 200) {
                        player.wordsUsed.push(word);
                        let playerScore = parseInt(player.scoreElement.innerHTML);
                        playerScore += word.length;
                        player.scoreElement.innerHTML = playerScore;
                    } else {
                        alert('\'' + word + '\' is not a valid English word!')
                    }
                    changePlayer();
                });
            }
        )
    }
})