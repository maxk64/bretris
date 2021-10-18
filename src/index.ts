export const CELL_SIZE = 25;

import * as PIXI from 'pixi.js';
import { Grid } from '../src/grid';
import { Tetromino, TETROMINO_DATA } from '../src/tetromino';

const app = new PIXI.Application({
    backgroundColor: 0x6495ed,
    width: Grid.width * CELL_SIZE,
    height: Grid.height * CELL_SIZE
});
document.body.appendChild(app.view);
app.view.style.position = 'absolute';
app.view.style.top = '0';
app.view.style.left = '0';

function getNextTetromino(): Tetromino {
    const arr = Object.values(TETROMINO_DATA);
    console.log(arr);
    const i = Math.floor(Math.random() * arr.length);
    const tetromino = new Tetromino(arr[i].cells, arr[i].color);

    tetromino.container = tetromino.build();

    app.stage.addChild(tetromino.container);

    return tetromino;
}

let activeTetromino = getNextTetromino();
const inactiveTetrominoContainers = new Array<PIXI.Container>();

const downKeys = new Map<string, boolean>();
document.onkeydown = (event) => {
    const key = event.key.toLowerCase();

    if (key == 'arrowup') {
        //activeTetromino.container.scale.y *= -1;
        activeTetromino.mirrorVertically();
        activeTetromino.rebuild();
    } else if (key == 'arrowleft') {
        activeTetromino.rotateLeft();
        activeTetromino.rebuild();
    } else if (key == 'arrowright') {
        activeTetromino.rotateRight();
        activeTetromino.rebuild();
    } else {
        downKeys.set(key, true);
        return;
    }

    // Prevent the defaults only for the arrow keys
    event.preventDefault();
};

document.onkeyup = (event) => {
    const key = event.key.toLowerCase();
    downKeys.set(key, false);
    event.preventDefault();
};

let stop = false;
let fallTimer = 0;
let movementTimer = 0;
app.ticker.add((dt) => {
    if (stop) { return; }
    fallTimer += dt;
    movementTimer += dt;

    if (fallTimer > 50) {
        activeTetromino.container.y += CELL_SIZE;

        fallTimer = 0;
    } else if (movementTimer > 2.5) {
        if (downKeys.get('a')) {
            activeTetromino.container.x -= CELL_SIZE;
            activeTetromino.keepWithinHorizontalBorder();
        } else if (downKeys.get('d')) {
            activeTetromino.container.x += CELL_SIZE;
            activeTetromino.keepWithinHorizontalBorder();
        } else if (downKeys.get('s')) {
            // hard drop
        } else if (downKeys.get('w')) {
            // soft drop
            activeTetromino.container.y += CELL_SIZE;
        }

        movementTimer = 0;
    }

    if (activeTetromino.collWithVerticalBorder()) {
        activeTetromino.container.y -= CELL_SIZE;
        inactiveTetrominoContainers.push(activeTetromino.container);
        activeTetromino = getNextTetromino();

        return;
    }

    for (const inactiveTetrominoContainer of inactiveTetrominoContainers) {
        if (activeTetromino.collWith(inactiveTetrominoContainer)) {
            activeTetromino.container.y -= CELL_SIZE;
            inactiveTetrominoContainers.push(activeTetromino.container);
            activeTetromino = getNextTetromino();

            return;
        }
    }
});
