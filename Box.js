import { generateRandomLetter } from './randomLetter.js';
import { players, activePlayerIndex, colorBoxes } from './game.js';

export class Box {
    constructor(elem, x, y) {
        this.elem = elem;
        this.x = x;
        this.y = y;
        this.letter = null;
        this.player = null;
        this.setLetter(generateRandomLetter());
        let box = this;
        this.elem.addEventListener('click', function() {
            // debugger;
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
    }

    setLetter(letter) {
        this.letter = letter;
        this.elem.innerHTML = letter;
    }

    setPlayer(player) {
        this.player = player;
    }
}