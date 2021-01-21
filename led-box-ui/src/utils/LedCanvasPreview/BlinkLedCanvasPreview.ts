import LedCanvasPreview from "./LedCanvasPreview";
import RGBColor from "@/utils/RGBColor";

export default class BlinkLedCanvasPreview extends LedCanvasPreview {
  private animationRequestId = null as number | null;
  private blinkToggleDuration: number;
  private blinkDimmingDuration = 0;
  private foregroundContext: CanvasRenderingContext2D;

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
    blinkSpeed: number,
    blinkDimmingPeriodFactor: number,
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
    this.blinkToggleDuration = Math.round(1000 / blinkSpeed / 2);

    if (blinkDimmingPeriodFactor > 0) {
      this.blinkDimmingDuration = this.blinkToggleDuration * blinkDimmingPeriodFactor;
    }
  }

  public init() {
    super.init();
    this.animationRequestId = window.requestAnimationFrame(timeStamp => this.animateBlink(timeStamp, false, 0));
  }

  public finish() {
    if (this.animationRequestId !== null) {
      window.cancelAnimationFrame(this.animationRequestId);
    }

    super.finish();
    this.clearCanvas(this.foregroundContext);
  }

  private animateBlink(timeStamp: number, currentBlinkState: boolean, nextToggleTimestamp: number) {
    let dimmingColorFactor = null as null | number;
    if (timeStamp >= nextToggleTimestamp) {
      currentBlinkState = !currentBlinkState;
      nextToggleTimestamp = timeStamp + this.blinkToggleDuration;

      dimmingColorFactor = currentBlinkState ? 0 : 1;
    }

    if (
      this.blinkDimmingDuration > 0 &&
      dimmingColorFactor === null &&
      timeStamp >= nextToggleTimestamp - this.blinkDimmingDuration
    ) {
      dimmingColorFactor = (nextToggleTimestamp - timeStamp) / this.blinkDimmingDuration;
      if (currentBlinkState) {
        dimmingColorFactor = 1 - dimmingColorFactor;
      }
    }

    if (dimmingColorFactor !== null) {
      this.clearCanvas(this.foregroundContext);
      this.foregroundContext.fillStyle = this.backgroundColor.toRGBAString(dimmingColorFactor);
      this.foregroundContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    this.animationRequestId = window.requestAnimationFrame(timeStamp =>
      this.animateBlink(timeStamp, currentBlinkState, nextToggleTimestamp),
    );
  }
}
