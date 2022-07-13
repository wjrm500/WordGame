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
        this.boxes.push(box);
    }
}