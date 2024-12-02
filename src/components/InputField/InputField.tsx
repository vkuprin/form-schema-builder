import {
  Box,
  Button,
  Text,
  HStack,
  Input,
  Textarea,
  Stack,
  NativeSelectRoot,
  NativeSelectField,
} from "@chakra-ui/react";
import { useFormContext, useWatch, FieldError } from "react-hook-form";
import type { Schema } from "@/types/schema";

interface InputFieldProps {
  runnableIndex: number;
  index: number;
  remove: (index: number) => void;
}

export const InputField = ({
  runnableIndex,
  index,
  remove,
}: InputFieldProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<Schema>();
  const inputType = useWatch({
    name: `runnables.${runnableIndex}.inputs.${index}.type`,
  });

  const inputErrors = errors.runnables?.[runnableIndex]?.inputs?.[index];

  return (
    <Box borderWidth="1px" borderRadius="lg" shadow="sm">
      <Box p={4}>
        <Stack gap={4}>
          <HStack justify="space-between">
            <Text fontWeight="bold">Input #{index + 1}</Text>
            <Button onClick={() => remove(index)} size="sm" colorScheme="red">
              ×
            </Button>
          </HStack>

          {inputErrors && (
            <Box p={2} bg="red.50" borderRadius="md">
              {Object.entries(inputErrors).map(([key, error]) => {
                const fieldError = error as FieldError;
                return (
                  <Text key={key} color="red.500" fontSize="sm">
                    {fieldError?.message || "Invalid field"}
                  </Text>
                );
              })}
            </Box>
          )}

          <Box>
            <Text mb={2}>Name</Text>
            <Input
              {...register(`runnables.${runnableIndex}.inputs.${index}.name`)}
            />
          </Box>

          <Box>
            <Text mb={2}>Label</Text>
            <Input
              {...register(`runnables.${runnableIndex}.inputs.${index}.label`)}
            />
          </Box>

          <Box>
            <Text mb={2}>Type</Text>
            <NativeSelectRoot>
              <NativeSelectField>
                <option value="dropdown">Dropdown</option>
                <option value="slider">Slider</option>
                <option value="textarea">Textarea</option>
                <option value="toggle">Toggle</option>
                <option value="action">Action</option>
                <option value="output">Output</option>
                <option value="initialInput">Initial Input</option>
              </NativeSelectField>
            </NativeSelectRoot>
          </Box>

          <Box>
            <Text mb={2}>Required</Text>
            <input
              type="checkbox"
              {...register(
                `runnables.${runnableIndex}.inputs.${index}.required`,
              )}
            />
          </Box>

          <Box>
            <Text mb={2}>Description</Text>
            <Textarea
              {...register(
                `runnables.${runnableIndex}.inputs.${index}.description`,
              )}
            />
          </Box>

          {inputType === "dropdown" && (
            <Box>
              <Text mb={2}>Options</Text>
              <Textarea
                {...register(
                  `runnables.${runnableIndex}.inputs.${index}.options`,
                )}
                placeholder="Enter options as JSON array: [{'label': 'Option 1', 'value': 'opt1'}]"
              />
            </Box>
          )}

          {inputType === "slider" && (
            <>
              <Box>
                <Text mb={2}>Min</Text>
                <Input
                  {...register(
                    `runnables.${runnableIndex}.inputs.${index}.min`,
                  )}
                  type="number"
                />
              </Box>

              <Box>
                <Text mb={2}>Max</Text>
                <Input
                  {...register(
                    `runnables.${runnableIndex}.inputs.${index}.max`,
                  )}
                  type="number"
                />
              </Box>

              <Box>
                <Text mb={2}>Step</Text>
                <Input
                  {...register(
                    `runnables.${runnableIndex}.inputs.${index}.step`,
                  )}
                  type="number"
                />
              </Box>
            </>
          )}

          {(inputType === "action" ||
            inputType === "output" ||
            inputType === "initialInput") && (
            <Box>
              <Text mb={2}>
                {inputType === "action" ? "Action Type" : "Key"}
              </Text>
              <Input
                {...register(
                  `runnables.${runnableIndex}.inputs.${index}.${
                    inputType === "action"
                      ? "actionType"
                      : inputType === "output"
                        ? "outputKey"
                        : "initialInputKey"
                  }`,
                )}
              />
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
};
