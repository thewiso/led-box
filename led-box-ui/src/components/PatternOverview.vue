<style scoped>
.led-pattern-list {
  margin-bottom: 100px;
}
</style>

<template>
  <v-container fluid>
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
      <PatternConfiguration
        @configurationFinished="closeConfigurationDialog()"
        :patternId="selectedPatternId"
        :reloadPatternIdTimestamp="reloadConfigurationPatternIdTimestamp"
      />
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import PatternConfiguration from "@/components/PatternConfiguration.vue";
import LedBoxApi from "@/utils/LedBoxApi";

@Component({ components: { PatternConfiguration } })
export default class PatternOvierview extends Vue {
  patternConfigurationDialogOpen = false;
  selectedPatternId = null as number | null;
  reloadConfigurationPatternIdTimestamp = Date.now();

  mounted() {
    this.fetchData();
  }

  fetchData() {
    LedBoxApi.getPatterns().catch(); //TODO: snackbar error
    LedBoxApi.getActivePattern().catch(); //TODO: snackbar error
  }
  startPattern(patternId: number) {
    LedBoxApi.runPattern({ body: patternId })
      .catch //TODO: snackbar error
      ();
  }
  stopPattern() {
    LedBoxApi.stopPattern()
      .catch //TODO: snackbar error
      ();
  }
  createPattern() {
    this.startConfigurationDialog(null);
  }
  editPattern(patternId: number) {
    this.startConfigurationDialog(patternId);
  }
  startConfigurationDialog(patternId: number | null) {
    this.selectedPatternId = patternId;
    this.reloadConfigurationPatternIdTimestamp = Date.now();
    this.patternConfigurationDialogOpen = true;
  }
  closeConfigurationDialog() {
    this.patternConfigurationDialogOpen = false;
  }

  get activePatternId() {
    return this.$store.state.activePatternId;
  }
  get ledPatterns() {
    return this.$store.state.ledPatterns;
  }
}
</script>
