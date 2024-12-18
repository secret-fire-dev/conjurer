import { Pattern } from "@/src/types/Pattern";
import easternRedbud from "./shaders/easternRedbud.frag";
import { Vector3 } from "three";
import { Palette } from "@/src/types/Palette";

export { easternRedbud };
export const EasternRedbud = () =>
  new Pattern("Eastern Redbud", easternRedbud, {
    u_palette: {
      name: "Palette",
      value: new Palette(
        new Vector3(0.387, 0.8, 0.435),
        new Vector3(0.8, 0.392, 0.071),
        new Vector3(1.497, 1.219, 1.176),
        new Vector3(3.613, 5.485, 0.773),
      ),
    },
    u_time_factor: {
      name: "Time Factor",
      value: 1,
      max: 5,
    },
    u_time_offset: {
      name: "Time Offset",
      value: 0,
      min: -5,
      max: 5,
    },
    u_color_density: {
      name: "Color Density",
      value: 0.5,
    },
    u_period: {
      name: "Period",
      value: 5,
      min: 0.5,
      max: 10,
    },
    u_leaves: {
      name: "Leaves",
      value: 100,
      min: 1,
      max: 100,
      step: 1,
    },
    u_trailing_leaves: {
      name: "Trailing Leaves",
      value: 10,
      min: 0,
      max: 100,
      step: 1,
    },
    u_curve_factor: {
      name: "Curve Factor",
      value: 0.3,
    },
    u_leaf_crispness: {
      name: "Leaf Crispness",
      value: 0.5,
    },
    u_color_change_rate: {
      name: "Color Change Rate",
      value: 0.4,
    },
  });
