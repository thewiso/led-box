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
    return new RGBAColor(rgbColor.red, rgbColor.green, rgbColor.blue, alpha);
  }

  public toString() {
    return `rgba(${this.red},${this.green},${this.blue},${this.alpha})`;
  }
}
