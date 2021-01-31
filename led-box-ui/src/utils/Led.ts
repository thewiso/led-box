import RGBColor from "./RGBColor";

export interface Coordinate {
  x: number;
  y: number;
}

export default interface Led extends Coordinate {
  color: RGBColor;
}
