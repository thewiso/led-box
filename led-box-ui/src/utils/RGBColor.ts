export default class RGBColor {
  private red = 0;
  private green = 0;
  private blue = 0;

  constructor(red: number, green: number, blue: number) {
    if (RGBColor.isValidColor(red, green, blue)) {
      this.red = red;
      this.green = green;
      this.blue = blue;
    }
  }

  public blend(otherColor: RGBColor, factor: number) {
    const newRed = RGBColor.mergePrimaryColors(this.red, otherColor.red, factor);
    const newGreen = RGBColor.mergePrimaryColors(this.green, otherColor.green, factor);
    const newBlue = RGBColor.mergePrimaryColors(this.blue, otherColor.blue, factor);
    // debugger
    return new RGBColor(newRed, newGreen, newBlue);
  }

  public toString() {
    return `rgb(${this.red},${this.green},${this.blue})`;
  }

  public toHex() {
    const hexParts = new Array(3);
    hexParts[0] = this.red.toString(16);
    hexParts[1] = this.green.toString(16);
    hexParts[2] = this.blue.toString(16);

    for (let i = 0; i < hexParts.length; i++) {
      while (hexParts[i].length < 2) {
        hexParts[i] = "0" + hexParts[i];
      }
    }

    return `#${hexParts[0]}${hexParts[1]}${hexParts[2]}`;
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

  public static fromHex(hex: string): null | RGBColor {
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

    return null;
  }

  public static Black = new RGBColor(0, 0, 0);
  public static White = new RGBColor(255, 255, 255);
}
