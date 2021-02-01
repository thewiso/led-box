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
 * RGB Color
 * @export
 * @interface Color
 */
export interface Color {
    /**
     * Red
     * @type {number}
     * @memberof Color
     */
    r: number;
    /**
     * Green
     * @type {number}
     * @memberof Color
     */
    g: number;
    /**
     * Blue
     * @type {number}
     * @memberof Color
     */
    b: number;
}

export function ColorFromJSON(json: any): Color {
    return ColorFromJSONTyped(json, false);
}

export function ColorFromJSONTyped(json: any, ignoreDiscriminator: boolean): Color {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'r': json['r'],
        'g': json['g'],
        'b': json['b'],
    };
}

export function ColorToJSON(value?: Color | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'r': value.r,
        'g': value.g,
        'b': value.b,
    };
}

