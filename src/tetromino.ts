import { CELL_SIZE } from '../src/index';
import { Color } from '../src/color';
import { Grid } from './grid';

export const TETROMINO_DATA = {
    i: {
        cells:
            [
                [
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ],
                [
                    [1, 0, 0, 0],
                    [1, 0, 0, 0],
                    [1, 0, 0, 0],
                    [1, 0, 0, 0]
                ],
            ],
        color: Color.LightBlue
    },
    o: {
        cells:
            [
                [
                    [1, 1, 0, 0],
                    [1, 1, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ]
            ],
        color: Color.Yellow
    },
    t: {
        cells:
            [
                [
                    [1, 1, 1, 0],
                    [0, 1, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ],
                [
                    [0, 1, 0, 0],
                    [0, 1, 1, 0],
                    [0, 1, 0, 0],
                    [0, 0, 0, 0],
                ],
                [
                    [0, 1, 0, 0],
                    [1, 1, 0, 0],
                    [0, 1, 0, 0],
                    [0, 0, 0, 0],
                ],
                [
                    [0, 1, 0, 0],
                    [1, 1, 1, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ],
            ],
        color: Color.Pink
    },
    j: {
        cells:
            [
                [
                    [0, 1, 0, 0],
                    [0, 1, 0, 0],
                    [1, 1, 0, 0],
                    [0, 0, 0, 0],
                ],
                [
                    [0, 0, 0, 0],
                    [1, 0, 0, 0],
                    [1, 1, 1, 0],
                    [0, 0, 0, 0],
                ],
                [
                    [1, 1, 0, 0],
                    [0, 1, 0, 0],
                    [0, 1, 0, 0],
                    [0, 0, 0, 0],
                ],
            ],
        color: Color.DarkBlue
    },
    l: {
        cells:
            [
                [
                    [1, 0, 0, 0],
                    [1, 0, 0, 0],
                    [1, 1, 0, 0],
                    [0, 0, 0, 0],
                ],
                [
                    [0, 1, 0, 0],
                    [0, 1, 0, 0],
                    [1, 1, 0, 0],
                    [0, 0, 0, 0],
                ],
                [
                    [1, 1, 0, 0],
                    [0, 1, 0, 0],
                    [0, 1, 0, 0],
                    [0, 0, 0, 0],
                ],
            ],
        color: Color.Orange
    },
    s: {
        cells:
            [
                [
                    [0, 1, 1, 0],
                    [1, 1, 0, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ],
                [
                    [1, 0, 0, 0],
                    [1, 1, 0, 0],
                    [0, 1, 0, 0],
                    [0, 0, 0, 0],
                ],
            ],
        color: Color.Green
    },
    z: {
        cells:
            [
                [
                    [1, 1, 0, 0],
                    [0, 1, 1, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ],
                [
                    [0, 1, 0, 0],
                    [1, 1, 0, 0],
                    [1, 0, 0, 0],
                    [0, 0, 0, 0],
                ],
            ],
        color: Color.Red
    },
};

function collBetweenRects(rect1: PIXI.Rectangle, rect2: PIXI.Rectangle): boolean {
    return rect1.x < rect2.x + rect2.width
        && rect1.x + rect1.width > rect2.x
        && rect1.y < rect2.y + rect2.height
        && rect1.y + rect1.height > rect2.y;
}

export class Tetromino {
    container: PIXI.Container;
    index: number;
    readonly maxIndex: number;
    readonly cells: number[][][];
    mirroredVertically: boolean;
    color: Color;

    constructor(cells: number[][][], color: Color) {
        this.container = new PIXI.Container;
        this.index = 0;
        this.maxIndex = cells.length - 1;
        this.cells = cells;
        this.mirroredVertically = false;
        this.color = color;
    }

    collWith(other: PIXI.Container): boolean {
        this.container.calculateBounds();

        console.log(this.container.children.length);
        for (const thisChild of this.container.children) {
            const thisChildBounds = thisChild.getBounds();

            for (const otherChild of other.children) {
                const otherChildBounds = otherChild.getBounds();

                if (collBetweenRects(thisChildBounds, otherChildBounds)) {
                    return true;
                }
            }
        }

        return false;
    }

    keepWithinHorizontalBorder() {
        if (this.container.x < 0) {
            this.container.x = 0;
        } else if (this.container.x > Grid.width * CELL_SIZE - this.container.width) {
            this.container.x = Grid.width * CELL_SIZE - this.container.width;
        }
    }

    collWithVerticalBorder(): boolean {
        return this.container.y > Grid.height * CELL_SIZE - this.container.height;
    }

    rotateLeft() {
        this.index -= 1;
        if (this.index < 0) {
            this.index = this.maxIndex;
        }
    }

    rotateRight() {
        this.index += 1;
        if (this.index > this.maxIndex) {
            this.index = 0;
        }
    }

    mirrorVertically() {
        this.mirroredVertically = !this.mirroredVertically;
        if (this.mirroredVertically) {
            this.index = 0;
        } else {
            this.index = this.maxIndex;
        }
    }

    rebuild() {
        this.container.removeChildren();
        this.container.addChild(this.build());
    }

    build(): PIXI.Container {
        let container = new PIXI.Container;

        let y = 0;
        for (const row of this.cells[this.index]) {
            let x = 0;
            for (const cell of row) {
                if (cell == 1) {
                    const tetrominoSprite = new PIXI.Sprite(PIXI.Texture.WHITE);
                    tetrominoSprite.width = CELL_SIZE;
                    tetrominoSprite.height = CELL_SIZE;
                    tetrominoSprite.tint = Color.toNumber(this.color);
                    tetrominoSprite.position.set(x * CELL_SIZE, y * CELL_SIZE);
                    container.addChild(tetrominoSprite);
                }
                x += 1;
            }
            y += 1;
        }

        return container;
    }
}
