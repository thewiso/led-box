<style scoped>
.app-bar-title {
  padding-left: 20px;
}
</style>

<template>
  <v-app>
    <v-app-bar app color="primary">
      <v-icon large color="accent">mdi-led-on</v-icon>
      <v-toolbar-title class="app-bar-title">LED Manager</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-btn fixed fab bottom right color="primary" @click="handleAddConfigurationButtonClick">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-dialog v-model="patternConfigurationDialogOpen" fullscreen hide-overlay transition="dialog-bottom-transition">
        <PatternConfiguration @configurationFinished="handleConfigurationFinished" />
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import PatternConfiguration from "./components/PatternConfiguration.vue";

export default Vue.extend({
  name: "App",

  components: {
    PatternConfiguration,
  },

  data: () => ({
    patternConfigurationDialogOpen: false,
  }),
  methods: {
    handleAddConfigurationButtonClick: function() {
      this.patternConfigurationDialogOpen = true;
    },
    handleConfigurationFinished: function() {
      this.patternConfigurationDialogOpen = false;
    },
  },
});
</script>
