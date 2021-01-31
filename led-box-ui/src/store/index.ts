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
