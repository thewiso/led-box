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
.configuration-container {
  margin-top: 56px;
}
</style>

<template>
  <v-card>
    <v-app-bar color="primary" fixed>
      <v-btn icon @click="close()">
        <v-icon large>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>Edit Pattern</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn icon @click="savePattern()" :disabled="!isPatternValid">
          <v-icon large>mdi-content-save-outline</v-icon>
        </v-btn>
        <v-btn icon @click="saveAndPlayPattern()" :disabled="!isPatternValid">
          <v-icon large>mdi-play-circle-outline</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-container class="configuration-container">
      <v-row>
        <v-col cols="12">
          <v-card color="secondary">
            <v-container>
              <LedPreview
                id="pattenConfigurationLedPreview"
                :ledPattern="ledPattern"
                :ledPatternChangeTimestamp="ledPatternChangeTimestamp"
              ></LedPreview>
            </v-container>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-expansion-panels multiple v-model="activePanels">
            <v-expansion-panel>
              <v-expansion-panel-header color="secondary">General</v-expansion-panel-header>
              <v-expansion-panel-content color="secondary">
                <v-text-field
                  v-model="ledPattern.name"
                  label="Name"
                  required
                  clearable
                  :rules="rules.name"
                ></v-text-field>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header color="secondary">Colors</v-expansion-panel-header>
              <v-expansion-panel-content color="secondary">
                <v-container class="color-container">
                  <v-row align="start" justify="center">
                    <v-col cols="12" v-for="(color, index) in ledPattern.colors" :key="index">
                      <v-card :color="color.toString()" shaped>
                        <v-card-actions>
                          <div
                            class="text-h6 led-color-number"
                            v-text="index + 1 + '.'"
                            :style="{ color: getContrastFontColor(color).toString() }"
                          ></div>
                          <v-spacer></v-spacer>
                          <v-btn icon @click="openPickColorDialog(createColorIdentifier(index))">
                            <v-icon :color="getContrastFontColor(color).toString()">mdi-pencil-outline</v-icon>
                          </v-btn>
                          <v-btn icon :disabled="!ledPattern.canRemoveColor()" @click="removeColor(index)">
                            <v-icon :color="getContrastFontColor(color).toString()">mdi-trash-can-outline</v-icon>
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
                        @click="openPickColorDialog(addColorIdentifier)"
                        v-if="ledPattern.canAddColor()"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header color="secondary">Color Settings</v-expansion-panel-header>
              <v-expansion-panel-content color="secondary">
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
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header color="secondary">Animation Settings</v-expansion-panel-header>
              <v-expansion-panel-content color="secondary">
                <v-row>
                  <v-col cols="12">
                    <v-radio-group v-model="selectedAnimationType" column>
                      <v-radio label="No Animation" :value="animationTypeEnum.None"></v-radio>
                      <v-radio label="Blink" :value="animationTypeEnum.Blink"></v-radio>
                      <v-radio label="Chase" :value="animationTypeEnum.Chase"></v-radio>
                    </v-radio-group>
                  </v-col>
                  <!-- BLINKING: -->
                  <v-col cols="12" v-if="selectedAnimationType == animationTypeEnum.Blink">
                    <v-subheader>Blink speed</v-subheader>
                    <v-slider
                      v-model="ledPattern.blinkSpeed"
                      :min="minBlinkSpeed"
                      :max="maxBlinkSpeed"
                      :step="0"
                    ></v-slider>
                  </v-col>
                  <v-col cols="12" v-if="selectedAnimationType == animationTypeEnum.Blink">
                    <v-subheader>Blink dimming</v-subheader>
                    <v-slider
                      v-model="ledPattern.blinkDimmingPeriodFactor"
                      :min="minBlinkDimmingPeriodFactor"
                      :max="maxBlinkDimmingPeriodFactor"
                      :step="0"
                    ></v-slider>
                  </v-col>
                  <!-- LIGHT CHASE: -->
                  <v-col cols="12" v-if="selectedAnimationType == animationTypeEnum.Chase">
                    <v-subheader>Chase speed</v-subheader>
                    <v-slider
                      v-model="ledPattern.chaseSpeed"
                      :min="minChaseSpeed"
                      :max="maxChaseSpeed"
                      :step="0"
                    ></v-slider>
                  </v-col>
                  <v-col cols="12" v-if="selectedAnimationType == animationTypeEnum.Chase">
                    <v-subheader>Chase length</v-subheader>
                    <v-slider
                      v-model="ledPattern.chaseLengthFactor"
                      :min="minChaseLengthFactor"
                      :max="maxChaseLengthFactor"
                      :step="0"
                    ></v-slider>
                  </v-col>
                  <v-col cols="12" v-if="selectedAnimationType == animationTypeEnum.Chase">
                    <v-subheader>Chase gradient</v-subheader>
                    <v-slider
                      v-model="ledPattern.chaseGradientLengthFactor"
                      :min="minChaseGradientLengthFactor"
                      :max="maxChaseGradientLengthFactor"
                      :step="0"
                    ></v-slider>
                  </v-col>
                  <v-col cols="12" v-if="selectedAnimationType == animationTypeEnum.Chase">
                    <v-subheader>Chase color</v-subheader>
                    <v-radio-group v-model="isPatternChaseColor" :mandatory="false" row>
                      <v-radio label="Use pattern as chase color" :value="true"></v-radio>
                      <v-radio label="Use pattern as background" :value="false"></v-radio>
                    </v-radio-group>
                    <v-row>
                      <v-col cols="6">
                        <v-card v-if="!isPatternChaseColor" :color="ledPattern.chaseForeground.toString()" shaped>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn icon @click="openPickColorDialog(editChaseForegroundColorIdentifier)">
                              <v-icon :color="getContrastFontColor(ledPattern.chaseForeground).toString()">
                                mdi-pencil-outline
                              </v-icon>
                            </v-btn>
                            <v-spacer></v-spacer>
                          </v-card-actions>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="pickColorDialogOpen" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar color="accent">
          <v-btn icon @click="closePickColorDialog()">
            <v-icon large>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Pick Color</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn icon @click="closePickColorDialog(true)">
              <v-icon large>mdi-content-save-outline</v-icon>
            </v-btn>
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
import Vue from "vue";
import LedPreview from "./LedPreview.vue";
import RGBColor from "@/utils/RGBColor";
import {
  RepititionFactorMin,
  RepititionFactorMax,
  ColorGradientLengthFactorMin,
  ColorGradientLengthFactorMax,
  BlinkSpeedMin,
  BlinkSpeedMax,
  BlinkDimmingPeriodFactorMin,
  BlinkDimmingPeriodFactorMax,
  ChaseSpeedMin,
  ChaseSpeedMax,
  ChaseLengthFactorMin,
  ChaseLengthFactorMax,
  ChaseGradientLengthFactorMin,
  ChaseGradientLengthFactorMax,
} from "@/utils/LEDPatternConstraints";
import ChaseLEDPatternImpl from "@/utils/ChaseLEDPatternImpl";
import LEDPatternImpl from "@/utils/LEDPatternImpl";
import LedBoxApi from "@/utils/LedBoxApi";
import BlinkLEDPatternImpl from "@/utils/BlinkLEDPatternImpl";

enum AnimiationType {
  None,
  Blink,
  Chase,
}

class ColorIdentifier {
  public static ADD_COLOR = new ColorIdentifier(-1);
  public static EDIT_CHASE_FOREGROUND_COLOR = new ColorIdentifier(-2);

  public index: number;

  constructor(index: number) {
    this.index = index;
  }
}

export default Vue.extend({
  name: "PatternConfiguration",
  components: {
    LedPreview,
  },
  props: {
    patternId: {
      type: Number,
      default: null,
    },
    reloadPatternIdTimestamp: {
      type: Number,
    },
  },
  data: () => ({
    ledPattern: LEDPatternImpl.createRandomPattern(),
    ledPatternChangeTimestamp: Date.now(),
    pickColorDialogOpen: false,
    pickColorDialogColor: "",
    pickColorDialogColorIdentifier: ColorIdentifier.ADD_COLOR,
    activePanels: [0, 1, 2, 3],

    //const values:
    animationTypeEnum: AnimiationType,

    minRepititonFactor: RepititionFactorMin,
    maxRepitionFactor: RepititionFactorMax,
    minColorGradient: ColorGradientLengthFactorMin,
    maxColorGradient: ColorGradientLengthFactorMax,

    minBlinkSpeed: BlinkSpeedMin,
    maxBlinkSpeed: BlinkSpeedMax,
    minBlinkDimmingPeriodFactor: BlinkDimmingPeriodFactorMin,
    maxBlinkDimmingPeriodFactor: BlinkDimmingPeriodFactorMax,

    minChaseSpeed: ChaseSpeedMin,
    maxChaseSpeed: ChaseSpeedMax,
    minChaseLengthFactor: ChaseLengthFactorMin,
    maxChaseLengthFactor: ChaseLengthFactorMax,
    minChaseGradientLengthFactor: ChaseGradientLengthFactorMin,
    maxChaseGradientLengthFactor: ChaseGradientLengthFactorMax,

    addColorIdentifier: ColorIdentifier.ADD_COLOR,
    editChaseForegroundColorIdentifier: ColorIdentifier.EDIT_CHASE_FOREGROUND_COLOR,

    rules: {
      name: [
        (name: string) => {
          if ((name || "").trim().length == 0) {
            return "Must contain any character except whitespace";
          }
          return true;
        },
      ],
    },
  }),
  computed: {
    isPatternChaseColor: {
      get: function() {
        return this.ledPattern instanceof ChaseLEDPatternImpl && this.ledPattern.chaseForeground === undefined;
      },
      set: function(newValue: boolean) {
        if (!(this.ledPattern instanceof ChaseLEDPatternImpl)) {
          this.ledPattern = new ChaseLEDPatternImpl(this.ledPattern);
        }
        if (this.ledPattern instanceof ChaseLEDPatternImpl) {
          if (newValue && this.ledPattern.chaseForeground !== undefined) {
            this.ledPattern.chaseForeground = undefined;
          } else if (!newValue && this.ledPattern.chaseForeground === undefined) {
            this.ledPattern.chaseForeground = RGBColor.White;
          }
        }
      },
    },
    selectedAnimationType: {
      get: function() {
        if (this.ledPattern instanceof BlinkLEDPatternImpl) {
          return AnimiationType.Blink;
        } else if (this.ledPattern instanceof ChaseLEDPatternImpl) {
          return AnimiationType.Chase;
        } else {
          return AnimiationType.None;
        }
      },
      set: function(newValue: AnimiationType) {
        switch (newValue) {
          case AnimiationType.None:
            this.ledPattern = new LEDPatternImpl(this.ledPattern);
            break;
          case AnimiationType.Blink:
            this.ledPattern = BlinkLEDPatternImpl.createRandomPattern(this.ledPattern);
            break;
          case AnimiationType.Chase:
            this.ledPattern = ChaseLEDPatternImpl.createRandomPattern(this.ledPattern);
            break;
        }
      },
    },
    isPatternValid: {
      get: function() {
        return (this.ledPattern.name || "").trim().length > 0;
      },
    },
  },
  methods: {
    getTitle() {
      if (this.patternId === undefined) {
        return "Create new pattern";
      } else {
        return "Edit pattern";
      }
    },
    openPickColorDialog(colorIdentifier: ColorIdentifier) {
      let color: string;
      if (colorIdentifier === ColorIdentifier.ADD_COLOR) {
        color = RGBColor.createRandomColor().toHex();
      } else if (
        colorIdentifier === ColorIdentifier.EDIT_CHASE_FOREGROUND_COLOR &&
        this.ledPattern instanceof ChaseLEDPatternImpl
      ) {
        if (this.ledPattern.chaseForeground === undefined) {
          color = RGBColor.White.toHex();
        } else {
          color = this.ledPattern.chaseForeground.toHex();
        }
      } else {
        color = this.ledPattern.colors[colorIdentifier.index].toHex();
      }
      this.pickColorDialogColorIdentifier = colorIdentifier;
      this.pickColorDialogColor = color;
      this.pickColorDialogOpen = true;
    },
    closePickColorDialog(save?: boolean) {
      if (save) {
        const color = this.pickColorDialogColor;
        if (this.pickColorDialogColorIdentifier === ColorIdentifier.ADD_COLOR) {
          this.ledPattern.addHexColor(color);
        } else if (
          this.pickColorDialogColorIdentifier === ColorIdentifier.EDIT_CHASE_FOREGROUND_COLOR &&
          this.ledPattern instanceof ChaseLEDPatternImpl
        ) {
          this.ledPattern.chaseForeground = RGBColor.fromHex(color);
        } else {
          this.ledPattern.setHexColor(this.pickColorDialogColorIdentifier.index, color);
          this.ledPatternChangeTimestamp = Date.now();
        }
      }
      this.pickColorDialogOpen = false;
    },
    removeColor(colorIndex: number) {
      this.ledPattern.removeColor(colorIndex);
    },
    getContrastFontColor(color: RGBColor): RGBColor {
      const colorAverage = (color.r + color.g + color.b) / 3;
      if (colorAverage < 128) {
        return RGBColor.White;
      } else {
        return RGBColor.Black;
      }
    },
    createColorIdentifier(index: number) {
      return new ColorIdentifier(index);
    },
    savePattern(): Promise<number> {
      if (this.ledPattern.id !== undefined) {
        const savedPatternId = this.ledPattern.id;
        return LedBoxApi.updatePattern({ id: this.ledPattern.id, lEDPattern: this.ledPattern })
          .then(() => {
            this.$store.commit("setPattern", this.ledPattern);
            this.close();
            return savedPatternId;
          })
          .catch
          //TODO:
          ();
      } else {
        return LedBoxApi.createPattern({ lEDPattern: this.ledPattern })
          .then(id => {
            this.ledPattern.id = id;
            this.$store.commit("addPatterns", this.ledPattern);
            this.close();
            return id;
          })
          .catch
          //TODO:
          ();
      }
    },
    saveAndPlayPattern() {
      this.savePattern().then(id => {
        LedBoxApi.runPattern({ body: id });
      });
    },
    close() {
      this.$emit("configurationFinished");
    },
  },
  watch: {
    reloadPatternIdTimestamp: {
      immediate: true,
      handler() {
        this.activePanels = [0, 1, 2, 3];
        if (this.patternId === null) {
          this.ledPattern = LEDPatternImpl.createRandomPattern();
        } else {
          this.ledPattern = this.$store.getters.getPatternById(this.patternId).clone();
          if (this.ledPattern === undefined) {
            console.error(`No pattern was found for given id ${this.patternId}`);
            this.closePickColorDialog();
          }
        }
      },
    },
  },
});
</script>
