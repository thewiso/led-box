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
import LedPattern, { AnimationType } from "../utils/LedPattern";
import RGBColor from "../utils/RGBColor";

const LED_RADIUS = 5;
const LED_DIAMETER = LED_RADIUS * 2;
const CORNER_OFFSET = Math.sqrt(2) * LED_RADIUS;

const LOOP_VERTICAL_LED_COUNT = 5;
const LOOP_HORIZONTAL_LED_COUNT = 2; //Has to be even!
const LOOP_HORIZONTAL_LED_COUNT_HALF = LOOP_HORIZONTAL_LED_COUNT / 2;

const LOOP_WIDTH = (LOOP_HORIZONTAL_LED_COUNT - 1) * LED_DIAMETER + CORNER_OFFSET * 2;
const LOOP_HEIGHT = LOOP_VERTICAL_LED_COUNT * LED_DIAMETER + CORNER_OFFSET * 2;
const LOOP_LED_COUNT = LOOP_VERTICAL_LED_COUNT + LOOP_HORIZONTAL_LED_COUNT;

const LED_PATH = new Path2D();
//center x, center y, radius, start angle, end angle
LED_PATH.arc(LED_RADIUS, LED_RADIUS, LED_RADIUS, 0, Math.PI * 2);

export default Vue.extend({
  name: "LedPreview",
  props: {
    id: {
      type: String,
      required: true,
    },
    ledPattern: {
      type: LedPattern,
      required: true,
    },
  },
  components: {},

  data: () => ({
    //const variables:
    loopHeight: Math.ceil(LOOP_HEIGHT),

    //non const variables:
    backgroundCanvas: null as null | HTMLCanvasElement,
    foregroundCanvas: null as null | HTMLCanvasElement,
    backgroundContext: null as null | CanvasRenderingContext2D,
    foregroundContext: null as null | CanvasRenderingContext2D,
    canvasContainer: null as null | HTMLDivElement,

    backgroundColor: RGBColor.White,
    horizontalOffset: 0,
    loopCount: 0,
    ledIndex: 0,
    ledColors: new Array<RGBColor>(),
    animationRequestId: null as null | number,
    blinkToggleDuration: 0,
    blinkDimmingDuration: 0,
  }),
  methods: {
    init() {
      this.backgroundCanvas = document.getElementById(this.id + "-background") as HTMLCanvasElement;
      this.foregroundCanvas = document.getElementById(this.id + "-foreground") as HTMLCanvasElement;

      this.backgroundContext = this.backgroundCanvas.getContext("2d");
      this.foregroundContext = this.foregroundCanvas.getContext("2d");

      this.canvasContainer = document.getElementById(this.id + "-container") as HTMLDivElement;
      this.canvasContainer.style.height = this.loopHeight + "px";

      //find out background
      let currentElement = this.canvasContainer as HTMLElement | null;
      let foundColor = false;
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
    },
    onResize() {
      if (this.backgroundCanvas && this.foregroundCanvas) {
        const width = this.backgroundCanvas.clientWidth;
        if (width != this.backgroundCanvas.width) {
          this.backgroundCanvas.width = width;
          this.foregroundCanvas.width = width;

          this.loopCount = Math.floor(width / LOOP_WIDTH);
          this.horizontalOffset = (width % LOOP_WIDTH) / 2;

          this.onPatternChange();
        }
      }
    },
    onPatternChange() {
      const ledCount = this.loopCount * LOOP_LED_COUNT;
      this.fillLedColorArray(ledCount);

      if (this.animationRequestId !== null) {
        window.cancelAnimationFrame(this.animationRequestId);
      }
      this.clearForeground();

      if (this.ledPattern.animationType === AnimationType.None) {
        this.drawPattern();
      } else if (this.ledPattern.animationType === AnimationType.Blink) {
        this.blinkToggleDuration = Math.round(1000 / this.ledPattern.blinkSpeed / 2);

        if (this.ledPattern.blinkDimmingPeriodFactor > 0) {
          this.blinkDimmingDuration = this.blinkToggleDuration * this.ledPattern.blinkDimmingPeriodFactor;
        }

        this.drawPattern();
        this.animationRequestId = window.requestAnimationFrame(timeStamp => this.animateBlink(timeStamp, false, 0));
      } else if (this.ledPattern.animationType === AnimationType.Chase) {
        this.drawPattern();
      }
    },
    clearForeground() {
      if (this.foregroundContext !== null && this.foregroundCanvas) {
        this.foregroundContext.clearRect(0, 0, this.foregroundCanvas.width, this.loopHeight);
      }
    },
    drawPattern() {
      if (this.backgroundContext && this.backgroundCanvas) {
        this.ledIndex = 0;

        this.backgroundContext.setTransform(1, 0, 0, 1, 0, 0);
        this.backgroundContext.clearRect(0, 0, this.backgroundCanvas.width, this.backgroundCanvas.height);
        this.backgroundContext.translate(this.horizontalOffset, 0);

        for (let loopIndex = 0; loopIndex < this.loopCount; loopIndex++) {
          let verticalDirectionFactor = 1;
          if (loopIndex % 2 !== 0) {
            verticalDirectionFactor = -1;
          }

          this.drawLedPath(this.backgroundContext, LOOP_HORIZONTAL_LED_COUNT_HALF, LED_DIAMETER, 0);
          this.backgroundContext.translate(CORNER_OFFSET, CORNER_OFFSET * verticalDirectionFactor);
          this.drawLedPath(this.backgroundContext, LOOP_VERTICAL_LED_COUNT, 0, LED_DIAMETER * verticalDirectionFactor);
          this.backgroundContext.translate(CORNER_OFFSET, CORNER_OFFSET * verticalDirectionFactor);
          this.drawLedPath(this.backgroundContext, LOOP_HORIZONTAL_LED_COUNT_HALF, LED_DIAMETER, 0);
          this.backgroundContext.translate(LED_DIAMETER, 0);
        }
      }
    },
    drawLedPath(backgroundContext: CanvasRenderingContext2D, count: number, xTranslation = 0, yTranslation = 0) {
      for (let i = 0; i < count; i++) {
        if (i > 0) {
          backgroundContext.translate(xTranslation, yTranslation);
        }
        this.drawLed(backgroundContext);
      }
    },
    drawLed(backgroundContext: CanvasRenderingContext2D) {
      let ledColor = null as null | RGBColor;
      if (this.ledPattern.repitionFactor === 0) {
        if (this.ledIndex < this.ledColors.length) {
          ledColor = this.ledColors[this.ledIndex];
        }
      } else {
        const index = this.ledIndex % this.ledColors.length;
        ledColor = this.ledColors[index];
      }

      if (ledColor !== null) {
        backgroundContext.fillStyle = ledColor.toString();
        backgroundContext.fill(LED_PATH);
      }
      this.ledIndex++;
    },
    fillLedColorArray(ledCount: number) {
      const colorCount = this.ledPattern.colors.length;
      const ledColorShare = Math.floor(ledCount / colorCount);

      let ledCountPerColorInRepition = Math.ceil((1 - this.ledPattern.repitionFactor) * ledColorShare);
      if (ledCountPerColorInRepition === 0) {
        ledCountPerColorInRepition = 1;
      }
      const ledCountPerRepition = ledCountPerColorInRepition * colorCount;
      const colorGradientLengthPerColor = Math.floor(
        ledCountPerColorInRepition * this.ledPattern.colorGradientLengthFactor,
      );
      const colorGradientMergeFactor = 1 / (colorGradientLengthPerColor * 2 + 1);

      this.ledColors = new Array<RGBColor>();
      for (let i = 0; i < this.ledPattern.colors.length; i++) {
        const currentColor = this.ledPattern.colors[i];
        const previousColorIndex = i > 0 ? i - 1 : this.ledPattern.colors.length - 1;
        const previousColor = this.ledPattern.colors[previousColorIndex];
        const nextColorIndex = i < this.ledPattern.colors.length - 1 ? i + 1 : 0;
        const nextColor = this.ledPattern.colors[nextColorIndex];

        for (let j = 0; j < ledCountPerColorInRepition; j++) {
          let ledColor = currentColor;
          if (this.ledPattern.colorGradientLengthFactor > 0 && ledCountPerColorInRepition > 1) {
            if (j < colorGradientLengthPerColor) {
              const ledInGradientIndex = j + colorGradientLengthPerColor;
              const gradientFactor = colorGradientMergeFactor * (ledInGradientIndex + 1);
              ledColor = previousColor.blend(currentColor, gradientFactor);
            } else if (j >= ledCountPerColorInRepition - colorGradientLengthPerColor) {
              const ledInGradientIndex = j - ledCountPerColorInRepition + colorGradientLengthPerColor;
              const gradientFactor = colorGradientMergeFactor * (ledInGradientIndex + 1);
              ledColor = currentColor.blend(nextColor, gradientFactor);
            }
          }

          this.ledColors.push(ledColor);
        }
      }
    },
    animateBlink(timeStamp: number, currentBlinkState: boolean, nextToggleTimestamp: number) {
      if (this.foregroundContext && this.foregroundCanvas) {
        let dimmingColorFactor = null as null | number;
        if (timeStamp >= nextToggleTimestamp) {
          currentBlinkState = !currentBlinkState;
          nextToggleTimestamp = timeStamp + this.blinkToggleDuration;

          dimmingColorFactor = currentBlinkState ? 0 : 1;
        }

        if (
          this.ledPattern.blinkDimmingPeriodFactor > 0 &&
          dimmingColorFactor === null &&
          timeStamp >= nextToggleTimestamp - this.blinkDimmingDuration
        ) {
          dimmingColorFactor = (nextToggleTimestamp - timeStamp) / this.blinkDimmingDuration;
          if (currentBlinkState) {
            dimmingColorFactor = 1 - dimmingColorFactor;
          }
        }

        if (dimmingColorFactor !== null) {
          this.clearForeground();
          this.foregroundContext.fillStyle = this.backgroundColor.toRGBAString(dimmingColorFactor);
          this.foregroundContext.fillRect(0, 0, this.foregroundCanvas.width, this.loopHeight);
        }
      }
      this.animationRequestId = window.requestAnimationFrame(timeStamp =>
        this.animateBlink(timeStamp, currentBlinkState, nextToggleTimestamp),
      );
    },
  },
  mounted() {
    //FIXME: well... there has to be a better way!

    setTimeout(this.init, 500);
  },
  updated() {
    // console.log("updated")
    // this.resize();
  },
  watch: {
    ledPattern: {
      handler(newVal, oldVal) {
        //TODO: change of array
        this.onPatternChange();
      },
      deep: true,
    },
  },
});
</script>
