<style scoped>
.ledPreviewCanvas {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.ledPreviewContainer {
  width: 100%;
  position: relative;
}
</style>

<template>
  <div :id="id + '-container'" class="ledPreviewContainer">
    <canvas :id="id + '-background'" class="ledPreviewCanvas" :height="loopHeight" style="z-index: 0;"> </canvas>
    <canvas :id="id + '-foreground'" class="ledPreviewCanvas" :height="loopHeight" style="z-index: 1;"> </canvas>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import LEDPatternImpl from "@/utils/LEDPatternImpl";
import BlinkLEDPatternImpl from "@/utils/BlinkLEDPatternImpl";
import ChaseLEDPatternImpl from "@/utils/ChaseLEDPatternImpl";
import RGBColor from "@/utils/RGBColor";
import LedCanvasPreview, { LOOP_HEIGHT, LOOP_WIDTH, LOOP_LED_COUNT } from "@/utils/ledCanvasPreview/LedCanvasPreview";
import BlinkLedCanvasPreview from "@/utils/ledCanvasPreview/BlinkLedCanvasPreview";
import ChaseLedCanvasPreview from "@/utils/ledCanvasPreview/ChaseLedCanvasPreview";

@Component
export default class LedPreview extends Vue {
  readonly loopHeight = Math.ceil(LOOP_HEIGHT);

  backgroundCanvas = null as null | HTMLCanvasElement;
  foregroundCanvas = null as null | HTMLCanvasElement;
  backgroundContext = null as null | CanvasRenderingContext2D;
  foregroundContext = null as null | CanvasRenderingContext2D;
  canvasContainer = null as null | HTMLDivElement;

  loopCount = 0;
  ledCount = 0;
  ledCanvasPreview = null as null | LedCanvasPreview;

  @Prop({ required: true })
  id!: string;

  @Prop({ required: true })
  ledPattern!: LEDPatternImpl;

  @Prop({ default: RGBColor.White })
  backgroundColor!: RGBColor;

  //This is a workaround to be able to detect a change of the colors included in "ledPattern". Just watching "ledPattern" with the deep flag won't work
  @Prop({ required: true })
  ledPatternChangeTimestamp!: number;

  init() {
    this.backgroundCanvas = document.getElementById(this.id + "-background") as HTMLCanvasElement;
    this.foregroundCanvas = document.getElementById(this.id + "-foreground") as HTMLCanvasElement;

    this.backgroundContext = this.backgroundCanvas.getContext("2d");
    this.foregroundContext = this.foregroundCanvas.getContext("2d");

    this.canvasContainer = document.getElementById(this.id + "-container") as HTMLDivElement;
    this.canvasContainer.style.height = this.loopHeight + "px";

    //find out background
    let currentElement = this.canvasContainer as HTMLElement | null;
    let foundColor = this.backgroundColor != RGBColor.White;
    while (currentElement !== null && !foundColor) {
      const currentStyle = window.getComputedStyle(currentElement);
      if (currentStyle.backgroundColor !== "rgba(0, 0, 0, 0)" && currentStyle.backgroundColor !== "") {
        foundColor = true;
        const backgroundColorOrNull = RGBColor.fromString(currentStyle.backgroundColor);
        if (backgroundColorOrNull !== null) {
          this.backgroundColor = backgroundColorOrNull;
        } else {
          console.error(`Could not parse background color string ${currentStyle.backgroundColor}`);
          this.backgroundColor = RGBColor.White;
        }
      }
      currentElement = currentElement.parentElement;
    }

    this.onResize();
  }
  onResize() {
    if (this.backgroundCanvas && this.backgroundContext && this.foregroundCanvas && this.foregroundContext) {
      const width = this.backgroundCanvas.clientWidth;
      if (width != this.backgroundCanvas.width) {
        this.backgroundCanvas.width = width;
        this.foregroundCanvas.width = width;

        this.loopCount = Math.floor(width / LOOP_WIDTH);
        const horizontalOffset = (width % LOOP_WIDTH) / 2;

        this.backgroundContext.setTransform(1, 0, 0, 1, 0, 0);
        this.backgroundContext.translate(horizontalOffset, 0);
        this.backgroundContext.save();

        this.foregroundContext.setTransform(1, 0, 0, 1, 0, 0);
        this.foregroundContext.translate(horizontalOffset, 0);
        this.foregroundContext.save();

        this.onPatternChange();
      }
    }
  }
  onPatternChange() {
    if (
      this.foregroundCanvas === null ||
      this.foregroundContext === null ||
      this.backgroundCanvas === null ||
      this.backgroundContext === null
    ) {
      return;
    }

    if (this.ledCanvasPreview !== null) {
      this.ledCanvasPreview.finish();
      this.ledCanvasPreview = null;
    }

    this.ledCount = this.loopCount * LOOP_LED_COUNT;

    if (this.ledPattern instanceof BlinkLEDPatternImpl) {
      this.ledCanvasPreview = new BlinkLedCanvasPreview(
        this.foregroundContext,
        this.backgroundContext,
        this.backgroundCanvas.width,
        this.backgroundCanvas.height,
        this.backgroundColor,
        this.ledPattern.colors,
        this.ledCount,
        this.ledPattern.repitionFactor,
        this.ledPattern.colorGradientLengthFactor,
        this.loopCount,
        this.ledPattern.blinkSpeed,
        this.ledPattern.blinkDimmingPeriodFactor,
      );
    } else if (this.ledPattern instanceof ChaseLEDPatternImpl) {
      this.ledCanvasPreview = new ChaseLedCanvasPreview(
        this.foregroundContext,
        this.backgroundContext,
        this.backgroundCanvas.width,
        this.backgroundCanvas.height,
        this.backgroundColor,
        this.ledPattern.colors,
        this.ledCount,
        this.ledPattern.repitionFactor,
        this.ledPattern.colorGradientLengthFactor,
        this.loopCount,
        this.ledPattern.chaseLengthFactor,
        this.ledPattern.chaseGradientLengthFactor,
        this.ledPattern.chaseSpeed,
        this.ledPattern.chaseForeground,
      );
    } else {
      this.ledCanvasPreview = new LedCanvasPreview(
        this.backgroundContext,
        this.backgroundCanvas.width,
        this.backgroundCanvas.height,
        this.backgroundColor,
        this.ledPattern.colors,
        this.ledCount,
        this.ledPattern.repitionFactor,
        this.ledPattern.colorGradientLengthFactor,
        this.loopCount,
      );
    }

    if (this.ledCanvasPreview !== null) {
      this.ledCanvasPreview.init();
    }
  }

  mounted() {
    //FIXME: well... there has to be a better way!

    setTimeout(this.init, 10);
  }

  @Watch("ledPattern", { deep: true })
  onLedPatternChange() {
    this.onPatternChange();
  }

  @Watch("ledPatternChangeTimestamp", { deep: true })
  onLedPatternChangeTimestampChange() {
    this.onPatternChange();
  }
}
</script>
