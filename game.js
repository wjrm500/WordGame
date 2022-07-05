import { Box } from './Box.js';
import { Player } from './Player.js';
import { Grid } from './Grid.js';

let grid = new Grid();

function generateRandomLetter() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphabet[Math.floor(Math.random() * alphabet.length)];
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
                    if (Math.abs(playerBox.x - box.x) <= 1 && Math.abs(playerBox.y - box.y) <= 1) {
                        addBox = true;
                        break;
                    }
                }
                if (addBox) {
                    player.addBox(box);
                    box.setPlayer(player);
                    colorBoxes();
                    document.getElementById('prompt').innerHTML = 'Enter a word';
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
        }
    }
}

function changePlayer() {
    activePlayerIndex = activePlayerIndex == 0 ? 1 : 0;
    document.getElementById('active-player').innerHTML = players[activePlayerIndex].name;
    document.getElementById('word-entry').disabled = true;
    document.getElementById('word-entry').value = '';
    document.getElementById('prompt').innerHTML = 'Click a square next to one of your squares';
}

createBoxes();
let player1 = new Player('Player 1', grid.getBox(0, 0), 'red', document.getElementById('player-1-score'));
let player2 = new Player('Player 2', grid.getBox(7, 7), 'blue', document.getElementById('player-2-score'));
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
                    let wordValid = true;
                    if (response.status != 200) {
                        alert('\'' + word + '\' is not a valid English word!')
                        wordValid = false;
                    }
                    if (wordValid) {
                        player.wordsUsed.push(word);
                        let playerScore = parseInt(player.scoreElement.innerHTML);
                        playerScore += word.length;
                        player.scoreElement.innerHTML = playerScore;
                    }
                    changePlayer();
                });
            }
        )
    }
})