export class RGBA {
    constructor(
        public r: number = 0,
        public g: number = 0,
        public b: number = 0,
        public a: number = 1
    ) {
    }

    static parseRgbaString(value: string): RGBA | null {
        const rgba = value.match(/[\d\.]+/g)?.map(Number);
        return rgba == undefined || rgba.length < 3 ? null : new RGBA(...rgba);
    }

    static fromInt32(color: number): RGBA {
        let int32Color = color | 0; // to signed int32
        let a = (int32Color & 0xFF) / 255;
        let b = (int32Color >> 8) & 0xFF;
        let g = (int32Color >> 16) & 0xFF;
        let r = (int32Color >> 24) & 0xFF;
        return new RGBA(r, g, b, a);
    }

    toInt32() {
        let num = this.r;
        num <<= 8;
        num |= this.g;
        num <<= 8;
        num |= this.b;
        num <<= 8;
        num |= this.a * 255;
        return num | 0; // to signed int32
    }

    toRgbaString(): string {
        return this.a == 1
            ? `rgb(${this.r},${this.g},${this.b})`
            : `rgba(${this.r},${this.g},${this.b},${this.a.toFixed(2)})`;
    }
}
