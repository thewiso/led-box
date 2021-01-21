import RGBColor from "./RGBColor";
import { LEDPattern } from "@/api";
import { ColorCountMin, ColorCountMax, RepititionFactorMin, RepititionFactorMax, ColorGradientLengthFactorMin, ChaseGradientLengthFactorMax } from "./LEDPatternConstraints";
import { getRandomInt, getRandom } from "./RandomUtils";

export default class LEDPatternImpl implements LEDPattern {
  public id?: number;
  public colors: RGBColor[];
  public repitionFactor: number;
  public colorGradientLengthFactor: number;
  public name: string;
  public patternType = "LEDPattern";

  constructor(pattern?: LEDPattern) {
    if (pattern !== undefined) {
      this.id = pattern.id;
      this.name = pattern.name;
      this.repitionFactor = pattern.repitionFactor;
      this.colorGradientLengthFactor = pattern.colorGradientLengthFactor;

      if (pattern instanceof LEDPatternImpl) {
        this.colors = pattern.colors;
      } else {
        this.colors = pattern.colors.map(RGBColor.fromApiModelColor);
      }
    } else {
      this.colors = [];
      this.repitionFactor = RepititionFactorMin;
      this.colorGradientLengthFactor = ColorGradientLengthFactorMin;
      this.name = "";
    }
  }

  public canAddColor(): boolean {
    return this.colors.length < ColorCountMax;
  }

  public canRemoveColor(): boolean {
    return this.colors.length > ColorCountMin;
  }

  public addColor(color: RGBColor) {
    if (this.canAddColor()) {
      this.colors.push(color);
    }
  }

  public addHexColor(hexColor: string) {
    const color = RGBColor.fromHex(hexColor);

    if (color !== undefined) {
      this.addColor(color);
    }
  }

  public setColor(index: number, color: RGBColor) {
    this.colors[index] = color;
  }

  public setHexColor(index: number, hexColor: string) {
    const color = RGBColor.fromHex(hexColor);

    if (color !== undefined) {
      this.colors[index] = color;
    }
  }

  public removeColor(index: number | undefined) {
    if (this.canRemoveColor()) {
      if (index === undefined) {
        this.colors.pop();
      } else if (index < this.colors.length) {
        this.colors.splice(index, 1);
      }
    }
  }

  public static createRandomPattern() {
    const randomPattern = new LEDPatternImpl();

    const colorCount = getRandomInt(ColorCountMin, ColorCountMax);
    for (let i = 0; i < colorCount; i++) {
      randomPattern.colors.push(RGBColor.createRandomColor());
    }

    randomPattern.repitionFactor = getRandom(RepititionFactorMin, RepititionFactorMax);
    randomPattern.colorGradientLengthFactor = getRandom(ColorGradientLengthFactorMin, ChaseGradientLengthFactorMax);

    //TODO: nice example names
    randomPattern.name = "Foobar";

    return randomPattern;
  }
}
