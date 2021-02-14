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
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import yaml from "js-yaml";
import { ReadConstraintsFromOpenApiYaml } from "@/utils/LEDPatternConstraints";
import LedBoxApi from "@/api/LedBoxApi";
import { Languages } from "@/plugins/i18n";

//TODO: use class components
@Component
export default class App extends Vue {
  adminButtonPressCounter = 0;

  mounted() {
    //TODO: check url
    fetch(process.env.VUE_APP_API_BASE_PATH + "/openapi.yaml")
      .then(response => response.text())
      .then(this.parseModelRangesFromYaml)
      .catch //TODO:
      ();
  }

  parseModelRangesFromYaml(yamlString: string) {
    try {
      const yamlDoc = yaml.load(yamlString);
      ReadConstraintsFromOpenApiYaml(yamlDoc);
    } catch (e) {
      //TODO:
    }
  }
  handleAdminButtonClick() {
    if (++this.adminButtonPressCounter >= 5) {
      this.adminButtonPressCounter = 0;
      this.$router.push("/admin");
    }
  }
  fetchData() {
    LedBoxApi.getPatterns().catch(); //TODO: snackbar error
    LedBoxApi.getActivePattern().catch(); //TODO: snackbar error
  }

  get languageFlag(): string {
    switch (this.$i18n.locale) {
      case "en-US":
        return "🇺🇸";
      case "de-DE":
        return "🇩🇪";
      default:
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
}
</script>
