export interface AscentType {
  value: string;
  label: string;
  color?: string;
  topRope: boolean;
  tick: boolean; // is an ascent of type that counts as a tick. ie. redpoint, flash and onsight
}
