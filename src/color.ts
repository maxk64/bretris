enum Color {
    LightBlue, Yellow, Pink, DarkBlue, Orange, Green, Red, None
}

namespace Color {
    export function toNumber(color: Color): number {
        switch (color) {
            case Color.LightBlue:
                return 0x7777ff;
            case Color.Yellow:
                return 0xffff00;
            case Color.Pink:
                return 0xff00ff;
            case Color.DarkBlue:
                return 0x0000ff;
            case Color.Orange:
                return 0xff7700;
            case Color.Green:
                return 0x00ff00;
            case Color.Red:
                return 0xff0000;
            case Color.None:
                console.error('No color!');
                return 0x000000;
        }
    }
}

export { Color };
