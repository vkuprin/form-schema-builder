import { ZodError } from "zod";
import type { Runnable, Schema } from "../types/schema";
import { runnableSchema, formSchema } from "./schema";

interface ValidationResult {
  success: boolean;
  errors?: Array<{
    path: (string | number)[];
    message: string;
  }>;
}

const formatZodError = (error: ZodError): ValidationResult => {
  return {
    success: false,
    errors: error.errors.map((err) => ({
      path: err.path,
      message: err.message,
    })),
  };
};

export const validateRunnable = (runnable: Runnable): ValidationResult => {
  try {
    runnableSchema.parse(runnable);
    const names = new Set<string>();
    for (const input of runnable.inputs) {
      if (names.has(input.name)) {
        return {
          success: false,
          errors: [
            {
              path: ["inputs"],
              message: `Duplicate input name: ${input.name}`,
            },
          ],
        };
      }
      names.add(input.name);
    }
    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      return formatZodError(error);
    }
    return {
      success: false,
      errors: [{ path: [], message: "Unknown validation error" }],
    };
  }
};

export const validateSchema = (schema: Schema): ValidationResult => {
  try {
    formSchema.parse(schema);

    const pathSet = new Set<string>();
    for (const [index, runnable] of schema.runnables.entries()) {
      if (pathSet.has(runnable.path)) {
        return {
          success: false,
          errors: [
            {
              path: ["runnables", index, "path"],
              message: `Duplicate runnable path: ${runnable.path}`,
            },
          ],
        };
      }
      pathSet.add(runnable.path);

      const runnableValidation = validateRunnable(runnable);
      if (!runnableValidation.success) {
        return {
          success: false,
          errors: runnableValidation.errors?.map((error) => ({
            path: ["runnables", index, ...error.path],
            message: error.message,
          })),
        };
      }
    }

    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      return formatZodError(error);
    }
    return {
      success: false,
      errors: [{ path: [], message: "Unknown validation error" }],
    };
  }
};
