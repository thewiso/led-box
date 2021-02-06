import {
  DefaultApi,
  LEDPattern,
  RunPatternRequest,
  Configuration,
  CreatePatternRequest,
  UpdatePatternRequest,
} from "@/api";
import * as runtime from "@/api/runtime.ts";
import store from "@/store";
import BlinkLEDPatternImpl from "@/utils/BlinkLEDPatternImpl";
import ChaseLEDPatternImpl from "@/utils/ChaseLEDPatternImpl";
import LEDPatternImpl from "@/utils/LEDPatternImpl";
import { LEDPatternToJSON, NumberApiResponse } from "@/utils/ApiUtils";

const BASE_PATH =
  process.env.VUE_APP_API_BASE_PATH_USE_WINDOW_LOCATION == "true"
    ? `http://${window.location.host}/api`
    : process.env.VUE_APP_API_BASE_PATH;

console.log(`API base path is "${BASE_PATH}"`);

const LedBoxApi = new (class extends DefaultApi {
  constructor() {
    super(new Configuration({ basePath: BASE_PATH }));
  }

  async getPatterns(): Promise<Array<LEDPattern>> {
    const response = await this.getPatternsRaw();
    const ledPatterns = await response.value();

    const parsedLedPatterns = ledPatterns.map(ledPattern => {
      if (BlinkLEDPatternImpl.instanceOfBlinkLEDPattern(ledPattern)) {
        return new BlinkLEDPatternImpl(ledPattern);
      } else if (ChaseLEDPatternImpl.instanceOfChaseLEDPattern(ledPattern)) {
        return new ChaseLEDPatternImpl(ledPattern);
      } else {
        return new LEDPatternImpl(ledPattern);
      }
    });

    store.commit("clearPatterns");
    store.commit("addPatterns", parsedLedPatterns);

    return parsedLedPatterns;
  }

  async getActivePattern(): Promise<number> {
    const response = await this.getActivePatternRaw();
    const activePatternId = await response.value();

    store.commit("setActivePatternId", activePatternId);
    return activePatternId;
  }

  async runPattern(requestParameters: RunPatternRequest): Promise<void> {
    await this.runPatternRaw(requestParameters);
    //only executed if no error is thrown:
    store.commit("setActivePatternId", requestParameters.body);
  }

  async stopPattern(): Promise<void> {
    await this.stopPatternRaw();
    //only executed if no error is thrown:
    store.commit("setActivePatternId", null);
  }

  async createPatternRaw(requestParameters: CreatePatternRequest): Promise<runtime.ApiResponse<number>> {
    if (requestParameters.lEDPattern === null || requestParameters.lEDPattern === undefined) {
      throw new runtime.RequiredError(
        "lEDPattern",
        "Required parameter requestParameters.lEDPattern was null or undefined when calling createPattern.",
      );
    }
    const queryParameters = {};

    const headerParameters: runtime.HTTPHeaders = {};

    headerParameters["Content-Type"] = "application/json";

    const response = await this.request({
      path: `/led-patterns`,
      method: "POST",
      headers: headerParameters,
      query: queryParameters,
      body: LEDPatternToJSON(requestParameters.lEDPattern),
    });

    return new NumberApiResponse(response);
  }

  async updatePatternRaw(requestParameters: UpdatePatternRequest): Promise<runtime.ApiResponse<void>> {
    if (requestParameters.id === null || requestParameters.id === undefined) {
      throw new runtime.RequiredError(
        "id",
        "Required parameter requestParameters.id was null or undefined when calling updatePattern.",
      );
    }

    if (requestParameters.lEDPattern === null || requestParameters.lEDPattern === undefined) {
      throw new runtime.RequiredError(
        "lEDPattern",
        "Required parameter requestParameters.lEDPattern was null or undefined when calling updatePattern.",
      );
    }

    const queryParameters = {};

    const headerParameters: runtime.HTTPHeaders = {};

    headerParameters["Content-Type"] = "application/json";

    const response = await this.request({
      path: `/led-patterns/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters.id))),
      method: "PATCH",
      headers: headerParameters,
      query: queryParameters,
      body: LEDPatternToJSON(requestParameters.lEDPattern),
    });

    return new runtime.VoidApiResponse(response);
  }

  async getActivePatternRaw(): Promise<runtime.ApiResponse<number>> {
    const queryParameters = {};

    const headerParameters: runtime.HTTPHeaders = {};

    const response = await this.request({
      path: `/led-patterns/active`,
      method: "GET",
      headers: headerParameters,
      query: queryParameters,
    });

    return new NumberApiResponse(response);
  }
})();
export default LedBoxApi;
