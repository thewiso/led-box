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

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface BlinkLEDPatternAllOf
 */
export interface BlinkLEDPatternAllOf {
    /**
     * Describes how often the LED will blink in a second
     * @type {number}
     * @memberof BlinkLEDPatternAllOf
     */
    blinkSpeed: number;
    /**
     * Describes how much of the blinking time is used for blinking. 0 = No dimming, 1 = Full period between on and off will be dimmed
     * @type {number}
     * @memberof BlinkLEDPatternAllOf
     */
    blinkDimmingPeriodFactor: number;
}

export function BlinkLEDPatternAllOfFromJSON(json: any): BlinkLEDPatternAllOf {
    return BlinkLEDPatternAllOfFromJSONTyped(json, false);
}

export function BlinkLEDPatternAllOfFromJSONTyped(json: any, ignoreDiscriminator: boolean): BlinkLEDPatternAllOf {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'blinkSpeed': json['blinkSpeed'],
        'blinkDimmingPeriodFactor': json['blinkDimmingPeriodFactor'],
    };
}

export function BlinkLEDPatternAllOfToJSON(value?: BlinkLEDPatternAllOf | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'blinkSpeed': value.blinkSpeed,
        'blinkDimmingPeriodFactor': value.blinkDimmingPeriodFactor,
    };
}


