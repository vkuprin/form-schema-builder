import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Control, useForm, FormProvider } from "react-hook-form";
import type { Schema } from "@/types/schema";

interface TestWrapperProps {
  children: (props: { control: Control<Schema> }) => ReactNode;
}

export const TestWrapper = ({ children }: TestWrapperProps) => {
  const methods = useForm<Schema>({
    defaultValues: {
      runnables: [
        {
          type: "initial",
          path: "runnable-1",
          inputs: [
            {
              name: "input-1",
              label: "Test Input",
              type: "textarea",
              required: true,
            },
          ],
        },
      ],
    },
  });

  return (
    <ChakraProvider value={defaultSystem}>
      <FormProvider {...methods}>
        {children({ control: methods.control })}
      </FormProvider>
    </ChakraProvider>
  );
};
