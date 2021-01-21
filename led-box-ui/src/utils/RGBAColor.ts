import RGBColor from "./RGBColor";

export default class RGBAColor extends RGBColor {
  private alpha = 0;

  constructor(red: number, green: number, blue: number, alpha: number) {
    super(red, green, blue);
    if (alpha >= 0 && alpha <= 1) {
      this.alpha = alpha;
    }
  }

  public static fromRGBColor(rgbColor: RGBColor, alpha: number) {
    return new RGBAColor(rgbColor.r, rgbColor.g, rgbColor.b, alpha);
  }

  public toString() {
    return `rgba(${this.r},${this.g},${this.b},${this.alpha})`;
  }
}
