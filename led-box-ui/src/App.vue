<style scoped>
.app-bar-title {
  padding-left: 20px;
}
.led-pattern-list {
  margin-bottom: 100px;
}
</style>

<template>
  <v-app>
    <v-app-bar app color="primary">
      <v-icon large color="accent">mdi-led-on</v-icon>
      <v-toolbar-title class="app-bar-title">LED Manager</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn icon @click="fetchData()">
          <v-icon large>mdi-refresh</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-main>
      <v-list class="led-pattern-list">
        <template v-for="(ledPattern, index) in ledPatterns">
          <v-list-item :key="ledPattern.id + '-' + index">
            <v-list-item-content>
              <v-list-item-title v-text="ledPattern.name"></v-list-item-title>
            </v-list-item-content>

            <v-list-item-action v-if="ledPattern.id == activePatternId">
              <v-btn icon @click="stopPattern()">
                <v-icon color="orange darken-1"> mdi-pause </v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action v-else>
              <v-btn icon @click="startPattern(ledPattern.id)">
                <v-icon color="green darken-1"> mdi-play </v-icon>
              </v-btn>
            </v-list-item-action>

            <v-list-item-action>
              <v-btn icon @click="editPattern(ledPattern.id)">
                <v-icon> mdi-pencil </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider v-if="index < ledPatterns.length - 1" :key="index"></v-divider>
        </template>
      </v-list>
      <v-btn fixed fab bottom right color="primary" @click="createPattern()">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-dialog v-model="patternConfigurationDialogOpen" fullscreen hide-overlay transition="dialog-bottom-transition">
        <PatternConfiguration @configurationFinished="closeConfigurationDialog()" :patternId="selectedPatternId" />
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import PatternConfiguration from "@/components/PatternConfiguration.vue";
import yaml from "js-yaml";
import { ReadConstraintsFromOpenApiYaml } from "@/utils/LEDPatternConstraints";
import LedBoxApi from "@/utils/LedBoxApi";

export default Vue.extend({
  name: "App",

  components: {
    PatternConfiguration,
  },

  mounted: function() {
    this.fetchData();

    fetch(process.env.VUE_APP_API_BASE_PATH + "/openapi.yaml")
      .then(response => response.text())
      .then(this.parseModelRangesFromYaml)
      .catch //TODO:
      ();
  },

  data: () => ({
    patternConfigurationDialogOpen: false,
    selectedPatternId: null as number | null,
  }),
  methods: {
    createPattern: function() {
      this.selectedPatternId = null;
      this.patternConfigurationDialogOpen = true;
    },
    closeConfigurationDialog: function() {
      this.patternConfigurationDialogOpen = false;
    },
    fetchData: function() {
      LedBoxApi.getPatterns().catch(); //TODO: snackbar error
      LedBoxApi.getActivePattern().catch(); //TODO: snackbar error
    },
    startPattern(patternId: number) {
      LedBoxApi.runPattern({ body: patternId })
        .catch //TODO: snackbar error
        ();
    },
    stopPattern() {
      LedBoxApi.stopPattern()
        .catch //TODO: snackbar error
        ();
    },
    editPattern: function(patternId: number) {
      this.selectedPatternId = patternId;
      this.patternConfigurationDialogOpen = true;
    },
    parseModelRangesFromYaml(yamlString: string) {
      try {
        const yamlDoc = yaml.load(yamlString);
        ReadConstraintsFromOpenApiYaml(yamlDoc);
      } catch (e) {
        //TODO:
      }
    },
  },
  computed: {
    activePatternId() {
      return this.$store.state.activePatternId;
    },
    ledPatterns() {
      return this.$store.state.ledPatterns;
    },
  },
});
</script>
