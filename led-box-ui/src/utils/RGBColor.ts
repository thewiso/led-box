export default class RGBColor {
  protected _red = 0;
  protected _green = 0;
  protected _blue = 0;

  private static readonly RGB_REGEX = /rgb\((\d+),(\d+),(\d+)\)/g;

  constructor(red: number, green: number, blue: number) {
    if (RGBColor.isValidColor(red, green, blue)) {
      this._red = red;
      this._green = green;
      this._blue = blue;
    }
  }

  public get red() {
    return this._red;
  }

  public get green() {
    return this._green;
  }

  public get blue() {
    return this._blue;
  }

  public blend(otherColor: RGBColor, factor: number) {
    const newRed = RGBColor.mergePrimaryColors(this._red, otherColor.red, factor);
    const newGreen = RGBColor.mergePrimaryColors(this._green, otherColor.green, factor);
    const newBlue = RGBColor.mergePrimaryColors(this._blue, otherColor.blue, factor);
    return new RGBColor(newRed, newGreen, newBlue);
  }

  public toString() {
    return `rgb(${this._red},${this._green},${this._blue})`;
  }

  public toHex() {
    const hexParts = new Array(3);
    hexParts[0] = this._red.toString(16);
    hexParts[1] = this._green.toString(16);
    hexParts[2] = this._blue.toString(16);

    for (let i = 0; i < hexParts.length; i++) {
      while (hexParts[i].length < 2) {
        hexParts[i] = "0" + hexParts[i];
      }
    }

    return `#${hexParts[0]}${hexParts[1]}${hexParts[2]}`;
  }

  public toRGBAString(alpha: number) {
    return `rgba(${this._red},${this._green},${this._blue},${alpha})`;
  }

  public static isValidPrimaryColor(primaryColor: number): boolean {
    return primaryColor >= 0 && primaryColor <= 255 && primaryColor % 1 === 0;
  }

  public static isValidColor(red: number, green: number, blue: number) {
    return (
      RGBColor.isValidPrimaryColor(red) && RGBColor.isValidPrimaryColor(green) && RGBColor.isValidPrimaryColor(blue)
    );
  }

  public static mergePrimaryColors(primaryColor1: number, primaryColor2: number, factor: number) {
    return Math.round((1 - factor) * primaryColor1 + factor * primaryColor2);
  }

  public static fromHex(hex: string): RGBColor | undefined {
    if (hex.startsWith("#")) {
      hex = hex.substring(1);
    }

    if (hex.length === 6) {
      const red = parseInt(hex.substring(0, 2), 16);
      const green = parseInt(hex.substring(2, 4), 16);
      const blue = parseInt(hex.substring(4, 6), 16);

      if (RGBColor.isValidColor(red, green, blue)) {
        return new RGBColor(red, green, blue);
      }
    }

    return undefined;
  }

  public static fromString(colorString: string): RGBColor | null {
    colorString = colorString.replaceAll(/\s/g, "");
    const matches = RGBColor.RGB_REGEX.exec(colorString);

    if (matches?.length === 4) {
      return new RGBColor(parseInt(matches[1]), parseInt(matches[2]), parseInt(matches[3]));
    }
    return null;
  }

  public static Black = new RGBColor(0, 0, 0);
  public static White = new RGBColor(255, 255, 255);
}
