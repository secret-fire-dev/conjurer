import Variation from "@/src/types/Variations/Variation";
import { lerp } from "three/src/math/MathUtils";

export default class LinearVariation extends Variation<number> {
  from: number;
  to: number;

  constructor(duration: number, from: number, to: number) {
    super("linear", duration);

    this.from = from;
    this.to = to;
  }

  valueAtTime = (time: number) =>
    lerp(this.from, this.to, time / this.duration);

  computeDomain = () => [this.from, this.to] as [number, number];

  computeSampledData = (duration: number) => [
    {
      value: this.from,
    },
    {
      value: this.to,
    },
  ];
}
