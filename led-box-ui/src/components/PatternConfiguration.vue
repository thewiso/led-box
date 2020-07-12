<style scoped>
.color-container {
  padding-bottom: 0;
}
.led-color-number {
  margin-left: 10px;
}
.color-add-button-container {
  padding-top: 16px;
}
</style>

<template>
  <v-card>
    <v-toolbar color="primary">
      <v-btn icon @click="$emit('configurationFinished')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>Settings</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn text @click="$emit('configurationFinished')">Save</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card color="secondary">
            <v-container>
              <LedPreview id="pattenConfigurationLedPreview" :ledPattern="ledPattern"></LedPreview>
            </v-container>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card color="secondary">
            <v-card-title>Colors</v-card-title>
            <v-container class="color-container">
              <v-row align="start" justify="center">
                <v-col cols="12" v-for="(color, index) in ledPattern.colors" :key="index">
                  <v-card :color="color.toString()" shaped>
                    <v-card-actions>
                      <div class="text-h6 led-color-number" v-text="index + 1 + '.'"></div>
                      <v-spacer></v-spacer>
                      <v-btn icon @click="openPickColorDialog(index)">
                        <v-icon>mdi-pencil-outline</v-icon>
                      </v-btn>
                      <v-btn icon :disabled="!ledPattern.canRemoveColor()" @click="removeColor(index)">
                        <v-icon>mdi-trash-can-outline</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
              <v-row class="color-add-button-container">
                <v-spacer></v-spacer>
                <v-col cols="auto">
                  <v-btn
                    fab
                    color="accent"
                    small
                    class="add-color-fab"
                    @click="openPickColorDialog()"
                    v-if="ledPattern.canAddColor()"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card color="secondary">
            <v-card-title>Color Settings</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-subheader>Repition rate</v-subheader>
                  <v-slider
                    v-model="ledPattern.repitionFactor"
                    :min="minRepititonFactor"
                    :max="maxRepitionFactor"
                    :step="0"
                    :disabled="ledPattern.colors.length <= 1"
                  ></v-slider>
                </v-col>
                <v-col cols="12">
                  <v-subheader>Color gradient</v-subheader>
                  <v-slider
                    v-model="ledPattern.colorGradientLengthFactor"
                    :min="minColorGradient"
                    :max="maxColorGradient"
                    :step="0"
                    :disabled="ledPattern.colors.length <= 1"
                  ></v-slider>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card color="secondary">
            <v-card-title>Animation Settings</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-radio-group v-model="ledPattern.animationType" row>
                    <v-radio label="No Animation" :value="animationTypeEnum.None"></v-radio>
                    <v-radio label="Blink" :value="animationTypeEnum.Blink"></v-radio>
                    <v-radio label="Chase" :value="animationTypeEnum.Chase"></v-radio>
                  </v-radio-group>
                </v-col>
                <!-- BLINKING: -->
                <v-col cols="12" v-if="ledPattern.animationType == animationTypeEnum.Blink">
                  <v-subheader>Blink speed</v-subheader>
                  <v-slider
                    v-model="ledPattern.blinkSpeed"
                    :min="minBlinkSpeed"
                    :max="maxBlinkSpeed"
                    :step="0"
                  ></v-slider>
                </v-col>
                <v-col cols="12" v-if="ledPattern.animationType == animationTypeEnum.Blink">
                  <v-subheader>Blink dimming</v-subheader>
                  <v-slider
                    v-model="ledPattern.blinkDimmingPeriodFactor"
                    :min="minBlinkDimmingPeriodFactor"
                    :max="maxBlinkDimmingPeriodFactor"
                    :step="0"
                  ></v-slider>
                </v-col>
                <!-- LIGHT CHASE: -->
                <v-col cols="12" v-if="ledPattern.animationType == animationTypeEnum.Chase">
                  <v-subheader>Chase speed</v-subheader>
                  <v-slider
                    v-model="ledPattern.chaseSpeed"
                    :min="minChaseSpeed"
                    :max="maxChaseSpeed"
                    :step="0"
                  ></v-slider>
                </v-col>
                <v-col cols="12" v-if="ledPattern.animationType == animationTypeEnum.Chase">
                  <v-subheader>Chase length</v-subheader>
                  <v-slider
                    v-model="ledPattern.chaseLengthFactor"
                    :min="minChaseLengthFactor"
                    :max="maxChaseLengthFactor"
                    :step="0"
                  ></v-slider>
                </v-col>
                <v-col cols="12" v-if="ledPattern.animationType == animationTypeEnum.Chase">
                  <v-subheader>Chase gradient</v-subheader>
                  <v-slider
                    v-model="ledPattern.chaseGradientLengthFactor"
                    :min="minChaseGradientLengthFactor"
                    :max="maxChaseGradientLengthFactor"
                    :step="0"
                  ></v-slider>
                </v-col>
                <v-col cols="12" v-if="ledPattern.animationType == animationTypeEnum.Chase">
                  <v-subheader>Chase color</v-subheader>
                  <v-radio-group v-model="ledPattern.isPatternChaseBackground" :mandatory="false" row>
                    <v-radio label="Use pattern as chase color" :value="false"></v-radio>
                    <v-radio label="Use pattern as background" :value="true"></v-radio>
                  </v-radio-group>
                  <div v-if="ledPattern.isPatternChaseBackground">
                    <v-btn depressed :color="ledPattern.chaseForeground.toString()">Normal</v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="pickColorDialogOpen" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar color="accent">
          <v-btn icon @click="closePickColorDialog()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Pick Color</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn text @click="closePickColorDialog(true)">Save</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container>
          <v-row align="start" justify="center">
            <v-col cols="auto">
              <v-color-picker v-model="pickColorDialogColor" flat hide-mode-switch></v-color-picker>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";//TODO: font color contrast in buttons for color picking
import LedPattern, {
  MIN_REPITION_FACTOR,
  MAX_REPITION_FACTOR,
  MIN_COLOR_GRADIENT_LENGTH_FACTOR,
  MAX_COLOR_GRADIENT_LENGTH_FACTOR,
  DEFAULT_COLOR,
  AnimationType,
  MAX_BLINK_SPEED,
  MIN_BLINK_SPEED,
  MIN_BLINK_DIMMING_PERIOD_FACTOR,
  MAX_BLINK_DIMMING_PERIOD_FACTOR,
  MIN_CHASE_SPEED,
  MAX_CHASE_SPEED,
  MIN_CHASE_LENGTH_FACTOR,
  MAX_CHASE_LENGTH_FACTOR,
  MIN_CHASE_GRADIENT_LENGTH_FACTOR,
} from "../utils/LedPattern";
import LedPreview from "./LedPreview.vue";

export default Vue.extend({
  name: "PatternConfiguration",
  components: {
    LedPreview,
  },
  props: {
    patternId: {
      type: Number,
      required: false,
    },
  },
  data: () => ({
    ledPattern: new LedPattern(),
    pickColorDialogOpen: false,
    pickColorDialogColor: "",
    pickColorDialogColorIndex: -1,

    //const values:
    minRepititonFactor: MIN_REPITION_FACTOR,
    maxRepitionFactor: MAX_REPITION_FACTOR,
    minColorGradient: MIN_COLOR_GRADIENT_LENGTH_FACTOR,
    maxColorGradient: MAX_COLOR_GRADIENT_LENGTH_FACTOR,

    animationTypeEnum: AnimationType,

    minBlinkSpeed: MIN_BLINK_SPEED,
    maxBlinkSpeed: MAX_BLINK_SPEED,
    minBlinkDimmingPeriodFactor: MIN_BLINK_DIMMING_PERIOD_FACTOR,
    maxBlinkDimmingPeriodFactor: MAX_BLINK_DIMMING_PERIOD_FACTOR,

    minChaseSpeed: MIN_CHASE_SPEED,
    maxChaseSpeed: MAX_CHASE_SPEED,
    minChaseLengthFactor: MIN_CHASE_LENGTH_FACTOR,
    maxChaseLengthFactor: MAX_CHASE_LENGTH_FACTOR,
    minChaseGradientLengthFactor: MIN_CHASE_GRADIENT_LENGTH_FACTOR,
    maxChaseGradientLengthFactor: MAX_COLOR_GRADIENT_LENGTH_FACTOR,
  }),
  methods: {
    getTitle() {
      if (this.patternId === undefined) {
        return "Create new pattern";
      } else {
        return "Edit pattern";
      }
    },
    openPickColorDialog(colorIndex?: number) {
      let color: string;
      if (colorIndex === undefined) {
        colorIndex = -1;
        color = DEFAULT_COLOR.toHex();
      } else {
        color = this.ledPattern.colors[colorIndex].toHex();
      }
      this.pickColorDialogColorIndex = colorIndex;
      this.pickColorDialogColor = color;
      this.pickColorDialogOpen = true;
    },
    closePickColorDialog(save?: boolean) {
      if (save) {
        const color = this.pickColorDialogColor;
        if (this.pickColorDialogColorIndex === -1) {
          this.ledPattern.addHexColor(color);
        } else {
          this.ledPattern.setHexColor(this.pickColorDialogColorIndex, color);
        }
      }
      this.pickColorDialogOpen = false;
    },
    removeColor(colorIndex: number) {
      this.ledPattern.removeColor(colorIndex);
    },
  },
  watch: {
    patternId: function(newVal, oldVal) {
      if (newVal === undefined) {
        this.ledPattern = new LedPattern();
      } else {
        //TODO
      }
    },
  },
});
</script>
