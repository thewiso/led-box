import Vue from "vue";
import Vuex from "vuex";
import { LEDPattern } from "@/api/index";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    ledPatterns: [] as Array<LEDPattern>,
    activePatternId: null as null | number,
  },
  mutations: {
    clearPatterns(state) {
      state.ledPatterns = [];
    },
    addPatterns(state, ledPatterns: Array<LEDPattern>) {
      state.ledPatterns = state.ledPatterns.concat(ledPatterns);
    },
    setActivePatternId(state, activePatternId) {
      state.activePatternId = activePatternId;
    },
    setPattern(state, pattern: LEDPattern) {
      const index = state.ledPatterns.findIndex(ledPattern => ledPattern.id === pattern.id);
      if (index >= 0) {
        state.ledPatterns[index] = pattern;
      }
    },
  },
  actions: {},
  getters: {
    getPatternById: state => (patternId: number) => {
      return state.ledPatterns.find(pattern => pattern.id === patternId);
    },
  },
  modules: {},
});
export default store;
