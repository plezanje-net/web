export interface AscentType {
  value: string;
  label: string;
  icon: string;
  topRope: boolean;
  tick: boolean; // is an ascent of type that counts as a tick. ie. redpoint, flash and onsight
  topRopeTick: boolean;
  color: string;
  order: number;
}
