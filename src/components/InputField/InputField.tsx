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
import { SwitchStuff } from "@/ui/switch.tsx";
import { ChangeEvent, useCallback } from "react";
import { useSchemaStore } from "@/store/useSchemaStore";
import { useHistoryStore } from "@/store/useHistoryStore";
import { validateSchema } from "@/validation/utils";
import { RiCloseLine } from "react-icons/ri";

type Option = {
  label: string;
  value: string;
};

type ClearFields =
  | "min"
  | "max"
  | "step"
  | "options"
  | "actionType"
  | "outputKey"
  | "initialInputKey"
  | "description"
  | "defaultValue";

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
  const options = watch(`runnables.${runnableIndex}.inputs.${index}.options`);

  const inputErrors = errors.runnables?.[runnableIndex]?.inputs?.[index];

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as InputType;

    setValue(`runnables.${runnableIndex}.inputs.${index}.type`, newType, {
      shouldValidate: true,
    });

    const clearFields: ClearFields[] = [
      "min",
      "max",
      "step",
      "options",
      "actionType",
      "outputKey",
      "initialInputKey",
      "description",
      "defaultValue",
    ];

    clearFields.forEach((field: ClearFields) => {
      setValue(
        `runnables.${runnableIndex}.inputs.${index}.${field}`,
        undefined,
        {
          shouldValidate: true,
        },
      );
    });

    const currentValues = getValues();
    const currentInput = currentValues.runnables[runnableIndex].inputs[index];

    if (!currentInput.name) {
      setValue(
        `runnables.${runnableIndex}.inputs.${index}.name`,
        `input-${index + 1}`,
        { shouldValidate: true },
      );
    }

    if (!currentInput.label) {
      setValue(
        `runnables.${runnableIndex}.inputs.${index}.label`,
        `Input ${index + 1}`,
        { shouldValidate: true },
      );
    }

    switch (newType) {
      case "slider": {
        const sliderPath =
          `runnables.${runnableIndex}.inputs.${index}` as const;
        setValue(`${sliderPath}.min` as const, 0, { shouldValidate: true });
        setValue(`${sliderPath}.max` as const, 100, { shouldValidate: true });
        setValue(`${sliderPath}.step` as const, 1, { shouldValidate: true });
        break;
      }

      case "dropdown": {
        const dropdownPath =
          `runnables.${runnableIndex}.inputs.${index}` as const;
        setValue(
          `${dropdownPath}.options` as const,
          [
            { label: "Option 1", value: "opt1" },
            { label: "Option 2", value: "opt2" },
          ],
          { shouldValidate: true },
        );
        break;
      }

      case "action": {
        const actionPath =
          `runnables.${runnableIndex}.inputs.${index}` as const;
        setValue(`${actionPath}.actionType` as const, `action-${index + 1}`, {
          shouldValidate: true,
        });
        break;
      }

      case "output": {
        const outputPath =
          `runnables.${runnableIndex}.inputs.${index}` as const;
        setValue(`${outputPath}.outputKey` as const, `output-${index + 1}`, {
          shouldValidate: true,
        });
        break;
      }

      case "initialInput": {
        const initialPath =
          `runnables.${runnableIndex}.inputs.${index}` as const;
        setValue(
          `${initialPath}.initialInputKey` as const,
          `initial-input-${index + 1}`,
          { shouldValidate: true },
        );
        break;
      }
    }

    if (currentInput.description === undefined) {
      setValue(`runnables.${runnableIndex}.inputs.${index}.description`, "", {
        shouldValidate: true,
      });
    }

    if (currentInput.required === undefined) {
      setValue(`runnables.${runnableIndex}.inputs.${index}.required`, false, {
        shouldValidate: true,
      });
    }

    const updatedValues = getValues();
    const validation = validateSchema(updatedValues);
    if (validation.success) {
      setSchema(updatedValues);
      pushToHistory(updatedValues);
    }
  };

  const handleSwitchChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
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
        <Stack gap={4} bg="gray.10" borderRadius="md">
          <HStack justify="space-between">
            <Text fontWeight="bold">Input #{index + 1}</Text>
            <Button
              onClick={handleRemove}
              size="sm"
              colorScheme="red"
              aria-label="Remove Input"
            >
              <RiCloseLine />
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
            <SwitchStuff
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
                minH="200px"
                {...register(
                  `runnables.${runnableIndex}.inputs.${index}.options`,
                  {
                    setValueAs: (value: string | Option[]): Option[] => {
                      if (typeof value === "string") {
                        try {
                          const parsed = JSON.parse(value);
                          if (
                            Array.isArray(parsed) &&
                            parsed.every(
                              (item) =>
                                typeof item === "object" &&
                                "label" in item &&
                                "value" in item &&
                                typeof item.label === "string" &&
                                typeof item.value === "string",
                            )
                          ) {
                            return parsed;
                          }
                        } catch {
                          console.error("Invalid JSON");
                        }
                        return [];
                      }
                      return value;
                    },
                  },
                )}
                value={options ? JSON.stringify(options, null, 2) : ""}
                placeholder='[{"label": "Option 1", "value": "opt1"}, {"label": "Option 2", "value": "opt2"}]'
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
