import RGBColor from "./RGBColor";
import { LEDPattern } from "@/api";
import {
  ColorCountMin,
  ColorCountMax,
  RepititionFactorMin,
  RepititionFactorMax,
  ColorGradientLengthFactorMin,
  ChaseGradientLengthFactorMax,
} from "./LEDPatternConstraints";
import { getRandomInt, getRandom } from "./RandomUtils";

const EXAMPLE_NAMES = [
  [
    "Beautiful",
    "Relaxing",
    "Easy",
    "Cool",
    "Lovely",
    "Mysterious",
    "Glimmering",
    "Thoughtful",
    "Shining",
    "Joyful",
    "Charming",
    "Breathtaking",
    "Calm",
    "Romantic",
    "Impressive",
    "Elegant",
    "Lively",
    "Pleasing",
    "Pretty",
    "Magical",
  ],
  [
    "Dream",
    "Spring",
    "Summer",
    "Dawn",
    "Aurora",
    "Bloom",
    "Sunset",
    "Ascent",
    "Charm",
    "Stream",
    "View",
    "Essence",
    "Fantasy",
    "Gloss",
    "Sensation",
    "Shine",
    "Spark",
    "Spirit",
    "Silence",
    "Relief",
  ],
];

function createRandomName(): string {
  let name = "";
  EXAMPLE_NAMES.forEach(nameGroup => {
    const nameIndex = getRandomInt(0, nameGroup.length - 1);

    if (name.length > 0) {
      name = name + " " + nameGroup[nameIndex];
    } else {
      name = nameGroup[nameIndex];
    }
  });

  return name;
}

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
      this.colors = pattern.colors.map(RGBColor.fromApiModelColor);
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

  public clone(): LEDPatternImpl {
    return new LEDPatternImpl(this);
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
    randomPattern.name = createRandomName();

    return randomPattern;
  }
}
