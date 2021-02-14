/* tslint:disable */
/* eslint-disable */
/**
 * LED Box API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from "../runtime";
import {
  BlinkLEDPatternAllOf,
  BlinkLEDPatternAllOfFromJSON,
  BlinkLEDPatternAllOfFromJSONTyped,
  BlinkLEDPatternAllOfToJSON,
  Color,
  ColorFromJSON,
  ColorFromJSONTyped,
  ColorToJSON,
  LEDPattern,
  LEDPatternFromJSON,
  LEDPatternFromJSONTyped,
  LEDPatternToJSON,
} from ".";

/**
 *
 * @export
 * @interface BlinkLEDPattern
 */
export interface BlinkLEDPattern extends LEDPattern {
  /**
   * Describes how often the LED will blink in a second
   * @type {number}
   * @memberof BlinkLEDPattern
   */
  blinkSpeed: number;
  /**
   * Describes how much of the blinking time is used for blinking. 0 = No dimming, 1 = Full period between on and off will be dimmed
   * @type {number}
   * @memberof BlinkLEDPattern
   */
  blinkDimmingPeriodFactor: number;
}

export function BlinkLEDPatternFromJSON(json: any): BlinkLEDPattern {
  return BlinkLEDPatternFromJSONTyped(json, false);
}

export function BlinkLEDPatternFromJSONTyped(json: any, ignoreDiscriminator: boolean): BlinkLEDPattern {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    ...LEDPatternFromJSONTyped(json, ignoreDiscriminator),
    blinkSpeed: json["blinkSpeed"],
    blinkDimmingPeriodFactor: json["blinkDimmingPeriodFactor"],
  };
}

export function BlinkLEDPatternToJSON(value?: BlinkLEDPattern | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    ...LEDPatternToJSON(value),
    blinkSpeed: value.blinkSpeed,
    blinkDimmingPeriodFactor: value.blinkDimmingPeriodFactor,
  };
}
