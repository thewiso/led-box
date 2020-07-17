import LedCanvasPreview from "./LedCanvasPreview";
import RGBColor from "../RGBColor";

export default class ChaseLedCanvasPreview extends LedCanvasPreview {
  private animationRequestId = null as number | null;
  private foregroundContext: CanvasRenderingContext2D;
  private chaseStepDuration: number;
  private chaseLength: number;
  private chaseForegroundColor: RGBColor | undefined;

  constructor(
    foregroundContext: CanvasRenderingContext2D,
    backgroundContext: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number,
    backgroundColor: RGBColor,
    patternColors: readonly RGBColor[],
    ledCount: number,
    repitionFactor: number,
    colorGradientLengthFactor: number,
    loopCount: number,
    chaseLengthFactor: number,
    chaseSpeed: number,
    chaseForegroundColor?: RGBColor,
  ) {
    super(
      backgroundContext,
      canvasWidth,
      canvasHeight,
      backgroundColor,
      patternColors,
      ledCount,
      repitionFactor,
      colorGradientLengthFactor,
      loopCount,
    );

    this.foregroundContext = foregroundContext;
    this.chaseLength = Math.round(chaseLengthFactor * ledCount);
    if (this.chaseLength < 1) {
      this.chaseLength = 1;
    }

    this.chaseStepDuration = Math.round(1000 / chaseSpeed);
    this.chaseForegroundColor = chaseForegroundColor;
  }

  public init() {
    super.init();

    if (this.chaseForegroundColor === undefined) {
      this.animationRequestId = window.requestAnimationFrame(timeStamp =>
        this.animateChaseWithPatternForeground(timeStamp, 0, 0),
      );
    } else {
      //TODO:
    }
  }

  public finish() {
    if (this.animationRequestId !== null) {
      window.cancelAnimationFrame(this.animationRequestId);
    }

    super.finish();
    this.clearCanvas(this.foregroundContext);
  }

  private animateChaseWithPatternForeground(timeStamp: number, currentIndex: number, nextStepTimestamp: number) {
    if (timeStamp >= nextStepTimestamp) {
      currentIndex %= this.leds.length;
      const endIndex = (currentIndex + this.chaseLength) % this.leds.length;

      // this.drawPattern(
      //   this.foregroundCanvas,
      //   this.foregroundContext,
      //   this.createChaseLedColorsProvider(currentIndex, endIndex),
      // );

      currentIndex++;
      nextStepTimestamp = timeStamp + this.chaseStepDuration;
    }
    this.animationRequestId = window.requestAnimationFrame(timeStamp =>
      this.animateChaseWithPatternForeground(timeStamp, currentIndex, nextStepTimestamp),
    );
  }
  private createChaseLedColorsProvider(startIndex: number, endIndex: number) {
    if (startIndex < endIndex) {
      return (index: number) => {
        const prevIndex = (index - 1) % this.leds.length;
        if (index === prevIndex) {
          return this.backgroundColor;
        }
        if (index >= startIndex && index < endIndex) {
          return this.leds[index % this.leds.length].color;
        }
        return null;
      };
    } else {
      return (index: number) => {
        if (index >= startIndex || index < endIndex) {
          return this.leds[index % this.leds.length].color;
        }
        return null;
      };
    }
  }
}
