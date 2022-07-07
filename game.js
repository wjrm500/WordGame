import { Box } from './Box.js';
import { Player } from './Player.js';
import { Grid } from './Grid.js';
import { generateRandomLetter } from './randomLetter.js';

let grid = new Grid(document.getElementById('grid'));
let players, activePlayerIndex;

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
        grid.elem.appendChild(row);
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

function createPlayers() {
    let player1 = new Player('Player 1', grid.getBox(0, 0), 'red', document.getElementById('player-1-score'));
    let player2 = new Player('Player 2', grid.getBox(dimension - 1, dimension - 1), 'blue', document.getElementById('player-2-score'));
    players = [player1, player2];
    activePlayerIndex = 0;
}

function changePlayer() {
    activePlayerIndex = activePlayerIndex == 0 ? 1 : 0;
    for (let elem of document.getElementsByClassName('inner-box')) {
        elem.classList.replace('inactive', 'active');
    }
    let player = players[activePlayerIndex];
    document.getElementById('active-player').style.color = player.color;
    document.getElementById('active-player').innerHTML = player.name;
    document.getElementById('word-entry-container').classList.replace('active', 'inactive');
    document.getElementById('word-entry').disabled = true;
    document.getElementById('word-entry').value = '';
    document.getElementById('prompt').innerHTML = 'Click a square next to one of your squares';
}

let dimension = 8;
createGrid(dimension);
// createBoxes();
createPlayers();
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