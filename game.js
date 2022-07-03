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

createBoxes();
let player1 = new Player('Player 1', grid.getBox(0, 0), 'red');
let player2 = new Player('Player 2', grid.getBox(7, 7), 'blue');
let players = [player1, player2];
let activePlayerIndex = 0;
colorBoxes();