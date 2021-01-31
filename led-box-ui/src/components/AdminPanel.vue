<style scoped></style>

<template>
  <v-app>
    <v-main>
      <v-card outlined>
        <v-card-title>Server</v-card-title>
        <v-card-text>
          <v-row>
            <v-btn depressed color="error" :disabled="!shutdownArmed">
              Shutdown
            </v-btn>
            <v-checkbox v-model="shutdownArmed" label="Arm"></v-checkbox>
          </v-row>
        </v-card-text>
      </v-card>
      <v-card outlined>
        <v-card-title>Database</v-card-title>
        <v-card-text>
          <v-row>
            <v-btn depressed color="error" :disabled="!restoreDatabaseArmed">
              Reset
            </v-btn>
            <v-checkbox v-model="restoreDatabaseArmed" label="Arm"></v-checkbox>
          </v-row>
          <v-row>
            <v-btn depressed color="error" :disabled="!deleteDatabaseArmed">
              Delete everything
            </v-btn>
            <v-checkbox v-model="deleteDatabaseArmed" label="Arm"></v-checkbox>
          </v-row>
        </v-card-text>
      </v-card>
    </v-main>
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
