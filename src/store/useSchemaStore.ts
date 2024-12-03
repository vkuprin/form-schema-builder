import { create } from "zustand";
import type { Schema } from "@/types/schema";

interface SchemaStore {
  schema: Schema;
  setSchema: (schema: Schema) => void;
  resetSchema: () => void;
}

export const useSchemaStore = create<SchemaStore>((set) => ({
  schema: { runnables: [] },

  setSchema: (newSchema) =>
    set(() => ({
      schema: newSchema,
    })),

  resetSchema: () =>
    set(() => ({
      schema: { runnables: [] },
    })),
}));
