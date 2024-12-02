import {
  Box,
  Button,
  Input,
  NativeSelectField,
  NativeSelectRoot,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import type { Schema, Input as InputType } from "@/types/schema";

interface FormPreviewProps {
  schema: Schema;
  onSubmit: SubmitHandler<FieldValues>;
}

const renderInput = (input: InputType) => {
  switch (input.type) {
    case "dropdown":
      return (
        <NativeSelectRoot>
          <NativeSelectField>
            {input.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </NativeSelectField>
        </NativeSelectRoot>
      );
    case "slider":
      return (
        <Input
          type="range"
          min={input.min}
          max={input.max}
          step={input.step}
          defaultValue={
            typeof input.defaultValue === "number"
              ? input.defaultValue
              : undefined
          }
        />
      );
    case "textarea":
      return (
        <Input
          as="textarea"
          defaultValue={
            typeof input.defaultValue === "string"
              ? input.defaultValue
              : undefined
          }
        />
      );
    case "toggle":
      return (
        <input
          type="checkbox"
          defaultChecked={
            typeof input.defaultValue === "boolean" ? input.defaultValue : false
          }
        />
      );
    default:
      return (
        <Input
          defaultValue={
            typeof input.defaultValue === "string" ||
            typeof input.defaultValue === "number"
              ? input.defaultValue
              : undefined
          }
        />
      );
  }
};

export const FormPreview = ({ schema, onSubmit }: FormPreviewProps) => {
  const { handleSubmit } = useForm();

  return (
    <Box p={6} borderWidth="1px" borderRadius="lg" bg="white">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={6}>
          {schema.runnables.map((runnable, rIndex) => (
            <Box key={rIndex}>
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                {runnable.path}
              </Text>
              <Stack gap={4}>
                {runnable.inputs.map((input, iIndex) => (
                  <Box key={iIndex}>
                    <Text mb={2}>{input.label}</Text>
                    {renderInput(input)}
                    {input.description && (
                      <Text fontSize="sm" color="gray.600" mt={1}>
                        {input.description}
                      </Text>
                    )}
                    {input.required && (
                      <Text fontSize="sm" color="red.500" mt={1}>
                        Required
                      </Text>
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>
          ))}
          <Button
            type="submit"
            bg="blue.500"
            color="white"
            _hover={{ bg: "blue.600" }}
          >
            Submit
          </Button>
        </Stack>
      </form>
    </Box>
  );
};
