import Led from "@/utils/Led";
import RGBAColor from "@/utils/RGBAColor";
import RGBColor from "@/utils/RGBColor";
import LedCanvasPreview from "./LedCanvasPreview";

type ChaseColorProvider = (led: Led, chaseIndex: number) => RGBColor;

export default class ChaseLedCanvasPreview extends LedCanvasPreview {
  private animationRequestId = null as number | null;
  private foregroundContext: CanvasRenderingContext2D;
  private chaseStepDuration: number;
  private chaseLength: number;
  private chaseGradientLength: number;
  private chaseForegroundColor: RGBColor | undefined;
  private chaseColorProvider: ChaseColorProvider;

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
    chaseGradientLengthFactor: number,
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
    this.chaseForegroundColor = chaseForegroundColor;
    this.chaseLength = Math.round(chaseLengthFactor * ledCount);
    this.chaseGradientLength = Math.floor(this.chaseLength * chaseGradientLengthFactor);

    if (this.chaseLength < 1) {
      this.chaseLength = 1;
    }
    this.chaseStepDuration = Math.round(1000 / chaseSpeed);

    this.chaseColorProvider = this.createChaseColorProvider();
  }

  public init() {
    if (this.chaseForegroundColor === undefined) {
      this.context.fillStyle = this.backgroundColor.toString();
      this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    } else {
      super.init();
    }

    this.animationRequestId = window.requestAnimationFrame(timeStamp => this.animateChase(timeStamp, 0));
  }

  public finish() {
    if (this.animationRequestId !== null) {
      window.cancelAnimationFrame(this.animationRequestId);
    }

    super.finish();
    this.clearCanvas(this.foregroundContext);
  }

  private animateChase(timeStamp: number, previousStartIndex: number, previousTimeStamp?: number) {
    if (previousTimeStamp === undefined) {
      previousTimeStamp = timeStamp;
    }

    const elapsed = timeStamp - previousTimeStamp;
    const elapsedSteps = Math.round(elapsed / this.chaseStepDuration);
    if (elapsedSteps > 0) {
      const startIndex = (previousStartIndex + elapsedSteps) % this.leds.length;

      this.clearCanvas(this.foregroundContext);
      this.drawChase(startIndex);

      previousTimeStamp = timeStamp;
      previousStartIndex = startIndex;
    }
    this.animationRequestId = window.requestAnimationFrame(timeStamp =>
      this.animateChase(timeStamp, previousStartIndex, previousTimeStamp),
    );
  }
  private drawChase(startIndex: number) {
    let chaseIndex = 0;
    let exclusiveEndIndex = startIndex + this.chaseLength;

    for (let i = startIndex; i < Math.min(exclusiveEndIndex, this.leds.length); i++) {
      const led = this.leds[i];
      this.drawChaseLed(led, chaseIndex);
      chaseIndex++;
    }

    if (exclusiveEndIndex > this.leds.length) {
      exclusiveEndIndex %= this.leds.length;
    }
    if (startIndex >= exclusiveEndIndex) {
      for (let i = 0; i < exclusiveEndIndex; i++) {
        const led = this.leds[i];
        this.drawChaseLed(led, chaseIndex);
        chaseIndex++;
      }
    }
  }

  private drawChaseLed(led: Led, chaseIndex: number) {
    const color = this.chaseColorProvider(led, chaseIndex);
    this.drawCircle(this.foregroundContext, color, led.x, led.y);
  }

  private createChaseColorProvider(): ChaseColorProvider {
    let retVal: ChaseColorProvider;
    if (this.chaseForegroundColor === undefined) {
      retVal = (led: Led) => {
        return led.color;
      };
    } else {
      retVal = () => {
        return this.chaseForegroundColor as RGBColor;
      };
    }

    if (this.chaseGradientLength > 0 && this.chaseLength > 1) {
      const risingGradientExclusiveEndIndex = this.chaseGradientLength;
      const descendingGradientStartIndex = this.chaseLength - this.chaseGradientLength;

      return (led: Led, chaseIndex: number) => {
        let alpha = null as number | null;
        if (chaseIndex < risingGradientExclusiveEndIndex) {
          alpha = (chaseIndex + 1) / (this.chaseGradientLength + 1);
        } else if (chaseIndex >= descendingGradientStartIndex) {
          alpha =
            (descendingGradientStartIndex + this.chaseGradientLength - chaseIndex) / (this.chaseGradientLength + 1);
        }

        if (alpha === null) {
          return retVal(led, chaseIndex);
        } else {
          return RGBAColor.fromRGBColor(retVal(led, chaseIndex), alpha);
        }
      };
    } else {
      return retVal;
    }
  }
}
