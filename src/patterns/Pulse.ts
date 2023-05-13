import { Pattern } from "@/src/types/Pattern";
import pulse from "./shaders/pulse.frag";

export const Pulse = () => {
  const params = {
    u_hue_start: {
      name: "Hue Start",
      value: 0,
    },
    u_hue_width: {
      name: "Hue Width",
      value: 0.8,
    },
    u_duty_cycle: {
      name: "Duty Cycle",
      value: 0.5,
    },
    u_time_factor: {
      name: "Time Factor",
      value: 0.4,
    },
    u_time_offset: {
      name: "Time Offset",
      value: 0,
    },
    u_wave_period: {
      name: "Wave Period",
      value: 0.25,
    },
    u_wave_amplitude: {
      name: "Wave Amplitude",
      value: 0,
    },
    u_number_colors: {
      name: "Number of Colors",
      value: 4,
    },
  };
  return new Pattern<typeof params>("Pulse", pulse, params);
};