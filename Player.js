export class Player {
    constructor(name, startBox, color) {
        this.name = name;
        this.boxes = [];
        this.boxes.push(startBox);
        startBox.setPlayer(this);
        this.color = color;
    }

    addBox(box) {
        this.boxes.push(box);
    }
}