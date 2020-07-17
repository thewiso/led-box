import RGBColor from './RGBColor';

export default class RGBAColor extends RGBColor {

  private alpha = 0;

  constructor(red: number, green: number, blue: number, alpha: number) {
    super(red, green, blue);
    if (RGBColor.isValidPrimaryColor(alpha)) {
      this.alpha = alpha;
    }
  }

  // public toString() {
  //   return `rgb(${this.red},${this.green},${this.blue})`;
  // }
}
