<style scoped>
.ledPreviewCanvas {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.ledPreviewContainer {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>

<template>
  <div class="ledPreviewContainer">
    <canvas :id="id" class="ledPreviewCanvas" :height="loopHeight"> </canvas>
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
    canvas: null as null | HTMLCanvasElement,
    context: null as null | CanvasRenderingContext2D,
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
      this.canvas = document.getElementById(this.id) as HTMLCanvasElement;
      this.context = this.canvas.getContext("2d");
      this.onResize();
    },
    onResize() {
      if (this.canvas) {
        const width = this.canvas.clientWidth;
        if (width != this.canvas.width) {
          this.canvas.width = width;

          this.loopCount = Math.floor(width / LOOP_WIDTH);
          this.horizontalOffset = (width % LOOP_WIDTH) / 2;
          this.onPatternChange();
        }
      }
    },
    onPatternChange() {
      if (this.animationRequestId !== null) {
        window.cancelAnimationFrame(this.animationRequestId);
      }

      if (this.ledPattern.animationType === AnimationType.None) {
        this.drawPattern();
      } else if (this.ledPattern.animationType === AnimationType.Blink) {
        this.blinkToggleDuration = Math.round(1000 / this.ledPattern.blinkSpeed / 2);

        if (this.ledPattern.blinkDimmingPeriodFactor === 0) {
          this.animationRequestId = window.requestAnimationFrame(timeStamp => this.animateBlink(timeStamp, false, 0));
        } else {
          this.blinkDimmingDuration = this.blinkToggleDuration * this.ledPattern.blinkDimmingPeriodFactor;
          this.animationRequestId = window.requestAnimationFrame(timeStamp =>
            this.animateDimmedBlink(timeStamp, false, 0),
          );
        }
      } else if (this.ledPattern.animationType === AnimationType.Chase) {
        this.drawPattern();
      }
    },
    drawPattern() {
      if (this.context && this.canvas) {
        const ledCount = this.loopCount * LOOP_LED_COUNT;
        this.ledIndex = 0;

        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.translate(this.horizontalOffset, 0);

        this.fillLedColorArray(ledCount);
        for (let loopIndex = 0; loopIndex < this.loopCount; loopIndex++) {
          let verticalDirectionFactor = 1;
          if (loopIndex % 2 !== 0) {
            verticalDirectionFactor = -1;
          }

          this.drawLedPath(this.context, LOOP_HORIZONTAL_LED_COUNT_HALF, LED_DIAMETER, 0);
          this.context.translate(CORNER_OFFSET, CORNER_OFFSET * verticalDirectionFactor);
          this.drawLedPath(this.context, LOOP_VERTICAL_LED_COUNT, 0, LED_DIAMETER * verticalDirectionFactor);
          this.context.translate(CORNER_OFFSET, CORNER_OFFSET * verticalDirectionFactor);
          this.drawLedPath(this.context, LOOP_HORIZONTAL_LED_COUNT_HALF, LED_DIAMETER, 0);
          this.context.translate(LED_DIAMETER, 0);
        }
      }
    },
    drawLedPath(context: CanvasRenderingContext2D, count: number, xTranslation = 0, yTranslation = 0) {
      for (let i = 0; i < count; i++) {
        if (i > 0) {
          context.translate(xTranslation, yTranslation);
        }
        this.drawLed(context);
      }
    },
    drawLed(context: CanvasRenderingContext2D) {
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
        context.fillStyle = ledColor.toString();
        context.fill(LED_PATH);
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
      if (timeStamp >= nextToggleTimestamp) {
        if (this.context && this.canvas) {
          if (currentBlinkState) {
            this.context.setTransform(1, 0, 0, 1, 0, 0);
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
          } else {
            this.drawPattern();
          }
          currentBlinkState = !currentBlinkState;
          nextToggleTimestamp = timeStamp + this.blinkToggleDuration;
        }
      }
      this.animationRequestId = window.requestAnimationFrame(timeStamp =>
        this.animateBlink(timeStamp, currentBlinkState, nextToggleTimestamp),
      );
    },
    animateDimmedBlink(timeStamp: number, currentBlinkState: boolean, nextToggleTimestamp: number) {
      if (this.context && this.canvas) {
        //TODO: performance
        let dimmingColorFactor = null as null | number;
        if (timeStamp >= nextToggleTimestamp) {
          currentBlinkState = !currentBlinkState;
          nextToggleTimestamp = timeStamp + this.blinkToggleDuration;

          //just to make sure for the moment the dimming is 0 or 1 because it could stay on 0.97 or 0.01 with the logic stated in the second condition
          dimmingColorFactor = currentBlinkState ? 0 : 1;
        }

        if (dimmingColorFactor !== null || timeStamp >= nextToggleTimestamp - this.blinkDimmingDuration) {
          if (dimmingColorFactor === null) {
            dimmingColorFactor = (nextToggleTimestamp - timeStamp) / this.blinkDimmingDuration;
            if (currentBlinkState) {
              dimmingColorFactor = 1 - dimmingColorFactor;
            }
          }

          this.drawPattern();

          this.context.save();
          this.context.setTransform(1, 0, 0, 1, 0, 0);
          this.context.globalAlpha = dimmingColorFactor;
          this.drawPattern();
          this.context.restore();
        }
      }
      this.animationRequestId = window.requestAnimationFrame(timeStamp =>
        this.animateDimmedBlink(timeStamp, currentBlinkState, nextToggleTimestamp),
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
