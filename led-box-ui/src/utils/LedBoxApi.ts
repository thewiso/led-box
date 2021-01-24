import { DefaultApi, LEDPattern, RunPatternRequest, Configuration } from "@/api";
import store from "@/store";
import BlinkLEDPatternImpl from "@/utils/BlinkLEDPatternImpl";
import ChaseLEDPatternImpl from "@/utils/ChaseLEDPatternImpl";
import LEDPatternImpl from "@/utils/LEDPatternImpl";

const BASE_PATH =
  process.env.VUE_APP_API_BASE_PATH_USE_WINDOW_LOCATION == "true"
    ? `http://${window.location.host}/api`
    : process.env.VUE_APP_API_BASE_PATH;

// eslint-disable-next-line no-console
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
})();
export default LedBoxApi;
