import { create } from "zustand";

interface ValidationState {
  errors: Array<{
    path: string[];
    message: string;
  }>;
  setErrors: (errors: Array<{ path: string[]; message: string }>) => void;
  clearErrors: () => void;
}

export const useValidationStore = create<ValidationState>((set) => ({
  errors: [],
  setErrors: (errors) => set({ errors }),
  clearErrors: () => set({ errors: [] }),
}));
