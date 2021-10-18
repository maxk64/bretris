import { Color } from '../src/color';

export class Grid {
    static readonly width = 10;
    static readonly height = 20;
    grid: Color[][];

    constructor() {
        this.grid = new Array<Array<Color>>();

        for (let y = 0; y <= Grid.height; y++) {
            let row: Color[] = new Array<Color>();
            for (let x = 0; x <= Grid.width; x++) {
                row.push(Color.None);
            }
            this.grid.push(row);
        }
    }


    // drawTo(graphics: PIXI.Graphics) {
    //     let y = 0;
    //     for (const row of this.grid) {
    //         let x = 0;
    //         for (const color of row) {
    //             if (color != Color.None) {
    //                 this.setColor(color, graphics);
    //                 graphics.drawRect(x * 50, y * 50, 50, 50);
    //             }
    //             x += 1;
    //         }
    //         y += 1;
    //     }

    //     graphics.endFill();
    // }

    set(x: number, y: number, color: Color) {
        this.grid[y][x] = color;
    }
}

