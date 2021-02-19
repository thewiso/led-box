<style scoped>
.app-bar-title {
  padding-left: 20px;
}
.language-btn.v-btn {
  font-size: 30px;
}
</style>

<template>
  <v-app>
    <v-app-bar app color="primary">
      <v-icon large color="accent" @click="handleAdminButtonClick()">mdi-led-on</v-icon>
      <v-toolbar-title class="app-bar-title">LED Box</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn text class="language-btn" @click="chooseNextLanguage()">
          {{ languageFlag }}
        </v-btn>
        <v-btn icon @click="fetchData()">
          <v-icon large>mdi-refresh</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
    <v-snackbar v-model="errorSnackbarOpen" timeout="5000" top color="error" app>
      {{ errorSnackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="errorSnackbarOpen = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import yaml from "js-yaml";
import { ReadConstraintsFromOpenApiYaml } from "@/utils/LEDPatternConstraints";
import LedBoxApi from "@/api/LedBoxApi";
import { Languages } from "@/plugins/i18n";
import * as ErrorEventBus from "@/utils/ErrorEventBus";

@Component
export default class App extends Vue {
  adminButtonPressCounter = 0;

  errorSnackbarOpen = false;
  errorSnackbarText = "";
  errorSnackbarWaitingToClose = false;
  errorQueue = new Array<string>();

  mounted() {
    ErrorEventBus.registerErrorHandler(this.handleError);
    fetch(process.env.VUE_APP_API_BASE_PATH + "/openapi.yaml")
      .then(response => response.text())
      .then(this.parseModelConstrainsFromYaml)
      .catch(reason => console.error("Could not fetch openapi.yaml: " + reason));
  }

  parseModelConstrainsFromYaml(yamlString: string) {
    try {
      const yamlDoc = yaml.load(yamlString);
      ReadConstraintsFromOpenApiYaml(yamlDoc);
    } catch (e) {
      console.error("Could not parse model constrains from yaml: " + e);
    }
  }

  handleAdminButtonClick() {
    if (++this.adminButtonPressCounter >= 5) {
      this.adminButtonPressCounter = 0;
      this.$router.push("/admin");
    }
  }

  fetchData() {
    LedBoxApi.getPatterns().catch(reason => {
      ErrorEventBus.emitError(reason, this.$t("errors.loadPatterns").toString());
    });
    LedBoxApi.getActivePattern().catch(reason => {
      ErrorEventBus.emitError(reason, this.$t("errors.loadActivePattern").toString());
    });
  }

  get languageFlag(): string {
    switch (this.$i18n.locale) {
      case "en-US":
        return "🇺🇸";
      case "de-DE":
        return "🇩🇪";
      default:
        // eslint-disable-next-line no-console
        console.warn(`Unknow locale '${this.$i18n.locale}' was set`);
        return "❓";
    }
  }

  chooseNextLanguage() {
    let index = Languages.indexOf(this.$i18n.locale);
    if (index === -1) {
      index = 0;
    } else {
      index = (index + 1) % Languages.length;
    }

    this.$i18n.locale = Languages[index];
  }

  handleError(errorText: string) {
    this.errorQueue.push(errorText);
    this.displayNextError();
  }

  displayNextError() {
    if (!this.errorSnackbarOpen && !this.errorSnackbarWaitingToClose) {
      const nextError = this.errorQueue.pop();
      if (nextError != undefined) {
        this.errorSnackbarText = nextError.valueOf();
        this.errorSnackbarOpen = true;
      }
    }
  }

  @Watch("errorSnackbarOpen")
  onReloadPatternIdTimestamp(newValue: boolean) {
    if (!newValue && !this.errorSnackbarWaitingToClose) {
      this.errorSnackbarWaitingToClose = true;
      window.setTimeout(() => {
        this.errorSnackbarWaitingToClose = false;
        this.displayNextError();
      }, 500);
    }
  }
}
</script>
