<style lang="scss" scoped>
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
  padding-top: var(--configuration-container-padding-top);
}

.pattern-preview-header {
  background: var(--pattern-preview-background);
  width: 100%;
  height: var(--pattern-preview-height);
  padding: var(--pattern-preview-padding-top) var(--pattern-preview-padding-side) var(--pattern-preview-padding-bottom);
}
</style>
<style lang="scss">
.pattern-preview-toolbar .v-toolbar__extension {
  padding: 0px;
}
</style>

<template>
  <v-card>
    <v-app-bar color="primary" fixed :extension-height="patternPreviewHeight" class="pattern-preview-toolbar">
      <v-btn icon @click="close()">
        <v-icon large>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>{{ this.title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn icon @click="savePattern()" :disabled="!isPatternValid">
          <v-icon large>mdi-content-save-outline</v-icon>
        </v-btn>
        <v-btn icon @click="saveAndPlayPattern()" :disabled="!isPatternValid">
          <v-icon large>mdi-play-circle-outline</v-icon>
        </v-btn>
      </v-toolbar-items>

      <template v-slot:extension>
        <div class="pattern-preview-header" :style="patternPreviewHeaderCssVars">
          <LedPreview
            v-if="patternPreviewExpanded"
            id="pattenConfigurationLedPreview"
            :ledPattern="ledPattern"
            :ledPatternChangeTimestamp="ledPatternChangeTimestamp"
            :backgroundColor="patternPreviewBackgroundColor"
          ></LedPreview>
          <v-btn fab absolute bottom small color="warning" @click="togglePatternPreviewExpansion()">
            <v-icon v-if="patternPreviewExpanded">mdi-chevron-up</v-icon>
            <v-icon v-else>mdi-chevron-down</v-icon>
          </v-btn>
        </div>
      </template>
    </v-app-bar>

    <v-container class="configuration-container" :style="configurationContainerCssVars">
      <v-row>
        <v-col cols="12">
          <v-expansion-panels multiple v-model="activePanels">
            <v-expansion-panel>
              <v-expansion-panel-header color="secondary">
                {{ this.$t("patternConfiguration.attributes.categories.general") }}
              </v-expansion-panel-header>
              <v-expansion-panel-content color="secondary">
                <v-text-field
                  v-model="ledPattern.name"
                  :label="this.$t('patternConfiguration.attributes.name')"
                  required
                  clearable
                  :rules="rules.name"
                ></v-text-field>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header color="secondary">
                {{ this.$t("patternConfiguration.attributes.categories.colors") }}
              </v-expansion-panel-header>
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
              <v-expansion-panel-header color="secondary">
                {{ this.$t("patternConfiguration.attributes.categories.colorSettings") }}
              </v-expansion-panel-header>
              <v-expansion-panel-content color="secondary">
                <v-row>
                  <v-col cols="12">
                    <v-slider
                      v-model="ledPattern.repitionFactor"
                      :min="minRepititonFactor"
                      :max="maxRepitionFactor"
                      :step="0"
                      :disabled="ledPattern.colors.length <= 1"
                      :hint="this.$t('patternConfiguration.attributes.repititionRateHint')"
                      persistent-hint
                      :label="this.$t('patternConfiguration.attributes.repititionRate')"
                    ></v-slider>
                  </v-col>
                  <v-col cols="12">
                    <v-slider
                      v-model="ledPattern.colorGradientLengthFactor"
                      :min="minColorGradient"
                      :max="maxColorGradient"
                      :step="0"
                      :disabled="ledPattern.colors.length <= 1"
                      :hint="this.$t('patternConfiguration.attributes.colorGradientHint')"
                      persistent-hint
                      :label="this.$t('patternConfiguration.attributes.colorGradient')"
                    ></v-slider>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header color="secondary">
                {{ this.$t("patternConfiguration.attributes.categories.animationSettings") }}
              </v-expansion-panel-header>
              <v-expansion-panel-content color="secondary">
                <v-row>
                  <v-col cols="12">
                    <v-radio-group v-model="selectedAnimationType" column>
                      <v-radio
                        :label="this.$t('patternConfiguration.attributes.noAnimation')"
                        :value="animationTypeEnum.None"
                      ></v-radio>
                      <v-radio
                        :label="this.$t('patternConfiguration.attributes.blinkAnimation')"
                        :value="animationTypeEnum.Blink"
                      ></v-radio>
                      <v-radio
                        :label="this.$t('patternConfiguration.attributes.chaseAnimation')"
                        :value="animationTypeEnum.Chase"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>
                  <!-- BLINKING: -->
                  <v-col cols="12" v-if="selectedAnimationType == animationTypeEnum.Blink">
                    <v-slider
                      v-model="ledPattern.blinkSpeed"
                      :min="minBlinkSpeed"
                      :max="maxBlinkSpeed"
                      :step="0"
                      :hint="this.$t('patternConfiguration.attributes.blinkSpeedHint')"
                      persistent-hint
                      :label="this.$t('patternConfiguration.attributes.blinkSpeed')"
                    ></v-slider>
                  </v-col>
                  <v-col cols="12" v-if="selectedAnimationType == animationTypeEnum.Blink">
                    <v-slider
                      v-model="ledPattern.blinkDimmingPeriodFactor"
                      :min="minBlinkDimmingPeriodFactor"
                      :max="maxBlinkDimmingPeriodFactor"
                      :step="0"
                      :hint="this.$t('patternConfiguration.attributes.blinkDimmingHint')"
                      persistent-hint
                      :label="this.$t('patternConfiguration.attributes.blinkDimming')"
                    ></v-slider>
                  </v-col>
                  <!-- LIGHT CHASE: -->
                  <v-col cols="12" v-if="selectedAnimationType == animationTypeEnum.Chase">
                    <v-slider
                      v-model="ledPattern.chaseSpeed"
                      :min="minChaseSpeed"
                      :max="maxChaseSpeed"
                      :step="0"
                      :hint="this.$t('patternConfiguration.attributes.chaseSpeedHint')"
                      persistent-hint
                      :label="this.$t('patternConfiguration.attributes.chaseSpeed')"
                    ></v-slider>
                  </v-col>
                  <v-col cols="12" v-if="selectedAnimationType == animationTypeEnum.Chase">
                    <v-slider
                      v-model="ledPattern.chaseLengthFactor"
                      :min="minChaseLengthFactor"
                      :max="maxChaseLengthFactor"
                      :step="0"
                      :hint="this.$t('patternConfiguration.attributes.chaseLengthHint')"
                      persistent-hint
                      :label="this.$t('patternConfiguration.attributes.chaseLength')"
                    ></v-slider>
                  </v-col>
                  <v-col cols="12" v-if="selectedAnimationType == animationTypeEnum.Chase">
                    <v-slider
                      v-model="ledPattern.chaseGradientLengthFactor"
                      :min="minChaseGradientLengthFactor"
                      :max="maxChaseGradientLengthFactor"
                      :step="0"
                      :hint="this.$t('patternConfiguration.attributes.chaseGradientHint')"
                      persistent-hint
                      :label="this.$t('patternConfiguration.attributes.chaseGradient')"
                    ></v-slider>
                  </v-col>
                  <v-col cols="12" v-if="selectedAnimationType == animationTypeEnum.Chase">
                    <v-subheader>Chase color</v-subheader>
                    <v-radio-group v-model="isPatternChaseColor" :mandatory="false" row>
                      <v-radio
                        :label="this.$t('patternConfiguration.attributes.isPatternChaseColorTrue')"
                        :value="true"
                      ></v-radio>
                      <v-radio
                        :label="this.$t('patternConfiguration.attributes.isPatternChaseColorFalse')"
                        :value="false"
                      ></v-radio>
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
          <v-toolbar-title>{{ this.$t("patternConfiguration.pickColor") }}</v-toolbar-title>
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
import { Component, Prop, Watch } from "vue-property-decorator";
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
import LedBoxApi from "@/api/LedBoxApi";
import BlinkLEDPatternImpl from "@/utils/BlinkLEDPatternImpl";
import { LOOP_HEIGHT } from "@/utils/ledCanvasPreview/LedCanvasPreview";

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

const PATTERN_PREVIEW_PADDING = 16;
const PATTERN_PREVIEW_PADDING_TOP = 32;

const PATTERN_PREVIEW_HEIGHT = PATTERN_PREVIEW_PADDING + PATTERN_PREVIEW_PADDING_TOP + Math.ceil(LOOP_HEIGHT);
const APP_BAR_HEIGHT = 56;

const PATTERN_PREVIEW_BACKGROUND = `
linear-gradient(
    0deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 1) var(--pattern-preview-gradient-color-stop),
    rgba(255, 255, 255, 0) 100%
)
`;

@Component({ components: { LedPreview } })
export default class PatternConfiguration extends Vue {
  @Prop({ default: null })
  patternId!: number | null;

  @Prop({ required: true })
  reloadPatternIdTimestamp!: number;

  ledPattern = LEDPatternImpl.createRandomPattern();
  ledPatternChangeTimestamp = Date.now();
  pickColorDialogOpen = false;
  pickColorDialogColor = "";
  pickColorDialogColorIdentifier = ColorIdentifier.ADD_COLOR;
  activePanels = [0, 1, 2, 3];
  patternPreviewExpanded = true;

  readonly animationTypeEnum = AnimiationType;

  readonly minRepititonFactor = RepititionFactorMin;
  readonly maxRepitionFactor = RepititionFactorMax;
  readonly minColorGradient = ColorGradientLengthFactorMin;
  readonly maxColorGradient = ColorGradientLengthFactorMax;

  readonly minBlinkSpeed = BlinkSpeedMin;
  readonly maxBlinkSpeed = BlinkSpeedMax;
  readonly minBlinkDimmingPeriodFactor = BlinkDimmingPeriodFactorMin;
  readonly maxBlinkDimmingPeriodFactor = BlinkDimmingPeriodFactorMax;

  readonly minChaseSpeed = ChaseSpeedMin;
  readonly maxChaseSpeed = ChaseSpeedMax;
  readonly minChaseLengthFactor = ChaseLengthFactorMin;
  readonly maxChaseLengthFactor = ChaseLengthFactorMax;
  readonly minChaseGradientLengthFactor = ChaseGradientLengthFactorMin;
  readonly maxChaseGradientLengthFactor = ChaseGradientLengthFactorMax;

  readonly addColorIdentifier = ColorIdentifier.ADD_COLOR;
  readonly editChaseForegroundColorIdentifier = ColorIdentifier.EDIT_CHASE_FOREGROUND_COLOR;

  readonly patternPreviewBackgroundColor = RGBColor.Black;

  rules = {
    name: [
      (name: string) => {
        if ((name || "").trim().length == 0) {
          return this.$t("patternConfiguration.attributes.nameValidationHint");
        }
        return true;
      },
    ],
  };

  get isPatternChaseColor() {
    return this.ledPattern instanceof ChaseLEDPatternImpl && this.ledPattern.chaseForeground === undefined;
  }
  set isPatternChaseColor(newValue: boolean) {
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
  }

  get selectedAnimationType() {
    if (this.ledPattern instanceof BlinkLEDPatternImpl) {
      return AnimiationType.Blink;
    } else if (this.ledPattern instanceof ChaseLEDPatternImpl) {
      return AnimiationType.Chase;
    } else {
      return AnimiationType.None;
    }
  }
  set selectedAnimationType(newValue: AnimiationType) {
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
  }
  get isPatternValid() {
    return (this.ledPattern.name || "").trim().length > 0;
  }

  get title() {
    if (this.patternId != undefined && this.patternId != null) {
      return this.$t("patternConfiguration.editPattern");
    } else {
      return this.$t("patternConfiguration.createPattern");
    }
  }

  get patternPreviewHeaderCssVars() {
    return {
      "--pattern-preview-padding-top": PATTERN_PREVIEW_PADDING_TOP + "px",
      "--pattern-preview-padding-side": PATTERN_PREVIEW_PADDING + "px",
      "--pattern-preview-padding-bottom": PATTERN_PREVIEW_PADDING + "px",
      "--pattern-preview-gradient-color-stop": PATTERN_PREVIEW_PADDING * 2 + Math.ceil(LOOP_HEIGHT) + "px",
      "--pattern-preview-height": this.patternPreviewExpanded ? this.patternPreviewHeight : 0 + "px",
      "--pattern-preview-background": this.patternPreviewExpanded ? PATTERN_PREVIEW_BACKGROUND : "None",
    };
  }

  get configurationContainerCssVars() {
    let paddingTop = APP_BAR_HEIGHT;
    if (this.patternPreviewExpanded) {
      paddingTop += PATTERN_PREVIEW_HEIGHT;
    }
    return {
      "--configuration-container-padding-top": paddingTop + "px",
    };
  }

  get patternPreviewHeight() {
    if (this.patternPreviewExpanded) {
      return PATTERN_PREVIEW_HEIGHT;
    } else {
      return 0;
    }
  }

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
  }
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
  }
  removeColor(colorIndex: number) {
    this.ledPattern.removeColor(colorIndex);
  }
  getContrastFontColor(color: RGBColor): RGBColor {
    const colorAverage = (color.r + color.g + color.b) / 3;
    if (colorAverage < 128) {
      return RGBColor.White;
    } else {
      return RGBColor.Black;
    }
  }
  createColorIdentifier(index: number) {
    return new ColorIdentifier(index);
  }
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
  }
  saveAndPlayPattern() {
    this.savePattern().then(id => {
      LedBoxApi.runPattern({ body: id });
    });
  }
  close() {
    this.$emit("configurationFinished");
  }
  togglePatternPreviewExpansion() {
    this.patternPreviewExpanded = !this.patternPreviewExpanded;
  }

  @Watch("reloadPatternIdTimestamp", { immediate: true })
  onReloadPatternIdTimestamp() {
    this.activePanels = [0, 1, 2, 3];
    this.patternPreviewExpanded = true;
    if (this.patternId === null) {
      this.ledPattern = LEDPatternImpl.createRandomPattern();
    } else {
      this.ledPattern = this.$store.getters.getPatternById(this.patternId).clone();
      if (this.ledPattern === undefined) {
        //TODO:
        console.error(`No pattern was found for given id ${this.patternId}`);
        this.closePickColorDialog();
      }
    }
  }
}
</script>
