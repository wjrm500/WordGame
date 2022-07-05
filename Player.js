export class Player {
    constructor(name, startBox, color, scoreElement) {
        this.name = name;
        this.boxes = [];
        this.boxes.push(startBox);
        startBox.setPlayer(this);
        this.color = color;
        this.wordsUsed = [];
        this.scoreElement = scoreElement;
    }

    addBox(box) {
        this.boxes.push(box);
    }
}