import RGBColor from "./RGBColor";

const MIN_COLORS_COUNT = 1;
const MAX_COLORS_COUNT = 5;

export const MIN_REPITION_FACTOR = 0; //no repetition
export const MAX_REPITION_FACTOR = 1; //one led per color

export const MIN_COLOR_GRADIENT_LENGTH_FACTOR = 0; //no gradient
export const MAX_COLOR_GRADIENT_LENGTH_FACTOR = 0.5; //gradient length takes half of the leds of any color

export const DEFAULT_COLOR = new RGBColor(128, 0, 128); //purple

export const MIN_BLINK_SPEED = 0.1; //repetitions per second
export const MAX_BLINK_SPEED = 3;

export const MIN_BLINK_DIMMING_PERIOD_FACTOR = 0; //no dimming
export const MAX_BLINK_DIMMING_PERIOD_FACTOR = 1; //full period between on and off

export const MIN_CHASE_SPEED = 1; //leds per second
export const MAX_CHASE_SPEED = 300;

export const MIN_CHASE_LENGTH_FACTOR = 0; //one led
export const MAX_CHASE_LENGTH_FACTOR = 0.99;

export const MIN_CHASE_GRADIENT_LENGTH_FACTOR = 0; //no gradient
export const MAX_CHASE_GRADIENT_LENGTH_FACTOR = 0.5; //gradient length takes half of the leds of the case

export enum AnimationType {
  None,
  Blink,
  Chase,
}
export default class LedPattern {
  private _colors: RGBColor[];
  private _repitionFactor: number;
  private _colorGradientLengthFactor: number;
  private _animationType: AnimationType;
  private _blinkSpeed: number;
  private _blinkDimmingPeriodFactor: number;
  private _chaseSpeed: number;
  private _chaseForeground: RGBColor | undefined;
  private _chaseLengthFactor: number;
  private _chaseGradientLengthFactor: number;

  constructor() {
    this._colors = [];
    this._colors.push(DEFAULT_COLOR);
    this._repitionFactor = MIN_REPITION_FACTOR; //TODO: set to 0 if only one color is in array
    this._colorGradientLengthFactor = MIN_COLOR_GRADIENT_LENGTH_FACTOR; //TODO: set to 0 if only one color is in array

    this._animationType = AnimationType.None;

    this._blinkSpeed = 1;
    this._blinkDimmingPeriodFactor = 0; //TODO: reset all animation specific values after changing the animation type

    this._chaseSpeed = 25;
    this._chaseForeground = undefined;
    this._chaseLengthFactor = 0.1;
    this._chaseGradientLengthFactor = 0;
  }

  public canAddColor(): boolean {
    return this._colors.length < MAX_COLORS_COUNT;
  }

  public canRemoveColor(): boolean {
    return this._colors.length > MIN_COLORS_COUNT;
  }

  public addColor(color: RGBColor) {
    if (this.canAddColor()) {
      this._colors.push(color);
    }
  }

  public addHexColor(hexColor: string) {
    const color = RGBColor.fromHex(hexColor);

    if (color !== undefined) {
      this.addColor(color);
    }
  }

  public setColor(index: number, color: RGBColor) {
    this._colors[index] = color;
  }

  public setHexColor(index: number, hexColor: string) {
    const color = RGBColor.fromHex(hexColor);

    if (color !== undefined) {
      this._colors[index] = color;
    }
  }

  public removeColor(index: number | undefined) {
    if (this.canRemoveColor()) {
      if (index === undefined) {
        this._colors.pop();
      } else if (index < this._colors.length) {
        this._colors.splice(index, 1);
      }
    }
  }

  public get colors(): ReadonlyArray<RGBColor> {
    return this._colors;
  }

  public get repitionFactor(): number {
    return this._repitionFactor;
  }
  public set repitionFactor(value: number) {
    if (value >= MIN_REPITION_FACTOR && value <= MAX_REPITION_FACTOR) {
      this._repitionFactor = value;
    }
  }

  public get colorGradientLengthFactor(): number {
    return this._colorGradientLengthFactor;
  }
  public set colorGradientLengthFactor(value: number) {
    if (value >= MIN_COLOR_GRADIENT_LENGTH_FACTOR && value <= MAX_COLOR_GRADIENT_LENGTH_FACTOR) {
      this._colorGradientLengthFactor = value;
    }
  }

  public get animationType(): AnimationType {
    return this._animationType;
  }

  public set animationType(animationType: AnimationType) {
    this._animationType = animationType;
  }

  public get blinkSpeed(): number {
    return this._blinkSpeed;
  }
  public set blinkSpeed(value: number) {
    this._blinkSpeed = value;
  }

  public get blinkDimmingPeriodFactor(): number {
    return this._blinkDimmingPeriodFactor;
  }
  public set blinkDimmingPeriodFactor(value: number) {
    this._blinkDimmingPeriodFactor = value;
  }

  public get chaseForeground(): RGBColor | undefined {
    return this._chaseForeground;
  }
  public set chaseForeground(value: RGBColor | undefined) {
    this._chaseForeground = value;
  }

  public get chaseLengthFactor(): number {
    return this._chaseLengthFactor;
  }
  public set chaseLengthFactor(value: number) {
    this._chaseLengthFactor = value;
  }

  public get chaseGradientLengthFactor(): number {
    return this._chaseGradientLengthFactor;
  }
  public set chaseGradientLengthFactor(value: number) {
    this._chaseGradientLengthFactor = value;
  }

  public get chaseSpeed(): number {
    return this._chaseSpeed;
  }
  public set chaseSpeed(value: number) {
    this._chaseSpeed = value;
  }
}
