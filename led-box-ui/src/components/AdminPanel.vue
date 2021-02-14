<style scoped>
.buttonRow {
  margin-bottom: 30px;
}
</style>

<template>
  <v-app>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-btn color="primary" @click="navigateBack()">
            <v-icon left>mdi-chevron-double-left</v-icon>
            {{ this.$t("adminPanel.back") }}
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card outlined>
            <v-card-title>
              {{ this.$t("adminPanel.categories.server") }}
            </v-card-title>
            <v-card-text>
              <v-row align="center" no-gutters>
                <v-col cols="12">
                  <v-btn depressed color="error" :disabled="!shutdownArmed" @click="shutdown()">
                    {{ this.$t("adminPanel.shutdown") }}
                  </v-btn>
                </v-col>
                <v-col cols="12">
                  <v-checkbox v-model="shutdownArmed" :label="this.$t('adminPanel.armButton')"></v-checkbox>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card outlined>
            <v-card-title>
              {{ this.$t("adminPanel.categories.database") }}
            </v-card-title>
            <v-card-text>
              <v-row align="center" no-gutters class="buttonRow">
                <v-col cols="12">
                  <v-btn depressed color="error" :disabled="!resetDatabaseArmed" @click="resetDatabase()">
                    {{ this.$t("adminPanel.reset") }}
                  </v-btn>
                </v-col>
                <v-col cols="12">
                  <v-checkbox v-model="resetDatabaseArmed" :label="this.$t('adminPanel.armButton')"></v-checkbox>
                </v-col>
              </v-row>
              <v-row align="center" no-gutters>
                <v-col cols="12">
                  <v-btn depressed color="error" :disabled="!clearDatabaseArmed" @click="clearDatabase()">
                    {{ this.$t("adminPanel.delete") }}
                  </v-btn>
                </v-col>
                <v-col cols="auto">
                  <v-checkbox v-model="clearDatabaseArmed" :label="this.$t('adminPanel.armButton')"></v-checkbox>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import LedBoxApi from "@/api/LedBoxApi";

@Component
export default class AdminPanel extends Vue {
  shutdownArmed = false;
  resetDatabaseArmed = false;
  clearDatabaseArmed = false;
  mounted() {
    this.shutdownArmed = false;
    this.resetDatabaseArmed = false;
    this.clearDatabaseArmed = false;
  }

  navigateBack() {
    this.$router.push("/");
  }
  shutdown() {
    LedBoxApi.shutdownServer().catch(); //TODO:;
    this.shutdownArmed = false;
  }
  resetDatabase() {
    LedBoxApi.deleteAllPatterns({ restoreExamples: true })
      .then(() => this.fetchData())
      .catch(); //TODO:
    this.resetDatabaseArmed = false;
  }
  clearDatabase() {
    LedBoxApi.deleteAllPatterns({ restoreExamples: false })
      .then(() => this.fetchData())
      .catch(); //TODO:
    this.clearDatabaseArmed = false;
  }
  fetchData() {
    LedBoxApi.getPatterns().catch(); //TODO: snackbar error
    LedBoxApi.getActivePattern().catch(); //TODO: snackbar error
  }
}
</script>
