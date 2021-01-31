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


import * as runtime from '../runtime';
import {
    LEDPattern,
    LEDPatternFromJSON,
    LEDPatternToJSON,
} from '../models';

export interface CreatePatternRequest {
    lEDPattern: LEDPattern;
}

export interface DeleteAllPatternsRequest {
    body?: boolean;
}

export interface RunPatternRequest {
    body: number;
}

export interface UpdatePatternRequest {
    id: number;
    lEDPattern: LEDPattern;
}

/**
 * 
 */
export class DefaultApi extends runtime.BaseAPI {

    /**
     */
    async createPatternRaw(requestParameters: CreatePatternRequest): Promise<runtime.ApiResponse<number>> {
        if (requestParameters.lEDPattern === null || requestParameters.lEDPattern === undefined) {
            throw new runtime.RequiredError('lEDPattern','Required parameter requestParameters.lEDPattern was null or undefined when calling createPattern.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/led-patterns`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: LEDPatternToJSON(requestParameters.lEDPattern),
        });

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     */
    async createPattern(requestParameters: CreatePatternRequest): Promise<number> {
        const response = await this.createPatternRaw(requestParameters);
        return await response.value();
    }

    /**
     * Delete all patterns
     */
    async deleteAllPatternsRaw(requestParameters: DeleteAllPatternsRequest): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/led-patterns`,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.body as any,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Delete all patterns
     */
    async deleteAllPatterns(requestParameters: DeleteAllPatternsRequest): Promise<void> {
        await this.deleteAllPatternsRaw(requestParameters);
    }

    /**
     * Get currently active pattern id
     */
    async getActivePatternRaw(): Promise<runtime.ApiResponse<number>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/led-patterns/active`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Get currently active pattern id
     */
    async getActivePattern(): Promise<number> {
        const response = await this.getActivePatternRaw();
        return await response.value();
    }

    /**
     * Get all patterns
     */
    async getPatternsRaw(): Promise<runtime.ApiResponse<Array<LEDPattern>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/led-patterns`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(LEDPatternFromJSON));
    }

    /**
     * Get all patterns
     */
    async getPatterns(): Promise<Array<LEDPattern>> {
        const response = await this.getPatternsRaw();
        return await response.value();
    }

    /**
     * Put new active pattern
     */
    async runPatternRaw(requestParameters: RunPatternRequest): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.body === null || requestParameters.body === undefined) {
            throw new runtime.RequiredError('body','Required parameter requestParameters.body was null or undefined when calling runPattern.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/led-patterns/active`,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters.body as any,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Put new active pattern
     */
    async runPattern(requestParameters: RunPatternRequest): Promise<void> {
        await this.runPatternRaw(requestParameters);
    }

    /**
     * Shutdown server and hosting system
     */
    async shutdownServerRaw(): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/server/shutdown`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Shutdown server and hosting system
     */
    async shutdownServer(): Promise<void> {
        await this.shutdownServerRaw();
    }

    /**
     * Stop currently active pattern
     */
    async stopPatternRaw(): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/led-patterns/active`,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Stop currently active pattern
     */
    async stopPattern(): Promise<void> {
        await this.stopPatternRaw();
    }

    /**
     */
    async updatePatternRaw(requestParameters: UpdatePatternRequest): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.id === null || requestParameters.id === undefined) {
            throw new runtime.RequiredError('id','Required parameter requestParameters.id was null or undefined when calling updatePattern.');
        }

        if (requestParameters.lEDPattern === null || requestParameters.lEDPattern === undefined) {
            throw new runtime.RequiredError('lEDPattern','Required parameter requestParameters.lEDPattern was null or undefined when calling updatePattern.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/led-patterns/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: LEDPatternToJSON(requestParameters.lEDPattern),
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async updatePattern(requestParameters: UpdatePatternRequest): Promise<void> {
        await this.updatePatternRaw(requestParameters);
    }

}
