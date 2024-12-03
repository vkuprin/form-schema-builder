import { create } from "zustand";
import type { Schema, Runnable, Input } from "@/types/schema";

interface SchemaStore {
  schema: Schema;
  setSchema: (schema: Schema) => void;
  addRunnable: (runnable: Runnable) => void;
  removeRunnable: (index: number) => void;
  updateRunnable: (index: number, runnable: Runnable) => void;
  addInput: (runnableIndex: number, input: Input) => void;
  removeInput: (runnableIndex: number, inputIndex: number) => void;
  updateInput: (
    runnableIndex: number,
    inputIndex: number,
    input: Input,
  ) => void;
  reorderInputs: (
    runnableIndex: number,
    startIndex: number,
    endIndex: number,
  ) => void;
  resetSchema: () => void;
}

export const useSchemaStore = create<SchemaStore>((set) => ({
  schema: { runnables: [] },

  setSchema: (newSchema) =>
    set(() => ({
      schema: newSchema,
    })),

  addRunnable: (runnable) =>
    set((state) => ({
      schema: {
        ...state.schema,
        runnables: [...state.schema.runnables, runnable],
      },
    })),

  removeRunnable: (index) =>
    set((state) => ({
      schema: {
        ...state.schema,
        runnables: state.schema.runnables.filter((_, i) => i !== index),
      },
    })),

  updateRunnable: (index, runnable) =>
    set((state) => ({
      schema: {
        ...state.schema,
        runnables: state.schema.runnables.map((r, i) =>
          i === index ? runnable : r,
        ),
      },
    })),

  addInput: (runnableIndex, input) =>
    set((state) => ({
      schema: {
        ...state.schema,
        runnables: state.schema.runnables.map((runnable, index) =>
          index === runnableIndex
            ? { ...runnable, inputs: [...runnable.inputs, input] }
            : runnable,
        ),
      },
    })),

  removeInput: (runnableIndex, inputIndex) =>
    set((state) => ({
      schema: {
        ...state.schema,
        runnables: state.schema.runnables.map((runnable, index) =>
          index === runnableIndex
            ? {
                ...runnable,
                inputs: runnable.inputs.filter((_, i) => i !== inputIndex),
              }
            : runnable,
        ),
      },
    })),

  updateInput: (runnableIndex, inputIndex, input) =>
    set((state) => ({
      schema: {
        ...state.schema,
        runnables: state.schema.runnables.map((runnable, index) =>
          index === runnableIndex
            ? {
                ...runnable,
                inputs: runnable.inputs.map((i, idx) =>
                  idx === inputIndex ? input : i,
                ),
              }
            : runnable,
        ),
      },
    })),

  reorderInputs: (runnableIndex, startIndex, endIndex) =>
    set((state) => {
      const runnable = state.schema.runnables[runnableIndex];
      const newInputs = [...runnable.inputs];
      const [removed] = newInputs.splice(startIndex, 1);
      newInputs.splice(endIndex, 0, removed);

      return {
        schema: {
          ...state.schema,
          runnables: state.schema.runnables.map((r, i) =>
            i === runnableIndex ? { ...r, inputs: newInputs } : r,
          ),
        },
      };
    }),

  resetSchema: () =>
    set(() => ({
      schema: { runnables: [] },
    })),
}));
