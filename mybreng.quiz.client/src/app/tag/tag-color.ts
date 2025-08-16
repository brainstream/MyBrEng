import { RGBA } from "@app/shared";

export class TagColor {
    readonly bg: string;
    readonly fg: string;

    constructor(color?: number) {
        let rgba = RGBA.fromInt32(color ?? 0);
        this.bg = rgba.toRgbaString();
        if (rgba.a < 1) {
            const bodyBg = TagColor.getBodyBackgroundColor();
            rgba.r = Math.round(rgba.r * rgba.a + bodyBg.r * (1 - rgba.a));
            rgba.g = Math.round(rgba.g * rgba.a + bodyBg.g * (1 - rgba.a));
            rgba.b = Math.round(rgba.b * rgba.a + bodyBg.b * (1 - rgba.a));
        }
        if (0.299 * rgba.r + 0.587 * rgba.g + 0.114 * rgba.b <= 128) {
            this.fg = 'rgb(250, 250, 250)';
        } else {
            this.fg = 'rgb(33, 33, 33)';
        }
    }

    private static getBodyBackgroundColor(): RGBA {
        const body = document.getElementsByTagName('body')[0];
        return RGBA.parseRgbaString(getComputedStyle(body).backgroundColor) ?? new RGBA();
    }
}
