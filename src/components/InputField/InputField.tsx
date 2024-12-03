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
import type { InputType, Schema } from "@/types/schema";
import { Switch } from "@/ui/switch.tsx";
import { useCallback } from "react";
import { useSchemaStore } from "@/store/useSchemaStore";
import { useHistoryStore } from "@/store/useHistoryStore";
import { validateSchema } from "@/validation/utils";

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
  const { setSchema } = useSchemaStore();
  const { push: pushToHistory } = useHistoryStore();

  const {
    register,
    setValue,
    getValues,
    formState: { errors },
    watch,
  } = useFormContext<Schema>();

  const inputType = useWatch({
    name: `runnables.${runnableIndex}.inputs.${index}.type`,
  });

  const required = watch(`runnables.${runnableIndex}.inputs.${index}.required`);

  const inputErrors = errors.runnables?.[runnableIndex]?.inputs?.[index];

  const handleTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newType = e.target.value;

      setValue(
        `runnables.${runnableIndex}.inputs.${index}.type`,
        newType as InputType,
      );

      if (newType === "slider") {
        setValue(`runnables.${runnableIndex}.inputs.${index}.min`, 0, {
          shouldValidate: true,
        });
        setValue(`runnables.${runnableIndex}.inputs.${index}.max`, 100, {
          shouldValidate: true,
        });
        setValue(`runnables.${runnableIndex}.inputs.${index}.step`, 1, {
          shouldValidate: true,
        });
      }

      const updatedValues = getValues();
      const validation = validateSchema(updatedValues);
      if (validation.success) {
        setSchema(updatedValues);
        pushToHistory(updatedValues);
      }
    },
    [runnableIndex, index, setValue, getValues, setSchema, pushToHistory],
  );

  const handleSwitchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(
        `runnables.${runnableIndex}.inputs.${index}.required`,
        e.target.checked,
        {
          shouldDirty: true,
          shouldValidate: true,
        },
      );
    },
    [runnableIndex, index, setValue],
  );

  const handleRemove = useCallback(() => {
    remove(index);
    const currentValues = getValues();
    const updatedInputs = currentValues.runnables[runnableIndex].inputs.filter(
      (_, idx) => idx !== index,
    );
    setValue(`runnables.${runnableIndex}.inputs`, updatedInputs, {
      shouldDirty: true,
      shouldValidate: true,
    });
    const updatedValues = getValues();
    const validation = validateSchema(updatedValues);
    if (validation.success) {
      setSchema(updatedValues);
      pushToHistory(updatedValues);
    }
  }, [
    index,
    remove,
    runnableIndex,
    getValues,
    setValue,
    setSchema,
    pushToHistory,
  ]);

  return (
    <Box borderWidth="1px" borderRadius="lg" shadow="sm">
      <Box p={4}>
        <Stack gap={4}>
          <HStack justify="space-between">
            <Text fontWeight="bold">Input #{index + 1}</Text>
            <Button onClick={handleRemove} size="sm" colorScheme="red">
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
              <NativeSelectField onChange={handleTypeChange} value={inputType}>
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
            <Switch
              inputProps={{
                name: `runnables.${runnableIndex}.inputs.${index}.required`,
                onChange: handleSwitchChange,
                checked: required ?? false,
              }}
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
