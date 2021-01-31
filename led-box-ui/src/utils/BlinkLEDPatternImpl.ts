import { BlinkLEDPattern, LEDPattern } from "@/api";
import LEDPatternImpl from "./LEDPatternImpl";
import {
  BlinkSpeedMin,
  BlinkSpeedMax,
  BlinkDimmingPeriodFactorMin,
  BlinkDimmingPeriodFactorMax,
} from "./LEDPatternConstraints";
import { getRandom } from "./RandomUtils";

export default class BlinkLEDPatternImpl extends LEDPatternImpl implements BlinkLEDPattern {
  public blinkSpeed: number;
  public blinkDimmingPeriodFactor: number;

  constructor(pattern?: LEDPattern) {
    super(pattern);
    this.patternType = "BlinkLEDPattern";

    if (
      pattern !== undefined &&
      (pattern instanceof BlinkLEDPatternImpl || BlinkLEDPatternImpl.instanceOfBlinkLEDPattern(pattern))
    ) {
      this.blinkSpeed = pattern.blinkSpeed;
      this.blinkDimmingPeriodFactor = pattern.blinkDimmingPeriodFactor;
    } else {
      this.blinkSpeed = BlinkSpeedMin;
      this.blinkDimmingPeriodFactor = BlinkDimmingPeriodFactorMin;
    }
  }

  public static createRandomPattern(pattern?: LEDPatternImpl) {
    let randomPattern: BlinkLEDPatternImpl;
    if (pattern !== undefined) {
      randomPattern = new BlinkLEDPatternImpl(pattern);
    } else {
      randomPattern = new BlinkLEDPatternImpl(LEDPatternImpl.createRandomPattern());
    }
    randomPattern.blinkSpeed = getRandom(BlinkSpeedMin, BlinkSpeedMax);
    randomPattern.blinkDimmingPeriodFactor = getRandom(BlinkDimmingPeriodFactorMin, BlinkDimmingPeriodFactorMax);

    return randomPattern;
  }

  public static instanceOfBlinkLEDPattern(ledPattern: LEDPattern): ledPattern is BlinkLEDPattern {
    return ledPattern.patternType === "BlinkLEDPattern";
  }
}
