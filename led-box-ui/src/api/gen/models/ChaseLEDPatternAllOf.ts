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
import { Color, ColorFromJSON, ColorFromJSONTyped, ColorToJSON } from ".";

/**
 *
 * @export
 * @interface ChaseLEDPatternAllOf
 */
export interface ChaseLEDPatternAllOf {
  /**
   * Describes how many LED per second the chase will move
   * @type {number}
   * @memberof ChaseLEDPatternAllOf
   */
  chaseSpeed: number;
  /**
   * Describes how many of the strip's LED will be used for the chase. 0 = 1 LED, 0.99 = 99% of LED
   * @type {number}
   * @memberof ChaseLEDPatternAllOf
   */
  chaseLengthFactor: number;
  /**
   * Describes how many of the LED of one the chase create a gradient to the next and previous color. 0 = No gradient, 0.5 Half of the chase's LED create a gradient to the next and previous color
   * @type {number}
   * @memberof ChaseLEDPatternAllOf
   */
  chaseGradientLengthFactor: number;
  /**
   *
   * @type {Color}
   * @memberof ChaseLEDPatternAllOf
   */
  chaseForeground?: Color;
}

export function ChaseLEDPatternAllOfFromJSON(json: any): ChaseLEDPatternAllOf {
  return ChaseLEDPatternAllOfFromJSONTyped(json, false);
}

export function ChaseLEDPatternAllOfFromJSONTyped(json: any, ignoreDiscriminator: boolean): ChaseLEDPatternAllOf {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    chaseSpeed: json["chaseSpeed"],
    chaseLengthFactor: json["chaseLengthFactor"],
    chaseGradientLengthFactor: json["chaseGradientLengthFactor"],
    chaseForeground: !exists(json, "chaseForeground") ? undefined : ColorFromJSON(json["chaseForeground"]),
  };
}

export function ChaseLEDPatternAllOfToJSON(value?: ChaseLEDPatternAllOf | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    chaseSpeed: value.chaseSpeed,
    chaseLengthFactor: value.chaseLengthFactor,
    chaseGradientLengthFactor: value.chaseGradientLengthFactor,
    chaseForeground: ColorToJSON(value.chaseForeground),
  };
}
