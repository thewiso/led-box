import {
  LEDPattern,
  LEDPatternToJSON as LEDPatternToJSONDefault,
  BlinkLEDPatternToJSON,
  ChaseLEDPatternToJSON,
} from "@/api";

import BlinkLEDPatternImpl from "@/utils/BlinkLEDPatternImpl";
import ChaseLEDPatternImpl from "@/utils/ChaseLEDPatternImpl";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function LEDPatternToJSON(value?: LEDPattern | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }

  if (BlinkLEDPatternImpl.instanceOfBlinkLEDPattern(value)) {
    return BlinkLEDPatternToJSON(value);
  } else if (ChaseLEDPatternImpl.instanceOfChaseLEDPattern(value)) {
    return ChaseLEDPatternToJSON(value);
  } else {
    return LEDPatternToJSONDefault(value);
  }
}
