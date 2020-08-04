import RGBColor from "../RGBColor";
import Led, { Coordinate } from "../Led";
import LedPattern from "../LedPattern";

export const LED_RADIUS = 5;
export const LED_DIAMETER = LED_RADIUS * 2;
export const CORNER_OFFSET = Math.round(Math.sqrt(2) * LED_RADIUS);

export const LOOP_VERTICAL_LED_COUNT = 5;
export const LOOP_HORIZONTAL_LED_COUNT = 2; //Has to be even!
export const LOOP_HORIZONTAL_LED_COUNT_HALF = LOOP_HORIZONTAL_LED_COUNT / 2;

export const LOOP_WIDTH = (LOOP_HORIZONTAL_LED_COUNT - 1) * LED_DIAMETER + CORNER_OFFSET * 2;
export const LOOP_HEIGHT = LOOP_VERTICAL_LED_COUNT * LED_DIAMETER + CORNER_OFFSET * 2;
export const LOOP_LED_COUNT = LOOP_VERTICAL_LED_COUNT + LOOP_HORIZONTAL_LED_COUNT;

export default class LedCanvasPreview {
  protected backgroundColor: RGBColor;
  protected leds: Led[];
  protected canvasWidth: number;
  protected canvasHeight: number;

  protected context: CanvasRenderingContext2D;

  constructor(
    context: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number,
    backgroundColor: RGBColor,
    patternColors: readonly RGBColor[],
    ledCount: number,
    repitionFactor: number,
    colorGradientLengthFactor: number,
    loopCount: number,
  ) {
    this.context = context;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.backgroundColor = backgroundColor;
    this.leds = new Array<Led>();

    this.fillLedArray(patternColors, ledCount, repitionFactor, colorGradientLengthFactor, loopCount);
  }

  public init() {
    this.drawPattern();
  }

  public finish() {
    this.clearCanvas(this.context);
  }

  protected clearCanvas(context: CanvasRenderingContext2D) {
    context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  private drawPattern() {
    this.clearCanvas(this.context);

    for (let i = 0; i < this.leds.length; i++) {
      const led = this.leds[i];
      this.drawLed(this.context, led);
    }
  }

  protected drawLed(context: CanvasRenderingContext2D, led: Led) {
    this.drawCircle(context, led.color, led.x, led.y);
  }

  protected drawCircle(context: CanvasRenderingContext2D, color: RGBColor, x: number, y: number) {
    context.fillStyle = color.toString();
    context.beginPath();
    context.arc(x, y, LED_RADIUS, 0, Math.PI * 2);
    context.fill();
  }

  private fillLedArray(
    patternColors: readonly RGBColor[],
    ledCount: number,
    repitionFactor: number,
    colorGradientLengthFactor: number,
    loopCount: number,
  ) {
    //FIRST CALCULATE THE COORDINATES:
    this.leds = new Array<Led>();
    const currentPos: Coordinate = {
      x: LED_RADIUS,
      y: LED_RADIUS,
    };

    for (let loopIndex = 0; loopIndex < loopCount; loopIndex++) {
      let verticalDirectionFactor = 1;
      if (loopIndex % 2 !== 0) {
        verticalDirectionFactor = -1;
      }

      this.pushLedArrayPath(LOOP_HORIZONTAL_LED_COUNT_HALF, currentPos, { x: LED_DIAMETER, y: 0 });
      this.translatePosition(currentPos, { x: CORNER_OFFSET, y: CORNER_OFFSET * verticalDirectionFactor });
      this.pushLedArrayPath(LOOP_VERTICAL_LED_COUNT, currentPos, { x: 0, y: LED_DIAMETER * verticalDirectionFactor });
      this.translatePosition(currentPos, { x: CORNER_OFFSET, y: CORNER_OFFSET * verticalDirectionFactor });
      this.pushLedArrayPath(LOOP_HORIZONTAL_LED_COUNT_HALF, currentPos, { x: LED_DIAMETER, y: 0 });
      this.translatePosition(currentPos, { x: LED_DIAMETER, y: 0 });
    }

    //THEN FILL THE COLORS:
    const colorCount = patternColors.length;
    const ledColorShare = Math.floor(ledCount / colorCount);

    let ledCountPerColorInRepition = Math.ceil((1 - repitionFactor) * ledColorShare);
    if (ledCountPerColorInRepition === 0) {
      ledCountPerColorInRepition = 1;
    }
    const colorGradientLengthPerColor = Math.floor(ledCountPerColorInRepition * colorGradientLengthFactor);
    const colorGradientMergeFactor = 1 / (colorGradientLengthPerColor * 2 + 1);

    for (let i = 0; i < this.leds.length; i++) {
      let currentColorIndex = Math.floor(i / ledCountPerColorInRepition) % colorCount;
      const indexInRepition = i % ledCountPerColorInRepition;

      if (
        colorGradientLengthFactor === 0 &&
        repitionFactor === 0 &&
        currentColorIndex === 0 &&
        i > ledCountPerColorInRepition
      ) {
        //a bit hacky, but otherwise the preview looks off
        currentColorIndex = colorCount - 1;
      }

      let currentColor = patternColors[currentColorIndex];

      if (colorGradientLengthFactor > 0 && ledCountPerColorInRepition > 1) {
        const previousColorIndex = currentColorIndex > 0 ? currentColorIndex - 1 : patternColors.length - 1;
        const previousColor = patternColors[previousColorIndex];
        const nextColorIndex = currentColorIndex < patternColors.length - 1 ? currentColorIndex + 1 : 0;
        const nextColor = patternColors[nextColorIndex];

        if (indexInRepition < colorGradientLengthPerColor) {
          const ledInGradientIndex = indexInRepition + colorGradientLengthPerColor;
          const gradientFactor = colorGradientMergeFactor * (ledInGradientIndex + 1);
          currentColor = previousColor.blend(currentColor, gradientFactor);
        } else if (indexInRepition >= ledCountPerColorInRepition - colorGradientLengthPerColor) {
          const ledInGradientIndex = indexInRepition - ledCountPerColorInRepition + colorGradientLengthPerColor;
          const gradientFactor = colorGradientMergeFactor * (ledInGradientIndex + 1);
          currentColor = currentColor.blend(nextColor, gradientFactor);
        }
      }

      this.leds[i].color = currentColor;
    }
  }

  private pushLedArrayPath(count: number, currentPos: Coordinate, translation: Coordinate) {
    for (let i = 0; i < count; i++) {
      if (i > 0) {
        this.translatePosition(currentPos, translation);
      }

      const newLed: Led = {
        x: currentPos.x,
        y: currentPos.y,
        color: RGBColor.Black,
      };

      this.leds.push(newLed);
    }
  }
  private translatePosition(position: Coordinate, translation: Coordinate) {
    position.x += translation.x;
    position.y += translation.y;
  }
}
