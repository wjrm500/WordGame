export class Box {
    constructor(elem, x, y) {
        this.elem = elem;
        this.x = x;
        this.y = y;
        this.letter = null;
        this.player = null;
    }

    setLetter(letter) {
        this.letter = letter;
        this.elem.innerHTML = letter;
    }

    setPlayer(player) {
        this.player = player;
    }
}