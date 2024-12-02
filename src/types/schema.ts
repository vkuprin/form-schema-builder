export type InputType =
  | "dropdown"
  | "slider"
  | "textarea"
  | "toggle"
  | "action"
  | "output"
  | "initialInput";

export interface Option {
  label: string;
  value: string;
}

export interface Input {
  name: string;
  label: string;
  type: InputType;
  order?: number;
  required: boolean;
  description?: string;
  defaultValue?: string | number | boolean | Option[];
  options?: Option[];
  min?: number;
  max?: number;
  step?: number;
  mark?: string;
  actionType?: string;
  outputKey?: string;
  initialInputKey?: string;
}

export interface OutputConfig {
  dataTitle?: string;
  tip?: string;
}

export interface Runnable {
  type: "initial" | "secondary";
  path: string;
  inputs: Input[];
  output?: OutputConfig;
}

export interface Schema {
  runnables: Runnable[];
}
