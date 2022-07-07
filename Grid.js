export class Grid {
    constructor(elem) {
        this.elem = elem;
        this.boxes = [];
    }

    addBox(box) {
        this.boxes.push(box);
    }

    getBox(x, y) {
        for (let box of this.boxes) {
            if (box.x == x && box.y == y) {
                return box;
            }
        }
    }
}