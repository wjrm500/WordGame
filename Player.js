export class Player {
    constructor(name, startBox, color, scoreElement) {
        this.name = name;
        this.boxes = [];
        this.boxes.push(startBox);
        startBox.setPlayer(this);
        this.color = color;
        this.wordsUsed = [];
        this.scoreElement = scoreElement;
        this.score = 0;
    }

    addBox(box) {
        if (box.player != null && box.player != this) {
            box.player.boxes = box.player.boxes.filter(x => x != box);
        }
        this.boxes.push(box);
    }
}