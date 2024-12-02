import { z } from "zod";

export const baseInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  label: z.string().min(1, "Label is required"),
  type: z.enum([
    "dropdown",
    "slider",
    "textarea",
    "toggle",
    "action",
    "output",
    "initialInput",
  ]),
  required: z.boolean(),
  description: z.string().optional(),
  defaultValue: z.any().optional(),
});

export const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const inputSchema = baseInputSchema
  .extend({
    options: z.array(optionSchema).optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    step: z.number().optional(),
    mark: z.string().optional(),
    actionType: z.string().optional(),
    outputKey: z.string().optional(),
    initialInputKey: z.string().optional(),
  })
  .refine(
    (input) => {
      switch (input.type) {
        case "dropdown":
          return Array.isArray(input.options) && input.options.length > 0;
        case "slider":
          return (
            typeof input.min === "number" &&
            typeof input.max === "number" &&
            typeof input.step === "number"
          );
        case "action":
          return !!input.actionType;
        case "output":
          return !!input.outputKey;
        case "initialInput":
          return !!input.initialInputKey;
        default:
          return true;
      }
    },
    {
      message: "Invalid input configuration for the selected type",
    },
  );

export const runnableSchema = z.object({
  type: z.enum(["initial", "secondary"]),
  path: z.string().min(1, "Path is required"),
  inputs: z
    .array(inputSchema)
    .min(1, "At least one input is required")
    .max(20, "Maximum 20 inputs allowed"),
  output: z
    .object({
      dataTitle: z.string().optional(),
      tip: z.string().optional(),
    })
    .optional(),
});

export const formSchema = z.object({
  runnables: z.array(runnableSchema),
});
