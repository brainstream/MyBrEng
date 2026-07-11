export class RGBA {
    constructor(
        public r = 0,
        public g = 0,
        public b = 0,
        public a = 1
    ) {
    }

    public static parseRgbaString(value: string): RGBA | null {
        const rgba = value.match(/[\d.]+/g)?.map(Number);
        return rgba === undefined || rgba.length < 3 ? null : new RGBA(...rgba);
    }

    public static fromInt32(color: number): RGBA {
        const int32Color = color | 0; // to signed int32
        const a = (int32Color & 0xFF) / 255;
        const b = (int32Color >> 8) & 0xFF;
        const g = (int32Color >> 16) & 0xFF;
        const r = (int32Color >> 24) & 0xFF;
        return new RGBA(r, g, b, a);
    }

    public toInt32(): number {
        let num = this.r;
        num <<= 8;
        num |= this.g;
        num <<= 8;
        num |= this.b;
        num <<= 8;
        num |= this.a * 255;
        return num | 0; // to signed int32
    }

    public toRgbaString(): string {
        return this.a === 1 ?
            `rgb(${this.r},${this.g},${this.b})` :
            `rgba(${this.r},${this.g},${this.b},${this.a.toFixed(2)})`;
    }
}
