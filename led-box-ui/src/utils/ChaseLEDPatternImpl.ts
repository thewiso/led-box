import { LEDPattern, ChaseLEDPattern } from "@/api/gen";
import LEDPatternImpl from "./LEDPatternImpl";
import RGBColor from "./RGBColor";
import {
  ChaseSpeedMin,
  ChaseSpeedMax,
  ChaseLengthFactorMin,
  ChaseLengthFactorMax,
  ChaseGradientLengthFactorMin,
  ChaseGradientLengthFactorMax,
} from "./LEDPatternConstraints";
import { getRandom } from "./RandomUtils";

export default class ChaseLEDPatternImpl extends LEDPatternImpl implements ChaseLEDPattern {
  public chaseSpeed: number;
  public chaseLengthFactor: number;
  public chaseGradientLengthFactor: number;
  public chaseForeground?: RGBColor;

  constructor(pattern?: LEDPattern) {
    super(pattern);
    this.patternType = "ChaseLEDPattern";

    if (
      pattern !== undefined &&
      (pattern instanceof ChaseLEDPatternImpl || ChaseLEDPatternImpl.instanceOfChaseLEDPattern(pattern))
    ) {
      this.chaseSpeed = pattern.chaseSpeed;
      this.chaseLengthFactor = pattern.chaseLengthFactor;
      this.chaseGradientLengthFactor = pattern.chaseGradientLengthFactor;

      if (pattern.chaseForeground !== undefined) {
        this.chaseForeground = RGBColor.fromApiModelColor(pattern.chaseForeground);
      }
    } else {
      this.chaseSpeed = ChaseSpeedMin;
      this.chaseLengthFactor = ChaseLengthFactorMin;
      this.chaseGradientLengthFactor = ChaseGradientLengthFactorMin;
    }
  }

  public clone(): LEDPatternImpl {
    return new ChaseLEDPatternImpl(this);
  }

  public static createRandomPattern(pattern?: LEDPatternImpl) {
    let randomPattern: ChaseLEDPatternImpl;
    if (pattern !== undefined) {
      randomPattern = new ChaseLEDPatternImpl(pattern);
    } else {
      randomPattern = new ChaseLEDPatternImpl(LEDPatternImpl.createRandomPattern());
    }

    randomPattern.chaseSpeed = getRandom(ChaseSpeedMin, ChaseSpeedMax);
    randomPattern.chaseLengthFactor = getRandom(ChaseLengthFactorMin, ChaseLengthFactorMax);
    randomPattern.chaseGradientLengthFactor = getRandom(ChaseGradientLengthFactorMin, ChaseGradientLengthFactorMax);
    if (Math.random() < 0.5) {
      randomPattern.chaseForeground = RGBColor.createRandomColor();
    }

    return randomPattern;
  }

  public static instanceOfChaseLEDPattern(ledPattern: LEDPattern): ledPattern is ChaseLEDPattern {
    return ledPattern.patternType === "ChaseLEDPattern";
  }
}
