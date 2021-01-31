<style scoped></style>

<template>
  <v-app>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-btn color="primary">
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
                  <v-btn depressed color="error" :disabled="!shutdownArmed">
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
                  <v-btn depressed color="error" :disabled="!restoreDatabaseArmed">
                    Reset
                  </v-btn>
                </v-col>
                <v-col cols="auto">
                  <v-checkbox v-model="restoreDatabaseArmed" label="Arm button (Danger!)"></v-checkbox>
                </v-col>
              </v-row>
              <v-row align="center">
                <v-col cols="auto">
                  <v-btn depressed color="error" :disabled="!deleteDatabaseArmed">
                    Delete everything
                  </v-btn>
                </v-col>
                <v-col cols="auto">
                  <v-checkbox v-model="deleteDatabaseArmed" label="Arm button (Danger!)"></v-checkbox>
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
    this.restoreDatabaseArmed = false;
    this.deleteDatabaseArmed = false;
  },

  data: () => ({
    shutdownArmed: false,
    restoreDatabaseArmed: false,
    deleteDatabaseArmed: false,
  }),
  methods: {
    handleAdminButtonClick() {
      LedBoxApi.stopPattern()
        .catch //TODO: snackbar error
        ();
    },
  },
});
</script>
