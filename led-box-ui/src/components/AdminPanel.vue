<style scoped></style>

<template>
  <v-app>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-btn color="primary" @click="navigateBack()">
            <v-icon left>mdi-chevron-double-left</v-icon>
            Back
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card outlined>
            <v-card-title>Server</v-card-title>
            <v-card-text>
              <v-row align="center">
                <v-col cols="auto">
                  <v-btn depressed color="error" :disabled="!shutdownArmed" @click="shutdown()">
                    Shutdown
                  </v-btn>
                </v-col>
                <v-col cols="auto">
                  <v-checkbox v-model="shutdownArmed" label="Arm button (Danger!)"></v-checkbox>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card outlined>
            <v-card-title>Database</v-card-title>
            <v-card-text>
              <v-row align="center">
                <v-col cols="auto">
                  <v-btn depressed color="error" :disabled="!resetDatabaseArmed" @click="resetDatabase()">
                    Reset
                  </v-btn>
                </v-col>
                <v-col cols="auto">
                  <v-checkbox v-model="resetDatabaseArmed" label="Arm button (Danger!)"></v-checkbox>
                </v-col>
              </v-row>
              <v-row align="center">
                <v-col cols="auto">
                  <v-btn depressed color="error" :disabled="!clearDatabaseArmed" @click="clearDatabase()">
                    Delete everything
                  </v-btn>
                </v-col>
                <v-col cols="auto">
                  <v-checkbox v-model="clearDatabaseArmed" label="Arm button (Danger!)"></v-checkbox>
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
import LedBoxApi from "@/utils/LedBoxApi";

export default Vue.extend({
  name: "AdminPanel",

  components: {},

  mounted: function() {
    this.shutdownArmed = false;
    this.resetDatabaseArmed = false;
    this.clearDatabaseArmed = false;
  },

  data: () => ({
    shutdownArmed: false,
    resetDatabaseArmed: false,
    clearDatabaseArmed: false,
  }),
  methods: {
    navigateBack() {
      this.$router.push("/");
    },
    shutdown() {
      LedBoxApi.shutdownServer().catch(); //TODO:;
      this.shutdownArmed = false;
    },
    resetDatabase() {
      LedBoxApi.deleteAllPatterns({ body: true })
        .then(() => this.fetchData())
        .catch(); //TODO:
      this.resetDatabaseArmed = false;
    },
    clearDatabase() {
      LedBoxApi.deleteAllPatterns({ body: false })
        .then(() => this.fetchData())
        .catch(); //TODO:
      this.clearDatabaseArmed = false;
    },
    fetchData() {
      LedBoxApi.getPatterns().catch(); //TODO: snackbar error
      LedBoxApi.getActivePattern().catch(); //TODO: snackbar error
    },
  },
});
</script>
